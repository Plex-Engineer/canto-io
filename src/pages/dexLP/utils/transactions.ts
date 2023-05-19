import { TransactionStore } from "global/stores/transactionStore";
import { LPTransaction, UserLPPairInfo } from "../config/interfaces";
import { BigNumber, Contract } from "ethers";
import {
  _performEnable,
  createTransactionDetails,
} from "global/stores/transactionUtils";
import {
  CantoTransactionType,
  ExtraProps,
  TransactionDetails,
} from "global/config/interfaces/transactionTypes";
import { getPairName } from "./utils";
import { ERC20Abi, cERC20Abi, routerAbi } from "global/config/abi";
import { isTokenCanto } from "./pairCheck";
import {
  _performSupply,
  _performWithdraw,
} from "pages/lending/utils/transactions";
import {
  getAddressesForCantoNetwork,
  getCurrentProvider,
} from "global/utils/getAddressUtils";

export async function dexLPTx(
  chainId: number,
  txStore: TransactionStore,
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
  const extraProps = {
    symbol: getPairName(pair.basePairInfo),
    icon: pair.basePairInfo.token1.icon,
    icon2: pair.basePairInfo.token2.icon,
  };
  if (!account) {
    return false;
  }
  switch (txType) {
    case LPTransaction.ADD_LIQUIDITY:
    case LPTransaction.ADD_LIQUIDITY_AND_STAKE:
      return await addLiquidityTx(
        chainId,
        txStore,
        pair,
        amount1,
        amount2,
        amountMin1,
        amountMin2,
        account,
        deadline,
        txType === LPTransaction.ADD_LIQUIDITY_AND_STAKE,
        extraProps
      );
    case LPTransaction.REMOVE_LIQUIDITY:
    case LPTransaction.REMOVE_LIQUIDITY_AND_UNSTAKE:
      return await removeLiquidityTx(
        chainId,
        txStore,
        pair,
        amountLPOut,
        amountMin1,
        amountMin2,
        account,
        deadline,
        txType === LPTransaction.REMOVE_LIQUIDITY_AND_UNSTAKE,
        extraProps
      );
    default:
      return false;
  }
}

async function addLiquidityTx(
  chainId: number,
  txStore: TransactionStore,
  pair: UserLPPairInfo,
  amount1: BigNumber,
  amount2: BigNumber,
  amountMin1: BigNumber,
  amountMin2: BigNumber,
  account: string,
  deadline: number,
  stake: boolean,
  extraProps?: ExtraProps
): Promise<boolean> {
  const [enable1Details, enable2Details, addDetails] = [
    createTransactionDetails(txStore, CantoTransactionType.ENABLE, {
      icon: pair.basePairInfo.token1.icon,
      symbol: pair.basePairInfo.token1.symbol,
    }),
    createTransactionDetails(txStore, CantoTransactionType.ENABLE, {
      icon: pair.basePairInfo.token2.icon,
      symbol: pair.basePairInfo.token2.symbol,
    }),
    createTransactionDetails(
      txStore,
      CantoTransactionType.ADD_LIQUIDITY,
      extraProps
    ),
  ];
  const stakeDetails = stake
    ? [
        createTransactionDetails(
          txStore,
          CantoTransactionType.ENABLE,
          extraProps
        ),
        createTransactionDetails(
          txStore,
          CantoTransactionType.SUPPLY,
          extraProps
        ),
      ]
    : [];
  txStore.addTransactions([
    enable1Details,
    enable2Details,
    addDetails,
    ...stakeDetails,
  ]);
  const [enable1Done, enable2Done] = await Promise.all([
    await _performEnable(
      txStore,
      pair.basePairInfo.token1.address,
      getAddressesForCantoNetwork(chainId).PriceFeed,
      pair.allowance.token1,
      amount1,
      enable1Details
    ),
    await _performEnable(
      txStore,
      pair.basePairInfo.token2.address,
      getAddressesForCantoNetwork(chainId).PriceFeed,
      pair.allowance.token2,
      amount2,
      enable2Details
    ),
  ]);
  if (!enable1Done || !enable2Done) {
    return false;
  }
  const addLiquidityDone = await _performAddLiquidity(
    chainId,
    txStore,
    pair.basePairInfo.token1.address,
    pair.basePairInfo.token2.address,
    pair.basePairInfo.stable,
    amount1,
    amount2,
    amountMin1,
    amountMin2,
    account,
    deadline,
    addDetails
  );
  if (!stake || !addLiquidityDone) {
    return addLiquidityDone;
  }
  //dont need a signer for these contracts since we are just viewing balances
  const provider = getCurrentProvider(chainId);
  const cLPToken = new Contract(
    pair.basePairInfo.cLPaddress,
    cERC20Abi,
    provider
  );
  const LPToken = new Contract(pair.basePairInfo.address, ERC20Abi, provider);

  //check the new balance for the LP token to supply
  const addedBalance = (await LPToken.balanceOf(account)).sub(
    pair.userSupply.totalLP
  );
  //check current allowance for cToken, (stored is of the router)
  const currentAllowance = await LPToken.allowance(
    account,
    pair.basePairInfo.cLPaddress
  );
  const enableLPDone = await _performEnable(
    txStore,
    pair.basePairInfo.address,
    pair.basePairInfo.cLPaddress,
    currentAllowance,
    addedBalance,
    stakeDetails[0]
  );
  if (!enableLPDone) {
    return false;
  }
  return await _performSupply(
    txStore,
    cLPToken.address,
    false,
    addedBalance,
    stakeDetails[1]
  );
}
async function removeLiquidityTx(
  chainId: number,
  txStore: TransactionStore,
  pair: UserLPPairInfo,
  LPOut: BigNumber,
  amountMin1: BigNumber,
  amountMin2: BigNumber,
  account: string,
  deadline: number,
  unStake: boolean,
  extraProps?: ExtraProps
): Promise<boolean> {
  const [enableLPDetails, removeDetails] = [
    createTransactionDetails(txStore, CantoTransactionType.ENABLE, extraProps),
    createTransactionDetails(
      txStore,
      CantoTransactionType.REMOVE_LIQUIDITY,
      extraProps
    ),
  ];
  const unstakeProps = unStake
    ? [
        createTransactionDetails(
          txStore,
          CantoTransactionType.WITHDRAW,
          extraProps
        ),
      ]
    : [];
  txStore.addTransactions([...unstakeProps, enableLPDetails, removeDetails]);
  //if unstaking, we must do this first
  if (unStake) {
    const unstakeDone = await _performWithdraw(
      txStore,
      pair.basePairInfo.cLPaddress,
      LPOut,
      unstakeProps[0]
    );
    if (!unstakeDone) {
      return false;
    }
  }
  //done withdrawing, so now we can remove liquidity after adding allowance from router
  const lpAllowanceDone = await _performEnable(
    txStore,
    pair.basePairInfo.address,
    getAddressesForCantoNetwork(chainId).PriceFeed,
    pair.allowance.LPtoken,
    LPOut,
    enableLPDetails
  );
  if (!lpAllowanceDone) {
    return false;
  }
  return await _performRemoveLiquidity(
    chainId,
    txStore,
    pair.basePairInfo.token1.address,
    pair.basePairInfo.token2.address,
    pair.basePairInfo.stable,
    LPOut,
    amountMin1,
    amountMin2,
    account,
    deadline,
    removeDetails
  );
}

