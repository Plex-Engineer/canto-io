import { BigNumber } from "ethers";
import { LendingTransaction, UserLMTokenDetails } from "../config/interfaces";
import { cERC20Abi, comptrollerAbi, reservoirAbi } from "global/config/abi";
import {
  CantoTransactionType,
  ExtraProps,
  TransactionDetails,
} from "global/config/interfaces/transactionTypes";
import { TransactionStore } from "global/stores/transactionStore";
import { formatUnits } from "ethers/lib/utils";
import {
  createTransactionDetails,
  _performEnable,
} from "global/stores/transactionUtils";
import { TOKENS } from "global/config/tokenInfo";
import { getAddressesForCantoNetwork } from "global/utils/getAddressUtils";

//claim rewards needs different inputs, so separate transaction
export async function claimLendingRewardsTx(
  txStore: TransactionStore,
  account: string | undefined,
  comptrollerAddress: string,
  amountToClaim: BigNumber,
  comptrollerBalance: BigNumber
): Promise<boolean> {
  if (!account) {
    return false;
  }
  const needDrip = comptrollerBalance.lte(amountToClaim);
  const tokenInfo = {
    symbol: "WCANTO",
    icon: TOKENS.cantoMainnet.CANTO.icon,
    amount: formatUnits(amountToClaim, 18),
  };
  const [dripDetails, claimDetails] = [
    createTransactionDetails(txStore, CantoTransactionType.DRIP, tokenInfo),
    createTransactionDetails(
      txStore,
      CantoTransactionType.CLAIM_REWARDS_LENDING,
      tokenInfo
    ),
  ];
  needDrip
    ? txStore.addTransactions([dripDetails, claimDetails])
    : txStore.addTransactions([claimDetails]);

  const dripDone = !needDrip
    ? true
    : await txStore.performEVMTx({
        details: dripDetails,
        address: getAddressesForCantoNetwork().Reservoir,
        abi: reservoirAbi,
        method: "drip",
        params: [],
        value: "0",
      });

  if (!dripDone) {
    return false;
  }
  return await txStore.performEVMTx({
    details: claimDetails,
    address: comptrollerAddress,
    abi: comptrollerAbi,
    method: "claimComp",
    params: [account],
    value: "0",
  });
}
//This will create the correct contracts before calling _functions
export async function lendingMarketTx(
  chainId: number | undefined,
  txStore: TransactionStore,
  txType: LendingTransaction,
  cToken: UserLMTokenDetails,
  amount: BigNumber
): Promise<boolean> {
  const tokenInfo = {
    symbol: cToken.data.underlying.symbol,
    icon: cToken.data.underlying.icon,
    amount: formatUnits(amount, cToken.data.underlying.decimals),
  };
  const isCanto = cToken.data.underlying.symbol === "CANTO";
  switch (txType) {
    case LendingTransaction.SUPPLY:
      return await supplyTx(
        txStore,
        cToken.data.address,
        cToken.data.underlying.address,
        amount,
        cToken.allowance,
        isCanto,
        tokenInfo
      );
    case LendingTransaction.REPAY:
      return await repayTx(
        txStore,
        cToken.data.address,
        cToken.data.underlying.address,
        amount,
        cToken.allowance,
        isCanto,
        tokenInfo
      );

    case LendingTransaction.BORROW:
      return await borrowTx(txStore, cToken.data.address, amount, tokenInfo);
    case LendingTransaction.WITHDRAW:
      return await withdrawTx(txStore, cToken.data.address, amount, tokenInfo);
    case LendingTransaction.COLLATERALIZE:
    case LendingTransaction.DECOLLATERLIZE:
      return await collateralizeTx(
        txStore,
        getAddressesForCantoNetwork(chainId).Comptroller,
        cToken.data.address,
        txType === LendingTransaction.COLLATERALIZE,
        tokenInfo
      );
    default:
      return false;
  }
}

