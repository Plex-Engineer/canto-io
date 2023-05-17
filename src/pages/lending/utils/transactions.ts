import { BigNumber, Contract } from "ethers";
import { LendingTransaction, UserLMTokenDetails } from "../config/interfaces";
import {
  ERC20Abi,
  cERC20Abi,
  comptrollerAbi,
  reservoirAbi,
} from "global/config/abi";
import {
  CantoTransactionType,
  TransactionProps,
} from "global/config/interfaces/transactionTypes";
import { TransactionStore } from "global/stores/transactionStore";
import { NetworkProps } from "global/stores/networkInfo";
import { formatUnits } from "ethers/lib/utils";
import {
  createTransactionProps,
  _enable,
} from "global/stores/transactionUtils";
import { ADDRESSES } from "global/config/addresses";
import { CantoTestnet } from "global/providers";
import { TOKENS } from "global/config/tokenInfo";
import { reservoirAdddress } from "../config/lendingMarketTokens";

interface TokenInfo {
  symbol: string;
  icon: string;
  amount: string;
}
//claim rewards needs different inputs, so separate transaction
export async function claimLendingRewardsTx(
  txStore: TransactionStore,
  accountStore: NetworkProps,
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
  const [dripTx, claimTx] = [
    createTransactionProps(txStore, CantoTransactionType.DRIP, tokenInfo),
    createTransactionProps(
      txStore,
      CantoTransactionType.CLAIM_REWARDS,
      tokenInfo
    ),
  ];
  needDrip
    ? txStore.addTransactions([dripTx, claimTx])
    : txStore.addTransactions([claimTx]);

  const comptrollerContract = accountStore.createContractWithSigner(
    comptrollerAddress,
    comptrollerAbi
  );
  const reservoirContract = accountStore.createContractWithSigner(
    reservoirAdddress,
    reservoirAbi
  );
  const dripDone = !needDrip
    ? true
    : await txStore.performTx(
        async () => await reservoirContract.drip(),
        dripTx
      );
  if (!dripDone) {
    return false;
  }
  return await txStore.performTx(
    async () => await comptrollerContract.claimComp(account),
    claimTx
  );
}
//This will create the correct contracts before calling _functions
export async function lendingMarketTx(
  accountStore: NetworkProps,
  txStore: TransactionStore,
  txType: LendingTransaction,
  cToken: UserLMTokenDetails,
  amount: BigNumber
): Promise<boolean> {
  const cTokenContract = accountStore.createContractWithSigner(
    cToken.data.address,
    cERC20Abi
  );
  const underlyingContract = accountStore.createContractWithSigner(
    cToken.data.underlying.address,
    ERC20Abi
  );
  const tokenInfo = {
    symbol: cToken.data.underlying.symbol,
    icon: cToken.data.underlying.icon,
    amount: formatUnits(amount, cToken.data.underlying.decimals),
  };
  const isCanto = cToken.data.underlying.symbol === "CANTO";
  switch (txType) {
    case LendingTransaction.SUPPLY:
    case LendingTransaction.REPAY:
      const isSupply = txType === LendingTransaction.SUPPLY;
      const [enableProps, nextTxProps] = [
        createTransactionProps(txStore, CantoTransactionType.ENABLE, tokenInfo),
        createTransactionProps(
          txStore,
          isSupply ? CantoTransactionType.SUPPLY : CantoTransactionType.REPAY,
          tokenInfo
        ),
      ];
      isCanto
        ? txStore.addTransactions([nextTxProps])
        : txStore.addTransactions([enableProps, nextTxProps]);
      return isSupply
        ? await _supply(
            txStore,
            enableProps,
            nextTxProps,
            cTokenContract,
            underlyingContract,
            amount,
            cToken.allowance,
            isCanto
          )
        : await _repay(
            txStore,
            enableProps,
            nextTxProps,
            cTokenContract,
            underlyingContract,
            amount,
            cToken.allowance,
            isCanto
          );
    case LendingTransaction.BORROW:
    case LendingTransaction.WITHDRAW:
      const isBorrow = txType === LendingTransaction.BORROW;
      const [txProps] = [
        createTransactionProps(
          txStore,
          isBorrow
            ? CantoTransactionType.BORROW
            : CantoTransactionType.WITHDRAW,
          tokenInfo
        ),
      ];
      txStore.addTransactions([txProps]);
      return isBorrow
        ? await _borrow(txStore, txProps, cTokenContract, amount)
        : await _withdraw(txStore, txProps, cTokenContract, amount);
    case LendingTransaction.COLLATERALIZE:
    case LendingTransaction.DECOLLATERLIZE:
      const comptrollerContract = accountStore.createContractWithSigner(
        Number(accountStore.chainId) == CantoTestnet.chainId
          ? ADDRESSES.testnet.Comptroller
          : ADDRESSES.cantoMainnet.Comptroller,
        comptrollerAbi
      );
      return await collateralizeTx(
        txStore,
        tokenInfo,
        comptrollerContract,
        cToken.data.address,
        txType === LendingTransaction.COLLATERALIZE
      );
    default:
      return false;
  }
}

