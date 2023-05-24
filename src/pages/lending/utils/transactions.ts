import { BigNumber } from "ethers";
import { UserLMTokenDetails } from "../config/interfaces";
import { cERC20Abi, comptrollerAbi, reservoirAbi } from "global/config/abi";
import {
  CantoTransactionType,
  EVMTx,
  ExtraProps,
} from "global/config/interfaces/transactionTypes";
import { formatUnits } from "ethers/lib/utils";
import { _enable } from "global/stores/transactionUtils";
import { TOKENS } from "global/config/tokenInfo";
import { getAddressesForCantoNetwork } from "global/utils/getAddressUtils";
import { TransactionStore as NewTxStore } from "global/stores/transactionStoreWithRetry";

//claim rewards needs different inputs, so separate transaction
export async function claimLendingRewardsTx(
  chainId: number | undefined,
  txStore: NewTxStore,
  account: string | undefined,
  comptrollerAddress: string,
  amountToClaim: BigNumber,
  comptrollerBalance: BigNumber
): Promise<boolean> {
  const needDrip = comptrollerBalance.lte(amountToClaim);
  const transactions = [];
  if (needDrip) {
    transactions.push({
      chainId,
      txType: CantoTransactionType.DRIP,
      address: getAddressesForCantoNetwork(chainId).Reservoir,
      abi: reservoirAbi,
      method: "drip",
      params: [],
      value: "0",
    });
  }
  const tokenInfo = {
    symbol: "WCANTO",
    icon: TOKENS.cantoMainnet.CANTO.icon,
    amount: formatUnits(amountToClaim, 18),
  };
  transactions.push({
    chainId,
    txType: CantoTransactionType.CLAIM_REWARDS_LENDING,
    address: comptrollerAddress,
    abi: comptrollerAbi,
    method: "claimComp",
    params: [account],
    value: "0",
    extraDetails: tokenInfo,
  });
  return await txStore.performTxList(transactions, "EVM");
}

export async function lendingMarketTx(
  chainId: number | undefined,
  txStore: NewTxStore,
  txType: CantoTransactionType,
  cToken: UserLMTokenDetails,
  amount: BigNumber
): Promise<boolean> {
  const isCanto = cToken.data.underlying.symbol === "CANTO";
  const tokenInfo = {
    symbol: cToken.data.underlying.symbol,
    icon: cToken.data.underlying.icon,
    amount: formatUnits(amount, cToken.data.underlying.decimals),
  };
  const transactions = [];

  switch (txType) {
    case CantoTransactionType.SUPPLY:
    case CantoTransactionType.REPAY:
    case CantoTransactionType.BORROW:
    case CantoTransactionType.WITHDRAW:
      if (
        (txType === CantoTransactionType.SUPPLY ||
          txType === CantoTransactionType.REPAY) &&
        !isCanto &&
        cToken.allowance.lt(amount)
      ) {
        transactions.push(
          _enable(
            chainId,
            cToken.data.underlying.address,
            cToken.data.address,
            tokenInfo
          )
        );
      }
      transactions.push(
        _lendingTx(
          chainId,
          txType,
          cToken.data.address,
          isCanto,
          amount,
          tokenInfo
        )
      );
      break;
    case CantoTransactionType.COLLATERALIZE:
    case CantoTransactionType.DECOLLATERLIZE:
      transactions.push(
        _collateralizeTx(
          chainId,
          getAddressesForCantoNetwork(chainId).Comptroller,
          cToken.data.address,
          txType === CantoTransactionType.COLLATERALIZE,
          tokenInfo
        )
      );
      break;
  }
  return await txStore.performTxList(transactions, "EVM");
}

const _collateralizeTx = (
  chainId: number | undefined,
  comptrollerAddress: string,
  cTokenAddress: string,
  collateralize: boolean,
  extraDetails?: ExtraProps
): EVMTx => {
  return {
    chainId,
    txType: collateralize
      ? CantoTransactionType.COLLATERALIZE
      : CantoTransactionType.DECOLLATERLIZE,
    address: comptrollerAddress,
    abi: comptrollerAbi,
    method: collateralize ? "enterMarkets" : "exitMarket",
    params: collateralize ? [[cTokenAddress]] : [cTokenAddress],
    value: "0",
    extraDetails,
  };
};

const _lendingTx = (
  chainId: number | undefined,
  txType: CantoTransactionType,
  cTokenAddress: string,
  isCanto: boolean,
  amount: BigNumber,
  extraDetails?: ExtraProps
): EVMTx => {
  return {
    chainId,
    txType,
    address: cTokenAddress,
    abi: cERC20Abi,
    method: methodFromLMTxType(txType, isCanto),
    params: isCanto ? [] : [amount],
    value: isCanto ? amount : "0",
    extraDetails,
  };
};

function methodFromLMTxType(txType: CantoTransactionType, isCanto: boolean) {
  switch (txType) {
    case CantoTransactionType.SUPPLY:
      return isCanto ? "mint()" : "mint(uint256)";
    case CantoTransactionType.REPAY:
      return isCanto ? "repayBorrow()" : "repayBorrow(uint256)";
    case CantoTransactionType.BORROW:
      return "borrow";
    case CantoTransactionType.WITHDRAW:
      return "redeem";
    default:
      return "";
  }
}
