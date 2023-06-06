import { BigNumber, Contract, ethers } from "ethers";
import { OFTAbi, gravityBridgeAbi, wethAbi } from "global/config/abi";
import {
  CantoTransactionType,
  CosmosTx,
  EVMTx,
  ExtraProps,
} from "global/config/interfaces/transactionTypes";
import { TransactionStore, TxMethod } from "global/stores/transactionStore";
import { _enableTx } from "global/stores/transactionUtils";
import { CANTO_IBC_NETWORK } from "../config/bridgeOutNetworks";
import { Chain, Fee, convertFee, ibcFee } from "global/config/cosmosConstants";
import {
  txConvertCoin,
  txConvertERC20,
} from "./convertCoin/convertTransactions";
import { txIBCTransfer } from "./IBC/IBCTransfer";
import { NativeTransaction } from "../config/interfaces";
import {
  getCosmosAPIEndpoint,
  getCosmosChainObj,
  getCurrentProvider,
} from "global/utils/getAddressUtils";
import { formatUnits } from "ethers/lib/utils";
import {
  BridgingMethods,
  BridgingNetwork,
  GravityBridgeNetwork,
  IBCNetwork,
  LayerZeroToken,
  NativeToken,
} from "../config/bridgingInterfaces";
import { Token } from "global/config/interfaces/tokens";
import { getAllowance, getTokenBalance } from "global/utils/api/tokenBalances";

const doesMethodSupportToken = (
  network: BridgingNetwork,
  method: BridgingMethods,
  token: Token,
  bridgeIn: boolean
) =>
  network[method]?.tokens[bridgeIn ? "toCanto" : "fromCanto"].some(
    (t) => t.address.toLowerCase() === token.address.toLowerCase()
  ) ?? false;

//Router function will take care of selecting the correct bridging function
export async function bridgeTxRouter(
  txStore: TransactionStore,
  ethAddress: string | undefined,
  cantoAddress: string | undefined,
  fromNetwork: BridgingNetwork,
  toNetwork: BridgingNetwork,
  token: Token,
  amount: BigNumber,
  toChainAddress?: string
): Promise<boolean> {
  if (!fromNetwork.isEVM) {
    //this is only for EVM, ibc will be handeled separately through keplr
    return false;
  }
  const tokenDetails = {
    symbol: token.symbol,
    amount: formatUnits(amount, token.decimals),
  };
  if (toNetwork.isCanto) {
    //BRIDGE IN
    //the method to bridge must include the token that is selected
    if (
      doesMethodSupportToken(fromNetwork, BridgingMethods.GBRIDGE, token, true)
    ) {
      const gBridgeNetwork = fromNetwork[
        BridgingMethods.GBRIDGE
      ] as GravityBridgeNetwork;
      return await sendToComsosTx(
        gBridgeNetwork?.chainId,
        txStore,
        gBridgeNetwork?.gravityBridgeAddress,
        gBridgeNetwork?.wethAddress,
        token.address,
        cantoAddress,
        ethAddress,
        amount,
        tokenDetails
      );
    } else if (
      doesMethodSupportToken(
        fromNetwork,
        BridgingMethods.LAYER_ZERO,
        token,
        true
      )
    ) {
      return await oftTransferTx(
        fromNetwork[BridgingMethods.LAYER_ZERO]?.chainId,
        txStore,
        true,
        (token as LayerZeroToken).isNative,
        token.address,
        toNetwork[BridgingMethods.LAYER_ZERO]?.lzChainId,
        amount,
        ethAddress,
        tokenDetails
      );
    }
  } else if (fromNetwork.isCanto) {
    if (
      doesMethodSupportToken(
        toNetwork,
        BridgingMethods.LAYER_ZERO,
        token,
        false
      )
    ) {
      return await oftTransferTx(
        fromNetwork[BridgingMethods.LAYER_ZERO]?.chainId,
        txStore,
        false,
        (token as LayerZeroToken).isNative,
        token.address,
        toNetwork[BridgingMethods.LAYER_ZERO]?.lzChainId,
        amount,
        ethAddress,
        tokenDetails
      );
    } else if (
      doesMethodSupportToken(toNetwork, BridgingMethods.IBC, token, false)
    ) {
      return await convertAndIbcOutTx(
        fromNetwork.IBC?.evmChainId,
        txStore,
        cantoAddress,
        token.address,
        amount.toString(),
        toNetwork.IBC,
        toChainAddress,
        (token as NativeToken).ibcDenom,
        tokenDetails
      );
    }
  }
  //neither to and from are CANTO network
  return false;
}