//Must create TransactionProps before calling these functions
//Must create the contracts first before calling these functions
export async function _supply(
  txStore: TransactionStore,
  enableProps: TransactionProps,
  supplyProps: TransactionProps,
  cTokenContract: Contract,
  underlyingContract: Contract,
  amount: BigNumber,
  currentAllowance: BigNumber,
  isCanto: boolean
): Promise<boolean> {
  const enableDone = isCanto
    ? true
    : await _enable(
        txStore,
        underlyingContract,
        enableProps,
        cTokenContract.address,
        currentAllowance,
        amount
      );
  if (!enableDone) {
    return false;
  }

  return await txStore.performTx(
    async () =>
      isCanto
        ? await cTokenContract["mint()"]({ value: amount })
        : await cTokenContract["mint(uint256)"](amount),
    supplyProps
  );
}
async function _borrow(
  txStore: TransactionStore,
  borrowProps: TransactionProps,
  cTokenContract: Contract,
  amount: BigNumber
): Promise<boolean> {
  return await txStore.performTx(
    async () => await cTokenContract.borrow(amount),
    borrowProps
  );
}
async function _repay(
  txStore: TransactionStore,
  enableProps: TransactionProps,
  repayProps: TransactionProps,
  cTokenContract: Contract,
  underlyingContract: Contract,
  amount: BigNumber,
  currentAllowance: BigNumber,
  isCanto: boolean
): Promise<boolean> {
  const enableDone = isCanto
    ? true
    : await _enable(
        txStore,
        underlyingContract,
        enableProps,
        cTokenContract.address,
        currentAllowance,
        amount
      );
  if (!enableDone) {
    return false;
  }
  return await txStore.performTx(
    async () =>
      isCanto
        ? await cTokenContract["repayBorrow()"]({ value: amount })
        : await cTokenContract["repayBorrow(uint256)"](amount),
    repayProps
  );
}
export async function _withdraw(
  txStore: TransactionStore,
  withdrawProps: TransactionProps,
  cTokenContract: Contract,
  amount: BigNumber
): Promise<boolean> {
  return await txStore.performTx(
    async () => await cTokenContract.repay(amount),
    withdrawProps
  );
}
async function collateralizeTx(
  txStore: TransactionStore,
  tokenInfo: TokenInfo,
  comptrollerContract: Contract,
  cTokenAddress: string,
  collateralize: boolean
): Promise<boolean> {
  const [collateralizeTx]: TransactionProps[] = [
    createTransactionProps(
      txStore,
      collateralize
        ? CantoTransactionType.COLLATERALIZE
        : CantoTransactionType.DECOLLATERLIZE,
      tokenInfo
    ),
  ];
  txStore.addTransactions([collateralizeTx]);
  return await txStore.performTx(
    async () =>
      collateralize
        ? await comptrollerContract.enterMarkets([cTokenAddress])
        : await comptrollerContract.exitMarket(cTokenAddress),
    collateralizeTx
  );
}
