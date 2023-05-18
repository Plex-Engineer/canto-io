import { BigNumber } from "ethers";
import { gravityBridgeAbi } from "global/config/abi";
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
import { Chain, Fee } from "global/config/cosmosConstants";
import {
  txConvertCoin,
  txConvertERC20,
} from "./convertCoin/convertTransactions";
import { txIBCTransfer } from "./IBC/IBCTransfer";
import { BridgeOutNetworkInfo } from "../config/interfaces";

//will take care of wrapping ETH for WETH before bridging
export async function sendToComsosTx(
  txStore: TransactionStore,
  gravityAddresss: string,
  tokenAddress: string,
  cantoAddress: string,
  amount: BigNumber,
  currentAllowance: BigNumber,
  tokenSymbol?: string
): Promise<boolean> {
  const [enableDetails, sendToCosmosDetails] = [
    createTransactionDetails(txStore, CantoTransactionType.ENABLE, {
      symbol: tokenSymbol,
    }),
    createTransactionDetails(txStore, CantoTransactionType.SEND_TO_COSMOS, {
      symbol: tokenSymbol,
    }),
  ];
  txStore.addTransactions([enableDetails, sendToCosmosDetails]);
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
  txStore: TransactionStore,
  convertIn: boolean,
  cantoAddress: string,
  tokenAddressOrDenom: string,
  amount: string,
  endpoint: string,
  fee: Fee,
  chain: Chain,
  memo: string,
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
    endpoint,
    fee,
    chain,
    memo,
    convertDetails
  );
}

//will check on the address on the receiving network
export async function ibcOutTx(
  txStore: TransactionStore,
  bridgeOutNetwork: BridgeOutNetworkInfo,
  toChainAddress: string,
  tokenDenom: string,
  amount: string,
  endpoint: string,
  fee: Fee,
  chain: Chain,
  memo: string
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
    endpoint,
    bridgeOutNetwork.restEndpoint,
    bridgeOutNetwork.latestBlockEndpoint,
    fee,
    chain,
    memo,
    ibcDetails
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
  convertDetails?: TransactionDetails
): Promise<boolean> {
  return await txStore.performCosmosTx({
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
  ibcDetails?: TransactionDetails
): Promise<boolean> {
  return await txStore.performCosmosTx({
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
