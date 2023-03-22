import { CallResult, useCalls, useEtherBalance } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import { ethers } from "ethers";
import { CantoTestnet, CantoMainnet } from "global/config/networks";
import {
  UserLMTokenDetails,
  LMTokenDetails,
  UserLMRewards,
  UserLMPosition,
  EmptyUserLMDetails,
  EmptyUserPosition,
  EmptyUserRewards,
} from "../config/interfaces";
import { cERC20Abi, comptrollerAbi, ERC20Abi } from "global/config/abi";
import { parseUnits } from "ethers/lib/utils";
import { getSupplyBalanceFromCTokens } from "../utils/utils";
import { valueInNote } from "pages/dexLP/utils/utils";
import { ADDRESSES } from "global/config/addresses";
import { checkMultiCallForUndefined } from "global/utils/utils";

export function useUserLMTokenData(
  LMTokens: LMTokenDetails[],
  account: string | undefined,
  chainId?: string
): {
  userLMTokens: UserLMTokenDetails[];
  position: UserLMPosition;
  rewards: UserLMRewards;
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
  const WCanto = new Contract(address?.WCANTO, ERC20Abi);

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
      contract: WCanto,
      method: "balanceOf",
      args: [comptroller.address],
    },
    {
      contract: comptroller,
      method: "compAccrued",
      args: [account],
    },
  ];

  const results = useCalls(LMTokens && onCanto ? globalCalls : []) ?? {};
  const chuckSize = !LMTokens ? 0 : (results.length - 2) / LMTokens.length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let processedTokens: Array<any>;
  const array_chunks = (
    array: CallResult<Contract, string>[],
    chunk_size: number
  ) => {
    const rep = array.map((array) => array?.value);
    const chunks = [];

    //array length minus 2, since we are ading the global functions that will increase the array size by 2
    for (let i = 0; i < array.length - 2; i += chunk_size) {
      chunks.push(rep.slice(i, i + chunk_size));
    }
    return chunks;
  };
  if (chuckSize > 0 && checkMultiCallForUndefined(results)) {
    processedTokens = array_chunks(results, chuckSize);
    const userLMTokens = processedTokens.map((tokenData, idx) => {
      const balanceOf: BigNumber =
        LMTokens[idx].data.symbol === "cCANTO" ? bal : tokenData[1][0];
      const balanceOfC: BigNumber = tokenData[0][0];
      const borrowBalance: BigNumber = tokenData[2][0];

      const inSupplyMarket = !balanceOfC.isZero();
      const inBorrowMarket = !borrowBalance.isZero();
      const allowance: BigNumber =
        LMTokens[idx].data.symbol === "cCANTO"
          ? BigNumber.from(ethers.constants.MaxUint256)
          : tokenData[3][0];

      const supplyBalance = getSupplyBalanceFromCTokens(
        balanceOfC,
        LMTokens[idx].exchangeRate
      );

      const supplyBalanceinNote = valueInNote(
        supplyBalance,
        LMTokens[idx].price
      );
      const borrowBalanceinNote = valueInNote(
        borrowBalance,
        LMTokens[idx].price
      );

      //supplierDiff = comptroller.supplyState().index - comptroller.compSupplierIndex(cToken.address, supplier.address)
      const supplierDIff = BigNumber.from(tokenData[6][0]).sub(tokenData[5][0]);
      const rewards = supplierDIff
        .mul(tokenData[0][0])
        .div(BigNumber.from(10).pow(36));
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
    let totalRewards = BigNumber.from(0);
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
      totalRewards = totalRewards.add(token.rewards);
    });
    //results.length-1 will get comp accrued method
    //canto accrued must be added to total rewards for each token, so that distributed rewards are included
    const cantoAccrued = results[results.length - 1]?.value[0];
    const comptrollerBalance = results[results.length - 2]?.value[0];

    const canto = userLMTokens.find((item) => item.data.symbol == "cCANTO");

    const rewards: UserLMRewards = {
      walletBalance: canto?.balanceOf ?? parseUnits("0"),
      price: canto?.price ?? parseUnits("0"),
      accrued: totalRewards.add(cantoAccrued),
      cantroller: address.Comptroller,
      wallet: account,
      comptrollerBalance,
    };

    const position: UserLMPosition = {
      totalSupply,
      totalBorrow,
      totalBorrowLimit,
    };

    return { userLMTokens, position, rewards };
  }
  const noUserLMTokens = LMTokens.map((token) => {
    return {
      ...token,
      ...EmptyUserLMDetails,
    };
  });

  return {
    userLMTokens: noUserLMTokens,
    position: EmptyUserPosition,
    rewards: EmptyUserRewards,
  };
}
