import { TransactionStore } from "global/stores/transactionStore";
import { LPTransaction, UserLPPairInfo } from "../config/interfaces";
import { NetworkProps } from "global/stores/networkInfo";
import { BigNumber } from "ethers";
import {
  _enable,
  createTransactionProps,
} from "global/stores/transactionUtils";
import {
  CantoTransactionType,
  TransactionProps,
} from "global/config/interfaces/transactionTypes";
import { getPairName } from "./utils";
import { ERC20Abi, cERC20Abi, routerAbi } from "global/config/abi";
import { checkForCantoInPair } from "./pairCheck";
import { _supply, _withdraw } from "pages/lending/utils/transactions";
import { CantoMainnet, CantoTestnet } from "global/config/networks";

function getRouterAddress(chainId: number | undefined) {
  return CantoTestnet.chainId == chainId
    ? CantoTestnet.addresses.PriceFeed
    : CantoMainnet.addresses.PriceFeed;
}
export async function dexLPTx(
  txStore: TransactionStore,
  accountStore: NetworkProps,
  txType: LPTransaction,
  pair: UserLPPairInfo,
  amountLPOut: BigNumber,
  amount1: BigNumber,
  amount2: BigNumber,
  amountMin1: BigNumber,
  amountMin2: BigNumber,
  account: string | undefined,
  deadline: number
): Promise<boolean> {
  if (!account) {
    return false;
  }
  switch (txType) {
    case LPTransaction.ADD_LIQUIDITY:
    case LPTransaction.ADD_LIQUIDITY_AND_STAKE:
      return await addLiquidityTx(
        txStore,
        accountStore,
        pair,
        amount1,
        amount2,
        amountMin1,
        amountMin2,
        account,
        deadline,
        txType === LPTransaction.ADD_LIQUIDITY_AND_STAKE
      );
    case LPTransaction.REMOVE_LIQUIDITY:
    case LPTransaction.REMOVE_LIQUIDITY_AND_UNSTAKE:
      return await removeLiquidityTx(
        txStore,
        accountStore,
        pair,
        amountLPOut,
        amountMin1,
        amountMin2,
        account,
        deadline,
        txType === LPTransaction.REMOVE_LIQUIDITY_AND_UNSTAKE
      );
    default:
      return false;
  }
}

async function addLiquidityTx(
  txStore: TransactionStore,
  accountStore: NetworkProps,
  pair: UserLPPairInfo,
  amount1: BigNumber,
  amount2: BigNumber,
  amountMin1: BigNumber,
  amountMin2: BigNumber,
  account: string,
  deadline: number,
  stake: boolean
): Promise<boolean> {
  const [enableT1Props, enableT2Props, addProps] = [
    createTransactionProps(txStore, CantoTransactionType.ENABLE, {
      icon: pair.basePairInfo.token1.icon,
      symbol: pair.basePairInfo.token1.symbol,
    }),
    createTransactionProps(txStore, CantoTransactionType.ENABLE, {
      icon: pair.basePairInfo.token2.icon,
      symbol: pair.basePairInfo.token2.symbol,
    }),
    createTransactionProps(txStore, CantoTransactionType.ADD_LIQUIDITY, {
      symbol: getPairName(pair.basePairInfo),
    }),
  ];
  const stakeTransactions = stake
    ? [
        createTransactionProps(txStore, CantoTransactionType.ENABLE, {
          symbol: getPairName(pair.basePairInfo),
        }),
        createTransactionProps(txStore, CantoTransactionType.SUPPLY, {
          symbol: getPairName(pair.basePairInfo),
        }),
      ]
    : [];
  txStore.addTransactions([
    enableT1Props,
    enableT2Props,
    addProps,
    ...stakeTransactions,
  ]);
  const addLiquidityDone = await _addLiquidity(
    txStore,
    accountStore,
    enableT1Props,
    enableT2Props,
    addProps,
    pair,
    amount1,
    amount2,
    amountMin1,
    amountMin2,
    account,
    deadline
  );
  if (!stake) {
    return addLiquidityDone;
  }
  //create cToken
  const cLPToken = accountStore.createContractWithSigner(
    pair.basePairInfo.cLPaddress,
    cERC20Abi
  );
  const LPToken = accountStore.createContractWithSigner(
    pair.basePairInfo.address,
    ERC20Abi
  );
  //check the new balance for the LP token to supply
  const addedBalance = (await LPToken.balanceOf(account)).sub(
    pair.userSupply.totalLP
  );
  //check current allowance for cToken, (stored is of the router)
  const currentAllowance = await cLPToken.allowance(
    account,
    pair.basePairInfo.cLPaddress
  );
  return await _supply(
    txStore,
    stakeTransactions[0],
    stakeTransactions[1],
    cLPToken,
    LPToken,
    addedBalance,
    currentAllowance,
    false
  );
}
async function removeLiquidityTx(
  txStore: TransactionStore,
  accountStore: NetworkProps,
  pair: UserLPPairInfo,
  LPOut: BigNumber,
  amountMin1: BigNumber,
  amountMin2: BigNumber,
  account: string,
  deadline: number,
  unStake: boolean
): Promise<boolean> {
  const [enableLPProps, removeProps] = [
    createTransactionProps(txStore, CantoTransactionType.ENABLE, {
      symbol: getPairName(pair.basePairInfo),
    }),
    createTransactionProps(txStore, CantoTransactionType.REMOVE_LIQUIDITY, {
      symbol: getPairName(pair.basePairInfo),
    }),
  ];
  const unstakeProps = unStake
    ? [
        createTransactionProps(txStore, CantoTransactionType.WITHDRAW, {
          symbol: getPairName(pair.basePairInfo),
        }),
      ]
    : [];
  txStore.addTransactions([...unstakeProps, enableLPProps, removeProps]);
  //if unstaking, we must do this first
  if (unStake) {
    //create cToken
    const cLPToken = accountStore.createContractWithSigner(
      pair.basePairInfo.cLPaddress,
      cERC20Abi
    );
    const unstakeDone = _withdraw(txStore, unstakeProps[0], cLPToken, LPOut);
    if (!unstakeDone) {
      return false;
    }
  }
  //done withdrawing, so now we can remove liquidity
  return await _removeLiquidity(
    txStore,
    accountStore,
    enableLPProps,
    removeProps,
    pair,
    LPOut,
    amountMin1,
    amountMin2,
    account,
    deadline
  );
}