//will include the flow needed for each lending market action
//Will also call _perform helpers to do transactions in correct order
async function supplyTx(
  txStore: TransactionStore,
  cTokenAddress: string,
  underlyingAddress: string,
  amount: BigNumber,
  currentAllowance: BigNumber,
  isCanto: boolean,
  tokenInfo?: ExtraProps
): Promise<boolean> {
  const [enableDetails, supplyDetails] = [
    createTransactionDetails(txStore, CantoTransactionType.ENABLE, tokenInfo),
    createTransactionDetails(txStore, CantoTransactionType.SUPPLY, tokenInfo),
  ];
  isCanto
    ? txStore.addTransactions([supplyDetails])
    : txStore.addTransactions([enableDetails, supplyDetails]);
  const enableDone = isCanto
    ? true
    : await _performEnable(
        txStore,
        underlyingAddress,
        cTokenAddress,
        currentAllowance,
        amount,
        enableDetails
      );
  if (!enableDone) {
    return false;
  }
  return await _performSupply(
    txStore,
    cTokenAddress,
    isCanto,
    amount,
    supplyDetails
  );
}
async function borrowTx(
  txStore: TransactionStore,
  cTokenAddress: string,
  amount: BigNumber,
  tokenInfo?: ExtraProps
): Promise<boolean> {
  const [borrowDetails] = [
    createTransactionDetails(txStore, CantoTransactionType.BORROW, tokenInfo),
  ];
  txStore.addTransactions([borrowDetails]);
  return await _performBorrow(txStore, cTokenAddress, amount, borrowDetails);
}
async function repayTx(
  txStore: TransactionStore,
  cTokenAddress: string,
  underlyingAddress: string,
  amount: BigNumber,
  currentAllowance: BigNumber,
  isCanto: boolean,
  tokenInfo?: ExtraProps
): Promise<boolean> {
  const [enableDetails, repayDetails] = [
    createTransactionDetails(txStore, CantoTransactionType.ENABLE, tokenInfo),
    createTransactionDetails(txStore, CantoTransactionType.SUPPLY, tokenInfo),
  ];
  isCanto
    ? txStore.addTransactions([repayDetails])
    : txStore.addTransactions([enableDetails, repayDetails]);
  const enableDone = isCanto
    ? true
    : await _performEnable(
        txStore,
        underlyingAddress,
        cTokenAddress,
        currentAllowance,
        amount,
        enableDetails
      );
  if (!enableDone) {
    return false;
  }
  return await _performRepay(
    txStore,
    cTokenAddress,
    isCanto,
    amount,
    repayDetails
  );
}
async function withdrawTx(
  txStore: TransactionStore,
  cTokenAddress: string,
  amount: BigNumber,
  tokenInfo?: ExtraProps
): Promise<boolean> {
  const [withdrawDetails] = [
    createTransactionDetails(txStore, CantoTransactionType.WITHDRAW, tokenInfo),
  ];
  txStore.addTransactions([withdrawDetails]);
  return await _performWithdraw(
    txStore,
    cTokenAddress,
    amount,
    withdrawDetails
  );
}
async function collateralizeTx(
  txStore: TransactionStore,
  comptrollerAddress: string,
  cTokenAddress: string,
  collateralize: boolean,
  tokenInfo?: ExtraProps
): Promise<boolean> {
  const [collateralizeTx]: TransactionDetails[] = [
    createTransactionDetails(
      txStore,
      collateralize
        ? CantoTransactionType.COLLATERALIZE
        : CantoTransactionType.DECOLLATERLIZE,
      tokenInfo
    ),
  ];
  txStore.addTransactions([collateralizeTx]);
  return await _performCollateralize(
    txStore,
    comptrollerAddress,
    cTokenAddress,
    collateralize,
    collateralizeTx
  );
}

//Will create EVM Transactions
//Expects transaction details to be created before calling this function
export async function _performSupply(
  txStore: TransactionStore,
  cTokenAddress: string,
  isCanto: boolean,
  amount: BigNumber,
  supplyDetails?: TransactionDetails
): Promise<boolean> {
  return await txStore.performEVMTx({
    details: supplyDetails,
    address: cTokenAddress,
    abi: cERC20Abi,
    method: isCanto ? "mint()" : "mint(uint256)",
    params: isCanto ? [] : [amount],
    value: isCanto ? amount : "0",
  });
}
async function _performBorrow(
  txStore: TransactionStore,
  cTokenAddress: string,
  amount: BigNumber,
  borrowDetails?: TransactionDetails
): Promise<boolean> {
  return await txStore.performEVMTx({
    details: borrowDetails,
    address: cTokenAddress,
    abi: cERC20Abi,
    method: "borrow",
    params: [amount],
    value: "0",
  });
}
async function _performRepay(
  txStore: TransactionStore,
  cTokenAddress: string,
  isCanto: boolean,
  amount: BigNumber,
  repayDetails?: TransactionDetails
): Promise<boolean> {
  return await txStore.performEVMTx({
    details: repayDetails,
    address: cTokenAddress,
    abi: cERC20Abi,
    method: isCanto ? "repayBorrow()" : "repayBorrow(uint256)",
    params: isCanto ? [] : [amount],
    value: isCanto ? amount : "0",
  });
}
export async function _performWithdraw(
  txStore: TransactionStore,
  cTokenAddress: string,
  amount: BigNumber,
  withdrawDetails?: TransactionDetails
): Promise<boolean> {
  return await txStore.performEVMTx({
    details: withdrawDetails,
    address: cTokenAddress,
    abi: cERC20Abi,
    method: "redeem",
    params: [amount],
    value: "0",
  });
}
async function _performCollateralize(
  txStore: TransactionStore,
  comptrollerAddress: string,
  cTokenAddress: string,
  collateralize: boolean,
  collateralizeDetails?: TransactionDetails
): Promise<boolean> {
  return await txStore.performEVMTx({
    details: collateralizeDetails,
    address: comptrollerAddress,
    abi: comptrollerAbi,
    method: collateralize ? "enterMarkets" : "exitMarket",
    params: collateralize ? [[cTokenAddress]] : [cTokenAddress],
    value: "0",
  });
}
