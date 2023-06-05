import { BigNumber, Contract, ethers } from "ethers";
import { ERC20Abi, OFTAbi, gravityBridgeAbi, wethAbi } from "global/config/abi";
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
import { BridgeOutNetworkInfo, NativeTransaction } from "../config/interfaces";
import {
  getCosmosAPIEndpoint,
  getCosmosChainObj,
  getCurrentProvider,
} from "global/utils/getAddressUtils";
import { formatUnits } from "ethers/lib/utils";

//will take care of wrapping ETH for WETH before bridging
export async function sendToComsosTx(
  chainId: number | undefined,
  txStore: TransactionStore,
  gravityAddresss: string,
  WETHAddress: string,
  tokenAddress: string,
  cantoAddress: string,
  ethAddress: string,
  amount: BigNumber,
  currentAllowance: BigNumber,
  extraDetails?: ExtraProps
): Promise<boolean> {
  //check canto address
  if (!CANTO_IBC_NETWORK.checkAddress(cantoAddress)) {
    return false;
  }
  //must check if we need to wrap any ETH before sending to cosmos
  let amountToWrap = BigNumber.from(0);
  const allTxs = [];
  if (tokenAddress === WETHAddress) {
    //dealing with WETH, so we must check the balance of WETH and wrap if needed
    const wethContract = new Contract(
      WETHAddress,
      ERC20Abi,
      getCurrentProvider(chainId)
    );
    const wethBalance = await wethContract.balanceOf(ethAddress);
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
  bridgeOutNetwork: BridgeOutNetworkInfo,
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
        bridgeOutNetwork.cantoChannel,
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
  cantoAddress: string,
  tokenEVMAddress: string,
  amount: string,
  bridgeOutNetwork: BridgeOutNetworkInfo,
  toChainAddress: string,
  ibcDenom: string,
  extraProps?: ExtraProps
): Promise<boolean> {
  //check receiver address
  if (!bridgeOutNetwork.checkAddress(toChainAddress)) {
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
        bridgeOutNetwork.cantoChannel,
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
  toLZChainId: number,
  amount: BigNumber,
  account: string,
  adapterParams: [number, number] | [],
  gas: BigNumber,
  extraProps?: ExtraProps
): Promise<boolean> {
  if (!account) {
    return false;
  }
  const allTxs = [];
  if (isNative) {
    allTxs.push(
      _oftDepositOrWithdrawTx(chainId, true, tokenAddress, amount, extraProps)
    );
  }
  allTxs.push(
    _oftTransferTx(
      chainId,
      bridgeIn,
      tokenAddress,
      account,
      toLZChainId,
      amount,
      adapterParams,
      gas,
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
  adapterParams: [number, number] | [],
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
    adapterParams,
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
