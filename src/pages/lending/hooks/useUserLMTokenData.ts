import { formatEther } from "@ethersproject/units";
import { CallResult, useCalls, useEtherBalance } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import { ethers } from "ethers";
import { CantoTestnet, ADDRESSES, CantoMainnet } from "cantoui";
import {
  UserLMTokenDetails,
  LMTokenDetails1,
  BNUserRewards,
  BNUserLMPosition,
  EmptyUserLMDetails,
  EmptyUserPosition,
  EmptyUserRewards,
} from "../config/interfaces";
import { cERC20Abi, comptrollerAbi, ERC20Abi } from "global/config/abi";

const formatUnits = ethers.utils.formatUnits;
const parseUnits = ethers.utils.parseUnits;

export function useUserLMTokenData(
  LMTokens: LMTokenDetails1[],
  account: string | undefined,
  chainId?: string
): {
  userLMTokens: UserLMTokenDetails[];
  position: BNUserLMPosition;
} {
  const onCanto =
    Number(chainId) == CantoMainnet.chainId ||
    Number(chainId) == CantoTestnet.chainId;
  const address =
    Number(chainId) == CantoTestnet.chainId
      ? ADDRESSES.testnet
      : ADDRESSES.cantoMainnet;

  const bal = useEtherBalance(account) ?? BigNumber.from(0);
  //comptroller contract
  const comptroller = new Contract(address?.Comptroller, comptrollerAbi);
  //canto contract
  const calls =
    LMTokens?.map((token) => {
      const ERC20Contract = new Contract(
        token.data.underlying.address,
        ERC20Abi
      );

      //canto contract
      const cERC20Contract = new Contract(token.data.address, cERC20Abi);
      return [
        //0
        {
          contract: cERC20Contract,
          method: "balanceOf",
          args: [account],
        },
        //1
        {
          contract: ERC20Contract,
          method: "balanceOf",
          args: [account],
        },
        //2
        {
          contract: cERC20Contract,
          method: "borrowBalanceStored",
          args: [account],
        },
        //3
        {
          contract: ERC20Contract,
          method: "allowance",
          args: [account, token.data.address],
        },
        //4
        {
          contract: comptroller,
          method: "checkMembership",
          args: [account, token.data.address],
        },
        //5
        {
          contract: comptroller,
          method: "compSupplierIndex",
          args: [token.data.address, account],
        },
        //6
        {
          contract: comptroller,
          method: "compSupplyState",
          args: [token.data.address],
        },
      ];
    }) ?? [];

  const globalCalls = [
    ...calls.flat(),
    {
      contract: comptroller,
      method: "compAccrued",
      args: [account],
    },
  ];

  const results = useCalls(LMTokens && onCanto ? globalCalls : []) ?? {};
  const chuckSize = !LMTokens ? 0 : (results.length - 1) / LMTokens.length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let processedTokens: Array<any>;
  const array_chunks = (
    array: CallResult<Contract, string>[],
    chunk_size: number
  ) => {
    const rep = array.map((array) => array?.value);
    const chunks = [];

    //array length minus 1, since we are ading the global functions that will increase the array size by 1
    for (let i = 0; i < array.length - 1; i += chunk_size) {
      chunks.push(rep.slice(i, i + chunk_size));
    }
    return chunks;
  };
  if (chuckSize > 0 && results?.[0] != undefined && !results?.[0].error) {
    processedTokens = array_chunks(results, chuckSize);
    const userLMTokens = processedTokens.map((tokenData, idx) => {
      const balanceOf: BigNumber =
        LMTokens[idx].data.symbol === "cCANTO" ? bal : tokenData[1][0];
      const balanceOfC: BigNumber = tokenData[0][0];
      const borrowBalance: BigNumber = tokenData[2][0];

      const inSupplyMarket = !balanceOfC.isZero();
      const inBorrowMarket = !borrowBalance.isZero();
      const allowance: boolean =
        LMTokens[idx].data.symbol === "cCANTO"
          ? true
          : Number(
              ethers.utils.formatUnits(
                tokenData[3][0],
                LMTokens[idx].data.underlying.decimals
              )
            ) > 0;

      const supplyBalance = LMTokens[idx].exchangeRate
        .mul(balanceOfC)
        .div(BigNumber.from(10).pow(18));

      const supplyBalanceinNote = supplyBalance
        .mul(LMTokens[idx].price)
        .div(BigNumber.from(10).pow(LMTokens[idx].data.underlying.decimals));
      const borrowBalanceinNote = borrowBalance
        .mul(LMTokens[idx].price)
        .div(BigNumber.from(10).pow(LMTokens[idx].data.underlying.decimals));

      //supplierDiff = comptroller.supplyState().index - comptroller.compSupplierIndex(cToken.address, supplier.address)
      const supplierDIff = BigNumber.from(tokenData[6][0]).sub(tokenData[5][0]);
      const rewards = formatUnits(supplierDIff.mul(tokenData[0][0]), 54);
      return {
        ...LMTokens[idx],
        wallet: account,
        balanceOf,
        balanceOfC,
        borrowBalance,
        supplyBalance,
        allowance,
        inSupplyMarket,
        inBorrowMarket,
        supplyBalanceinNote,
        borrowBalanceinNote,
        collateral: tokenData[4][0],
        rewards,
      };
    });
    let totalSupply = BigNumber.from(0);
    let totalBorrow = BigNumber.from(0);
    let totalBorrowLimit = BigNumber.from(0);
    let totalRewards = 0;
    userLMTokens?.forEach((token) => {
      if (token?.inSupplyMarket) {
        totalSupply = totalSupply.add(token.supplyBalanceinNote);
      }
      if (token?.inBorrowMarket) {
        totalBorrow = totalBorrow.add(token.borrowBalanceinNote);
      }

      if (token?.collateral) {
        totalBorrowLimit = totalBorrowLimit.add(
          token.collateralFactor
            .mul(token.supplyBalanceinNote)
            .div(BigNumber.from(10).pow(18))
        );
      }
      totalRewards += Number(token.rewards);
    });
    //results.length-1 will get comp accrued method
    //canto accrued must be added to total rewards for each token, so that distributed rewards are included
    const cantoAccrued = formatEther(
      results[results.length - 1]?.value[0] ?? 0
    );

    const canto = userLMTokens.find((item) => item.data.symbol == "cCANTO");

    const rewards: BNUserRewards = {
      walletBalance: canto?.balanceOf ?? parseUnits("0"),
      price: canto?.price ?? parseUnits("0"),
      accrued: totalRewards + Number(cantoAccrued),
      cantroller: address.Comptroller,
      wallet: account,
    };

    const position: BNUserLMPosition = {
      totalSupply,
      totalBorrow,
      totalBorrowLimit,
      rewards,
    };

    return { userLMTokens, position };
  }
  const noUserLMTokens = LMTokens.map((token) => {
    return {
      ...token,
      ...EmptyUserLMDetails,
    };
  });
  const noUserPosition = {
    ...EmptyUserPosition,
    rewards: EmptyUserRewards,
  };
  return {
    userLMTokens: noUserLMTokens,
    position: noUserPosition,
  };
}
