import { BigNumber, Contract } from "ethers";
import { ERC20Abi, gravityBridgeAbi, wethAbi } from "global/config/abi";
import {
  CantoTransactionType,
  ExtraProps,
  TransactionDetails,
} from "global/config/interfaces/transactionTypes";
import { TransactionStore } from "global/stores/transactionStore";
import {
  _performEnable,
  createTransactionDetails,
} from "global/stores/transactionUtils";
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
  txStore: TransactionStore,
  gravityAddresss: string,
  WETHAddress: string,
  tokenAddress: string,
  cantoAddress: string,
  ethAddress: string,
  amount: BigNumber,
  currentAllowance: BigNumber,
  tokenSymbol?: string,
  chainId?: number
): Promise<boolean> {
  //must check if we need to wrap any ETH before sending to cosmos
  let needToWrap = false;
  let amountToWrap = BigNumber.from(0);
  const wrapDetails = [];
  if (tokenAddress === WETHAddress) {
    //dealing with WETH, so we must check the balance of WETH and wrap if needed
    const wethContract = new Contract(
      WETHAddress,
      ERC20Abi,
      getCurrentProvider(chainId)
    );
    const wethBalance = await wethContract.balanceOf(ethAddress);
    if (wethBalance.lt(amount)) {
      needToWrap = true;
      amountToWrap = amount.sub(wethBalance);
      wrapDetails.push(
        createTransactionDetails(txStore, CantoTransactionType.WRAP, {
          symbol: "WETH",
          amount: formatUnits(amountToWrap),
        })
      );
    }
  }
  const [enableDetails, sendToCosmosDetails] = [
    createTransactionDetails(txStore, CantoTransactionType.ENABLE, {
      symbol: tokenSymbol,
    }),
    createTransactionDetails(txStore, CantoTransactionType.SEND_TO_COSMOS, {
      symbol: tokenSymbol,
    }),
  ];
  txStore.addTransactions([...wrapDetails, enableDetails, sendToCosmosDetails]);

  if (needToWrap) {
    const wrapDone = await _performWrap(
      txStore,
      WETHAddress,
      amountToWrap,
      wrapDetails[0]
    );
    if (!wrapDone) {
      return false;
    }
  }

  //proceed with normal transactions after wrapping
  const enableDone = await _performEnable(
    txStore,
    tokenAddress,
    gravityAddresss,
    currentAllowance,
    amount,
    enableDetails
  );
  if (!enableDone) {
    return false;
  }
  if (!CANTO_IBC_NETWORK.checkAddress(cantoAddress)) {
    txStore.updateTx(sendToCosmosDetails.txId, {
      status: "Fail",
      errorReason: "Invalid Canto Address",
    });
    return false;
  }
  return await _performSendToCosmos(
    txStore,
    gravityAddresss,
    tokenAddress,
    cantoAddress,
    amount,
    sendToCosmosDetails
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
  const convertDetails = createTransactionDetails(
    txStore,
    convertIn
      ? CantoTransactionType.CONVERT_TO_EVM
      : CantoTransactionType.CONVERT_TO_NATIVE,
    extraProps
  );
  txStore.addTransactions([convertDetails]);
  return await _performConvertCoin(
    txStore,
    convertIn,
    cantoAddress,
    tokenAddressOrDenom,
    amount,
    getCosmosAPIEndpoint(chainId),
    convertFee,
    getCosmosChainObj(chainId),
    "",
    convertDetails,
    chainId
  );
}
export async function completeAllConvertIn(
  chainId: number | undefined,
  txStore: TransactionStore,
  cantoAddress: string,
  transactions: NativeTransaction[]
): Promise<boolean> {
  const allTxDetails: TransactionDetails[] = [];
  for (const tx of transactions) {
    allTxDetails.push(
      createTransactionDetails(txStore, CantoTransactionType.CONVERT_TO_EVM, {
        symbol: tx.token.symbol,
        icon: tx.token.icon,
        amount: formatUnits(tx.amount, tx.token.decimals),
      })
    );
  }
  txStore.addTransactions(allTxDetails);
  const allDone = await Promise.all(
    transactions.map(
      async (tx, index) =>
        await _performConvertCoin(
          txStore,
          true,
          cantoAddress,
          tx.token.ibcDenom,
          tx.amount.toString(),
          getCosmosAPIEndpoint(chainId),
          convertFee,
          getCosmosChainObj(chainId),
          "",
          allTxDetails[index],
          chainId
        )
    )
  );
  return allDone.every((done) => done);
}

//will check on the address on the receiving network
export async function ibcOutTx(
  chainId: number | undefined,
  txStore: TransactionStore,
  bridgeOutNetwork: BridgeOutNetworkInfo,
  toChainAddress: string,
  tokenDenom: string,
  amount: string
) {
  const ibcDetails = createTransactionDetails(
    txStore,
    CantoTransactionType.IBC_OUT,
    { symbol: `to ${bridgeOutNetwork.name}` }
  );
  txStore.addTransactions([ibcDetails]);
  if (!bridgeOutNetwork.checkAddress(toChainAddress)) {
    txStore.updateTx(ibcDetails.txId, {
      status: "Fail",
      errorReason: "Invalid Address",
    });
    return false;
  }
  return await _performIBCTransferOut(
    txStore,
    toChainAddress,
    bridgeOutNetwork.cantoChannel,
    amount,
    tokenDenom,
    getCosmosAPIEndpoint(chainId),
    bridgeOutNetwork.restEndpoint,
    bridgeOutNetwork.latestBlockEndpoint,
    ibcFee,
    getCosmosChainObj(chainId),
    "",
    ibcDetails,
    chainId
  );
}

//Will NOT check the address to make sure it is valid, must perform check before calling these functions
async function _performSendToCosmos(
  txStore: TransactionStore,
  gravityAddress: string,
  tokenAddress: string,
  cantoReceiverAddress: string,
  amount: BigNumber,
  sendToCosmosDetails?: TransactionDetails
): Promise<boolean> {
  return await txStore.performEVMTx({
    details: sendToCosmosDetails,
    address: gravityAddress,
    abi: gravityBridgeAbi,
    method: "sendToCosmos",
    params: [tokenAddress, cantoReceiverAddress, amount],
    value: "0",
  });
}
/**
 * @notice If convertIn, tokenAddress must be its IBC denom
 * @notice If convertOut, tokenAddress must be its EVM address
 */
async function _performConvertCoin(
  txStore: TransactionStore,
  convertIn: boolean,
  cantoAddress: string,
  tokenAddressOrDenom: string,
  amount: string,
  endpoint: string,
  fee: Fee,
  chain: Chain,
  memo: string,
  convertDetails?: TransactionDetails,
  chainId?: number
): Promise<boolean> {
  return await txStore.performCosmosTx({
    chainId,
    details: convertDetails,
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
  });
}
async function _performIBCTransferOut(
  txStore: TransactionStore,
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
  ibcDetails?: TransactionDetails,
  chainId?: number
): Promise<boolean> {
  return await txStore.performCosmosTx({
    chainId,
    details: ibcDetails,
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
  });
}
async function _performWrap(
  txStore: TransactionStore,
  wethAddress: string,
  amount: BigNumber,
  wrapDetails?: TransactionDetails
): Promise<boolean> {
  return await txStore.performEVMTx({
    details: wrapDetails,
    address: wethAddress,
    abi: wethAbi,
    method: "deposit",
    params: [],
    value: amount,
  });
}
