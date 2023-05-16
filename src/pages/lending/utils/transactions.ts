import { BigNumber, Contract } from "ethers";
import { LendingTransaction, UserLMTokenDetails } from "../config/interfaces";
import { ERC20Abi, cERC20Abi, comptrollerAbi } from "global/config/abi";
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
  const dripDone = !needDrip
    ? true
    : await txStore.performTx(
        async () => await comptrollerContract.drip(),
        dripTx
      );
  if (!dripDone) {
    return false;
  }
  return txStore.performTx(
    async () => await comptrollerContract.claimComp(account),
    claimTx
  );
}
export async function lendingMarketTx(
  accountStore: NetworkProps,
  txStore: TransactionStore,
  txType: LendingTransaction,
  cToken: UserLMTokenDetails,
  amount: BigNumber
) {
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
  if (txType === LendingTransaction.SUPPLY) {
    return await supplyTx(
      txStore,
      tokenInfo,
      cTokenContract,
      underlyingContract,
      amount,
      cToken.allowance,
      isCanto
    );
  }
  if (txType === LendingTransaction.BORROW) {
    return await borrowTx(txStore, tokenInfo, cTokenContract, amount);
  }
  if (txType === LendingTransaction.REPAY) {
    return await repayTx(
      txStore,
      tokenInfo,
      cTokenContract,
      underlyingContract,
      amount,
      cToken.allowance,
      isCanto
    );
  }
  if (txType === LendingTransaction.WITHDRAW) {
    return await withdrawTx(txStore, tokenInfo, cTokenContract, amount);
  }
  if (
    txType === LendingTransaction.COLLATERALIZE ||
    txType === LendingTransaction.DECOLLATERLIZE
  ) {
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
  }
  return false;
}

async function supplyTx(
  txStore: TransactionStore,
  tokenInfo: TokenInfo,
  cTokenContract: Contract,
  underlyingContract: Contract,
  amount: BigNumber,
  currentAllowance: BigNumber,
  isCanto: boolean
): Promise<boolean> {
  const [enableTx, supplyTx]: TransactionProps[] = [
    createTransactionProps(txStore, CantoTransactionType.ENABLE, tokenInfo),
    createTransactionProps(txStore, CantoTransactionType.SUPPLY, tokenInfo),
  ];
  isCanto
    ? txStore.addTransactions([supplyTx])
    : txStore.addTransactions([enableTx, supplyTx]);

  const enableDone = isCanto
    ? true
    : await _enable(
        txStore,
        underlyingContract,
        enableTx,
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
    supplyTx
  );
}
async function borrowTx(
  txStore: TransactionStore,
  tokenInfo: TokenInfo,
  cTokenContract: Contract,
  amount: BigNumber
): Promise<boolean> {
  const [borrowTx]: TransactionProps[] = [
    createTransactionProps(txStore, CantoTransactionType.BORROW, tokenInfo),
  ];
  txStore.addTransactions([borrowTx]);
  return await txStore.performTx(
    async () => await cTokenContract.borrow(amount),
    borrowTx
  );
}
async function repayTx(
  txStore: TransactionStore,
  tokenInfo: TokenInfo,
  cTokenContract: Contract,
  underlyingContract: Contract,
  amount: BigNumber,
  currentAllowance: BigNumber,
  isCanto: boolean
): Promise<boolean> {
  const [enableTx, repayTx]: TransactionProps[] = [
    createTransactionProps(txStore, CantoTransactionType.ENABLE, tokenInfo),
    createTransactionProps(txStore, CantoTransactionType.REPAY, tokenInfo),
  ];
  isCanto
    ? txStore.addTransactions([repayTx])
    : txStore.addTransactions([enableTx, repayTx]);
  const enableDone = isCanto
    ? true
    : await _enable(
        txStore,
        underlyingContract,
        enableTx,
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
    repayTx
  );
}
async function withdrawTx(
  txStore: TransactionStore,
  tokenInfo: TokenInfo,
  cTokenContract: Contract,
  amount: BigNumber
): Promise<boolean> {
  const [withdrawTx]: TransactionProps[] = [
    createTransactionProps(txStore, CantoTransactionType.WITHDRAW, tokenInfo),
  ];
  txStore.addTransactions([withdrawTx]);
  return await txStore.performTx(
    async () => await cTokenContract.repay(amount),
    withdrawTx
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