//Will create EVM Transactions
//Expects transaction details to be created before calling this function
async function _performAddLiquidity(
  chainId: number,
  txStore: TransactionStore,
  token1Address: string,
  token2Address: string,
  stable: boolean,
  amount1: BigNumber,
  amount2: BigNumber,
  amountMin1: BigNumber,
  amountMin2: BigNumber,
  account: string,
  deadline: number,
  addDetails?: TransactionDetails
): Promise<boolean> {
  //check for canto in pair
  const [isToken1Canto, isToken2Canto] = [
    isTokenCanto(token1Address, chainId),
    isTokenCanto(token2Address, chainId),
  ];
  const cantoInPair = isToken1Canto || isToken2Canto;
  return await txStore.performEVMTx({
    details: addDetails,
    address: getAddressesForCantoNetwork(chainId).PriceFeed,
    abi: routerAbi,
    method: cantoInPair ? "addLiquidityCANTO" : "addLiquidity",
    params: cantoInPair
      ? [
          isToken1Canto ? token2Address : token1Address,
          stable,
          isToken1Canto ? amount2 : amount1,
          isToken1Canto ? amountMin2 : amountMin1,
          isToken1Canto ? amountMin1 : amountMin2,
          account,
          deadline,
        ]
      : [
          token1Address,
          token2Address,
          stable,
          amount1,
          amount2,
          amountMin1,
          amountMin2,
          account,
          deadline,
        ],
    value: isToken1Canto ? amount1 : isToken2Canto ? amount2 : "0",
  });
}
async function _performRemoveLiquidity(
  chainId: number,
  txStore: TransactionStore,
  token1Address: string,
  token2Address: string,
  stable: boolean,
  LPOut: BigNumber,
  amountMin1: BigNumber,
  amountMin2: BigNumber,
  account: string,
  deadline: number,
  removeDetails?: TransactionDetails
): Promise<boolean> {
  //check for canto in pair
  const [isToken1Canto, isToken2Canto] = [
    isTokenCanto(token1Address, chainId),
    isTokenCanto(token2Address, chainId),
  ];
  const cantoInPair = isToken1Canto || isToken2Canto;
  return await txStore.performEVMTx({
    details: removeDetails,
    address: getAddressesForCantoNetwork(chainId).PriceFeed,
    abi: routerAbi,
    method: cantoInPair ? "removeLiquidityCANTO" : "removeLiquidity",
    params: cantoInPair
      ? [
          isToken1Canto ? token2Address : token1Address,
          stable,
          LPOut,
          isToken1Canto ? amountMin2 : amountMin1,
          isToken1Canto ? amountMin1 : amountMin2,
          account,
          deadline,
        ]
      : [
          token1Address,
          token2Address,
          stable,
          LPOut,
          amountMin1,
          amountMin2,
          account,
          deadline,
        ],
    value: "0",
  });
}