//will take care of wrapping ETH for WETH before bridging
export async function sendToComsosTx(
  chainId: number | undefined,
  txStore: TransactionStore,
  gravityAddresss: string,
  WETHAddress: string,
  tokenAddress: string,
  cantoAddress: string | undefined,
  ethAddress: string | undefined,
  amount: BigNumber,
  extraDetails?: ExtraProps
): Promise<boolean> {
  //check canto address
  if (
    !CANTO_IBC_NETWORK.checkAddress(cantoAddress) ||
    !ethAddress ||
    !cantoAddress ||
    !chainId
  ) {
    return false;
  }
  //must check if we need to wrap any ETH before sending to cosmos
  let amountToWrap = BigNumber.from(0);
  const allTxs = [];
  if (tokenAddress === WETHAddress) {
    //dealing with WETH, so we must check the balance of WETH and wrap if needed
    const wethBalance = await getTokenBalance(
      ethAddress,
      tokenAddress,
      chainId
    );
    if (wethBalance.lt(amount)) {
      amountToWrap = amount.sub(wethBalance);
      allTxs.push(
        _wrapTx(chainId, WETHAddress, amountToWrap, {
          symbol: "ETH",
          amount: formatUnits(amountToWrap),
        })
      );
    }
  }
  //get currentAllowance
  const currentAllowance = await getAllowance(
    tokenAddress,
    ethAddress,
    gravityAddresss,
    chainId
  );
  //need to enable and send to cosmos no matter what
  allTxs.push(
    _enableTx(
      chainId,
      tokenAddress,
      gravityAddresss,
      amount,
      currentAllowance,
      extraDetails
    )
  );
  allTxs.push(
    _sendToCosmosTx(
      chainId,
      gravityAddresss,
      tokenAddress,
      cantoAddress,
      amount,
      extraDetails
    )
  );
  return await txStore.addTransactionList(
    allTxs,
    TxMethod.EVM,
    "Bridge Into Canto"
  );
}
/**
 * @notice If convertIn, tokenAddress must be its IBC denom
 * @notice If convertOut, tokenAddress must be its EVM address
 * @notice This will perform check on cantoAddress to make sure it is valid
 */