//must create TransactionProps for each transaction first
//These will create Contracts for each address needed
async function _addLiquidity(
  txStore: TransactionStore,
  accountStore: NetworkProps,
  enableT1Props: TransactionProps,
  enableT2Props: TransactionProps,
  addProps: TransactionProps,
  pair: UserLPPairInfo,
  amount1: BigNumber,
  amount2: BigNumber,
  amountMin1: BigNumber,
  amountMin2: BigNumber,
  account: string,
  deadline: number
): Promise<boolean> {
  const [token1Contract, token2Contract, routerContract] = [
    accountStore.createContractWithSigner(
      pair.basePairInfo.token1.address,
      ERC20Abi
    ),
    accountStore.createContractWithSigner(
      pair.basePairInfo.token2.address,
      ERC20Abi
    ),
    accountStore.createContractWithSigner(
      getRouterAddress(Number(accountStore.chainId)),
      routerAbi
    ),
  ];
  const [enable1Done, enable2Done] = await Promise.all([
    await _enable(
      txStore,
      token1Contract,
      enableT1Props,
      routerContract.address,
      pair.allowance.token1,
      amount1
    ),
    await _enable(
      txStore,
      token2Contract,
      enableT2Props,
      routerContract.address,
      pair.allowance.token2,
      amount2
    ),
  ]);
  if (!enable1Done || !enable2Done) {
    return false;
  }
  //check for canto in pair
  const [isToken1Canto, isToken2Canto] = checkForCantoInPair(
    pair.basePairInfo,
    Number(accountStore.chainId)
  );
  return await txStore.performTx(
    async () =>
      isToken1Canto || isToken2Canto
        ? await routerContract.addLiquidityCANTO(
            isToken1Canto
              ? pair.basePairInfo.token2.address
              : pair.basePairInfo.token1.address,
            pair.basePairInfo.stable,
            isToken1Canto ? amount2 : amount1,
            isToken1Canto ? amountMin2 : amountMin1,
            isToken1Canto ? amountMin1 : amountMin2,
            account,
            deadline,
            { value: isToken1Canto ? amount1 : amount2 }
          )
        : await routerContract.addLiquidity(
            pair.basePairInfo.token1.address,
            pair.basePairInfo.token2.address,
            pair.basePairInfo.stable,
            amount1,
            amount2,
            amountMin1,
            amountMin2,
            account,
            deadline
          ),
    addProps
  );
}
async function _removeLiquidity(
  txStore: TransactionStore,
  accountStore: NetworkProps,
  enableLPProps: TransactionProps,
  removeProps: TransactionProps,
  pair: UserLPPairInfo,
  LPOut: BigNumber,
  amountMin1: BigNumber,
  amountMin2: BigNumber,
  account: string,
  deadline: number
): Promise<boolean> {
  //need allowance from Router on LP token
  const [lpTokenContract, routerContract] = [
    accountStore.createContractWithSigner(pair.basePairInfo.address, ERC20Abi),
    accountStore.createContractWithSigner(
      getRouterAddress(Number(accountStore.chainId)),
      routerAbi
    ),
  ];
  const enableDone = await _enable(
    txStore,
    lpTokenContract,
    enableLPProps,
    routerContract.address,
    pair.allowance.LPtoken,
    LPOut
  );
  if (!enableDone) {
    return false;
  }
  //check for canto in pair
  const [isToken1Canto, isToken2Canto] = checkForCantoInPair(
    pair.basePairInfo,
    Number(accountStore.chainId)
  );
  return await txStore.performTx(
    async () =>
      isToken1Canto || isToken2Canto
        ? await routerContract.removeLiquidityCANTO(
            isToken1Canto
              ? pair.basePairInfo.token2.address
              : pair.basePairInfo.token1.address,
            pair.basePairInfo.stable,
            LPOut,
            isToken1Canto ? amountMin2 : amountMin1,
            isToken1Canto ? amountMin1 : amountMin2,
            account,
            deadline
          )
        : await routerContract.removeLiquidity(
            pair.basePairInfo.token1.address,
            pair.basePairInfo.token2.address,
            pair.basePairInfo.stable,
            LPOut,
            amountMin1,
            amountMin2,
            account,
            deadline
          ),
    removeProps
  );
}
