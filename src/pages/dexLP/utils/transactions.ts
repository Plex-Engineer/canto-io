import { LPTransaction, UserLPPairInfo } from "../config/interfaces";
import { BigNumber, Contract } from "ethers";
import { _enableTx } from "global/stores/transactionUtils";
import {
  CantoTransactionType,
  EVMTx,
  ExtraProps,
} from "global/config/interfaces/transactionTypes";
import { getPairName } from "./utils";
import { ERC20Abi, routerAbi } from "global/config/abi";
import { isTokenCanto } from "./pairCheck";
import { _lendingTx } from "pages/lending/utils/transactions";
import {
  getAddressesForCantoNetwork,
  getCurrentProvider,
} from "global/utils/getAddressUtils";
import { MaxUint256 } from "@ethersproject/constants";
import { TransactionStore, TxMethod } from "global/stores/transactionStore";

export async function dexLPTx(
  chainId: number | undefined,
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
  chainId: number | undefined,
  txStore: TransactionStore,
  pair: UserLPPairInfo,
  amount1: BigNumber,
  amount2: BigNumber,
  amountMin1: BigNumber,
  amountMin2: BigNumber,
  account: string,
  deadline: number,
  stake: boolean,
  extraDetails?: ExtraProps
): Promise<boolean> {
  const baseTransactions = [
    _enableTx(
      chainId,
      pair.basePairInfo.token1.address,
      getAddressesForCantoNetwork(chainId).Router,
      amount1,
      pair.allowance.token1,
      {
        icon: pair.basePairInfo.token1.icon,
        symbol: pair.basePairInfo.token1.symbol,
      }
    ),
    _enableTx(
      chainId,
      pair.basePairInfo.token2.address,
      getAddressesForCantoNetwork(chainId).Router,
      amount2,
      pair.allowance.token2,
      {
        icon: pair.basePairInfo.token2.icon,
        symbol: pair.basePairInfo.token2.symbol,
      }
    ),
    _addLiquidityTx(
      chainId,
      pair.basePairInfo.token1.address,
      pair.basePairInfo.token2.address,
      pair.basePairInfo.stable,
      amount1,
      amount2,
      amountMin1,
      amountMin2,
      account,
      deadline,
      extraDetails
    ),
  ];
  const stakingTransactions = [
    _enableTx(
      chainId,
      pair.basePairInfo.address,
      pair.basePairInfo.cLPaddress,
      MaxUint256,
      BigNumber.from(0),
      extraDetails
    ),
    _lendingTx(
      chainId,
      CantoTransactionType.SUPPLY,
      pair.basePairInfo.cLPaddress,
      false,
      async () => {
        const LPToken = new Contract(
          pair.basePairInfo.address,
          ERC20Abi,
          getCurrentProvider(chainId)
        );
        //check the new balance for the LP token to supply
        return (await LPToken.balanceOf(account)).sub(pair.userSupply.totalLP);
      },
      extraDetails
    ),
  ];
  return await txStore.addTransactionList(
    stake ? [...baseTransactions, ...stakingTransactions] : baseTransactions,
    TxMethod.EVM
  );
}
async function removeLiquidityTx(
  chainId: number | undefined,
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
  //must allow the LP token before removing liquidity
  const baseTransactions = [
    _enableTx(
      chainId,
      pair.basePairInfo.address,
      getAddressesForCantoNetwork(chainId).Router,
      LPOut,
      pair.allowance.LPtoken,
      extraProps
    ),
    _removeLiquidityTx(
      chainId,
      pair.basePairInfo.token1.address,
      pair.basePairInfo.token2.address,
      pair.basePairInfo.stable,
      LPOut,
      amountMin1,
      amountMin2,
      account,
      deadline,
      extraProps
    ),
  ];
  //withdraw from CLM first if unstaking
  const unstakeTransaction = _lendingTx(
    chainId,
    CantoTransactionType.WITHDRAW,
    pair.basePairInfo.cLPaddress,
    false,
    LPOut,
    extraProps
  );
  return await txStore.addTransactionList(
    unStake ? [unstakeTransaction, ...baseTransactions] : baseTransactions,
    TxMethod.EVM
  );
}

/**
 * TRANSACTION CREATORS
 * WILL NOT CHECK FOR VALIDITY OF PARAMS, MUST DO THIS BEFORE USING THESE CONSTRUCTORS
 */
const _addLiquidityTx = (
  chainId: number | undefined,
  token1Address: string,
  token2Address: string,
  stable: boolean,
  amount1: BigNumber,
  amount2: BigNumber,
  amountMin1: BigNumber,
  amountMin2: BigNumber,
  account: string,
  deadline: number,
  extraDetails?: ExtraProps
): EVMTx => {
  //check for canto in pair
  const [isToken1Canto, isToken2Canto] = [
    isTokenCanto(token1Address, chainId),
    isTokenCanto(token2Address, chainId),
  ];
  const cantoInPair = isToken1Canto || isToken2Canto;
  return {
    chainId,
    txType: CantoTransactionType.ADD_LIQUIDITY,
    address: getAddressesForCantoNetwork(chainId).Router,
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
    extraDetails,
  };
};
const _removeLiquidityTx = (
  chainId: number | undefined,
  token1Address: string,
  token2Address: string,
  stable: boolean,
  LPOut: BigNumber,
  amountMin1: BigNumber,
  amountMin2: BigNumber,
  account: string,
  deadline: number,
  extraDetails?: ExtraProps
): EVMTx => {
  //check for canto in pair
  const [isToken1Canto, isToken2Canto] = [
    isTokenCanto(token1Address, chainId),
    isTokenCanto(token2Address, chainId),
  ];
  const cantoInPair = isToken1Canto || isToken2Canto;
  return {
    chainId,
    txType: CantoTransactionType.REMOVE_LIQUIDITY,
    address: getAddressesForCantoNetwork(chainId).Router,
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
    extraDetails,
  };
};