export async function convertTx(
  chainId: number | undefined,
  txStore: TransactionStore,
  convertIn: boolean,
  cantoAddress: string,
  tokenAddressOrDenom: string,
  amount: string,
  extraProps?: ExtraProps
): Promise<boolean> {
  return await txStore.addTransactionList(
    [
      _convertCoinTx(
        chainId,
        convertIn,
        cantoAddress,
        tokenAddressOrDenom,
        amount,
        getCosmosAPIEndpoint(chainId),
        convertFee,
        getCosmosChainObj(chainId),
        "",
        extraProps
      ),
    ],
    TxMethod.COSMOS,
    "Convert Coin"
  );
}
export async function completeAllConvertIn(
  chainId: number | undefined,
  txStore: TransactionStore,
  cantoAddress: string,
  transactions: NativeTransaction[]
): Promise<boolean> {
  return await txStore.addTransactionList(
    transactions.map((tx) =>
      _convertCoinTx(
        chainId,
        true,
        cantoAddress,
        tx.token.ibcDenom,
        tx.amount.toString(),
        getCosmosAPIEndpoint(chainId),
        convertFee,
        getCosmosChainObj(chainId),
        "",
        {
          icon: tx.token.icon,
          symbol: tx.token.symbol,
          amount: formatUnits(tx.amount, tx.token.decimals),
        }
      )
    ),
    TxMethod.COSMOS,
    "Convert Coin"
  );
}
//will check on the address on the receiving network
export async function ibcOutTx(
  chainId: number | undefined,
  txStore: TransactionStore,
  bridgeOutNetwork: IBCNetwork,
  toChainAddress: string,
  ibcDenom: string,
  amount: string,
  extra?: ExtraProps
) {
  //check receiver address
  if (!bridgeOutNetwork.checkAddress(toChainAddress)) {
    return false;
  }
  return await txStore.addTransactionList(
    [
      _ibcTransferOutTx(
        chainId,
        toChainAddress,
        bridgeOutNetwork.channelFromCanto,
        amount,
        ibcDenom,
        getCosmosAPIEndpoint(chainId),
        bridgeOutNetwork.restEndpoint,
        bridgeOutNetwork.latestBlockEndpoint,
        ibcFee,
        getCosmosChainObj(chainId),
        "",
        extra
      ),
    ],
    TxMethod.COSMOS,
    "Bridge Out Of Canto"
  );
}
export async function convertAndIbcOutTx(
  chainId: number | undefined,
  txStore: TransactionStore,
  cantoAddress: string | undefined,
  tokenEVMAddress: string,
  amount: string,
  bridgeOutNetwork: IBCNetwork | undefined,
  toChainAddress: string | undefined,
  ibcDenom: string,
  extraProps?: ExtraProps
): Promise<boolean> {
  //check receiver address
  if (
    !bridgeOutNetwork ||
    !cantoAddress ||
    !toChainAddress ||
    !bridgeOutNetwork.checkAddress(toChainAddress)
  ) {
    return false;
  }
  return await txStore.addTransactionList(
    [
      _convertCoinTx(
        chainId,
        false,
        cantoAddress,
        tokenEVMAddress,
        amount,
        getCosmosAPIEndpoint(chainId),
        convertFee,
        getCosmosChainObj(chainId),
        "",
        extraProps
      ),
      _ibcTransferOutTx(
        chainId,
        toChainAddress,
        bridgeOutNetwork.channelFromCanto,
        amount,
        ibcDenom,
        getCosmosAPIEndpoint(chainId),
        bridgeOutNetwork.restEndpoint,
        bridgeOutNetwork.latestBlockEndpoint,
        ibcFee,
        getCosmosChainObj(chainId),
        "",
        extraProps
      ),
    ],
    TxMethod.COSMOS,
    "Bridge Out"
  );
}

//OFT transactions
export async function oftTransferTx(
  chainId: number | undefined,
  txStore: TransactionStore,
  bridgeIn: boolean,
  isNative: boolean,
  tokenAddress: string,
  toLZChainId: number | undefined,
  amount: BigNumber,
  account: string | undefined,
  extraProps?: ExtraProps
): Promise<boolean> {
  if (!account || !toLZChainId || !chainId) {
    return false;
  }
  const allTxs = [];
  if (isNative) {
    allTxs.push(
      _oftDepositOrWithdrawTx(chainId, true, tokenAddress, amount, extraProps)
    );
  }

  //need to get gas here
  const adapterParams = ethers.utils.solidityPack(
    ["uint16", "uint256"],
    [1, 200000]
  );
  const oftContract = new Contract(
    tokenAddress,
    OFTAbi,
    getCurrentProvider(chainId)
  );

  const gas = await oftContract.estimateSendFee(
    toLZChainId,
    account,
    amount,
    false,
    adapterParams
  );

  allTxs.push(
    _oftTransferTx(
      chainId,
      bridgeIn,
      tokenAddress,
      account,
      toLZChainId,
      amount,
      adapterParams,
      gas[0],
      extraProps
    )
  );
  return await txStore.addTransactionList(
    allTxs,
    TxMethod.EVM,
    `${extraProps?.symbol ?? ""} OFT Transfer`
  );
}

/**
 * TRANSACTION CREATORS
 * WILL NOT CHECK FOR VALIDITY OF PARAMS, MUST DO THIS BEFORE USING THESE CONSTRUCTORS
 */

const _sendToCosmosTx = (
  chainId: number | undefined,
  gravityAddress: string,
  tokenAddress: string,
  cantoReceiverAddress: string,
  amount: BigNumber,
  extraDetails?: ExtraProps
): EVMTx => ({
  chainId: chainId,
  txType: CantoTransactionType.SEND_TO_COSMOS,
  address: gravityAddress,
  abi: gravityBridgeAbi,
  method: "sendToCosmos",
  params: [tokenAddress, cantoReceiverAddress, amount],
  value: "0",
  extraDetails,
});
/**
 * @notice If convertIn, tokenAddress must be its IBC denom
 * @notice If convertOut, tokenAddress must be its EVM address
 */
const _convertCoinTx = (
  chainId: number | undefined,
  convertIn: boolean,
  cantoAddress: string,
  tokenAddressOrDenom: string,
  amount: string,
  endpoint: string,
  fee: Fee,
  chain: Chain,
  memo: string,
  extraDetails?: ExtraProps
): CosmosTx => ({
  chainId,
  txType: convertIn
    ? CantoTransactionType.CONVERT_TO_EVM
    : CantoTransactionType.CONVERT_TO_NATIVE,
  tx: convertIn ? txConvertCoin : txConvertERC20,
  params: [
    cantoAddress,
    tokenAddressOrDenom,
    amount,
    endpoint,
    fee,
    chain,
    memo,
  ],
  extraDetails,
});
const _ibcTransferOutTx = (
  chainId: number | undefined,
  toChainAddress: string,
  cantoChannel: string,
  amount: string,
  tokenDenom: string,
  cantoEndpoint: string,
  toChainRestEndpoint: string,
  toChainBlockEndpoint: string | undefined,
  fee: Fee,
  chain: Chain,
  memo: string,
  extraDetails?: ExtraProps
): CosmosTx => ({
  chainId: chainId,
  txType: CantoTransactionType.IBC_OUT,
  tx: txIBCTransfer,
  params: [
    toChainAddress,
    cantoChannel,
    amount,
    tokenDenom,
    cantoEndpoint,
    toChainRestEndpoint,
    toChainBlockEndpoint,
    fee,
    chain,
    memo,
  ],
  extraDetails,
});
const _wrapTx = (
  chainId: number | undefined,
  wethAddress: string,
  amount: BigNumber,
  extraDetails?: ExtraProps
): EVMTx => ({
  chainId: chainId,
  txType: CantoTransactionType.WRAP,
  address: wethAddress,
  abi: wethAbi,
  method: "deposit",
  params: [],
  value: amount,
  extraDetails,
});

const _oftTransferTx = (
  chainId: number | undefined,
  bridgeIn: boolean,
  oftAddress: string,
  account: string,
  toChainId: number,
  amount: BigNumber,
  adapterParams: string | [],
  gas: BigNumber,
  extraDetails?: ExtraProps
): EVMTx => ({
  chainId: chainId,
  txType: bridgeIn ? CantoTransactionType.OFT_IN : CantoTransactionType.OFT_OUT,
  address: oftAddress,
  abi: OFTAbi,
  method: "sendFrom",
  params: [
    account,
    toChainId,
    account,
    amount,
    account,
    ethers.constants.AddressZero,
    [],
  ],
  value: gas,
  extraDetails,
});

const _oftDepositOrWithdrawTx = (
  chainId: number | undefined,
  deposit: boolean,
  oftAddress: string,
  amount: BigNumber,
  extraDetails?: ExtraProps
): EVMTx => ({
  chainId: chainId,
  txType: deposit
    ? CantoTransactionType.OFT_DEPOSIT
    : CantoTransactionType.OFT_WITHDRAW,
  address: oftAddress,
  abi: OFTAbi,
  method: deposit ? "deposit" : "withdraw",
  params: deposit ? [] : [amount],
  value: deposit ? amount : "0",
  extraDetails,
});
