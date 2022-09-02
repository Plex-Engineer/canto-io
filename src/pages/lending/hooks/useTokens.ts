import { formatEther } from "@ethersproject/units";
import { CallResult, useCalls, useEtherBalance } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import { ethers } from "ethers";
import { CTOKENS, CTOKEN, CantoTestnet, ADDRESSES } from "cantoui";
import { cTokensBase, mainnetBasecTokens } from "../config/lendingMarketTokens";
import { LMBalance, LMToken, LMTokenDetails } from "../config/interfaces";
import {
  cERC20Abi,
  comptrollerAbi,
  ERC20Abi,
  routerAbi,
} from "global/config/abi";

const formatUnits = ethers.utils.formatUnits;

export function useTokens(
  account: string | undefined,
  chainId: number
):
  | {
      LMTokens: LMToken[];
      balances: LMTokenDetails;
    }
  | undefined {
  const tokens: CTOKEN[] =
    chainId == CantoTestnet.chainId ? cTokensBase : mainnetBasecTokens;
  const address =
    chainId == CantoTestnet.chainId
      ? ADDRESSES.testnet
      : ADDRESSES.cantoMainnet;

  const secondsPerBlock = 5.8;
  const blocksPerDay = 86400 / secondsPerBlock;
  const daysPerYear = 365;

  function getAPY(blockRate: number): number {
    return (
      (Math.pow(Number(blockRate) * blocksPerDay + 1, daysPerYear) - 1) * 100
    );
  }

  function getDistributionAPY(
    compSpeed: number,
    tokensupply: number,
    tokenPrice: number,
    priceOfCanto: number
  ) {
    // ((compspeed*blocksperyear)/LPTOKEN SUPPLY)*PRICEOF CANTO/PRICEOFLPTOKEN
    if (tokensupply == 0 || tokenPrice == 0) {
      return 0;
    }
    return (
      100 *
      ((compSpeed * (blocksPerDay * daysPerYear)) / tokensupply) *
      (priceOfCanto / tokenPrice)
    );
  }

  const bal = formatEther(useEtherBalance(account) ?? 0);
  //comptroller contract
  const comptroller = new Contract(address?.Comptroller, comptrollerAbi);
  //canto contract
  const priceFeedContract = new Contract(address?.PriceFeed, routerAbi);
  const calls =
    tokens?.map((token) => {
      const ERC20Contract = new Contract(token.underlying.address, ERC20Abi);

      //canto contract
      const cERC20Contract = new Contract(token.address, cERC20Abi);
      return [
        {
          contract: cERC20Contract,
          method: "balanceOf",
          args: [account],
        },
        {
          contract: ERC20Contract,
          method: "balanceOf",
          args: [account],
        },
        {
          contract: cERC20Contract,
          method: "borrowBalanceStored",
          args: [account],
        },
        {
          contract: cERC20Contract,
          method: "getCash",
          args: [],
        },
        {
          contract: cERC20Contract,
          method: "exchangeRateStored",
          args: [],
        },
        {
          contract: cERC20Contract,
          method: "supplyRatePerBlock",
          args: [],
        },
        {
          contract: cERC20Contract,
          method: "borrowRatePerBlock",
          args: [],
        },
        {
          contract: ERC20Contract,
          method: "allowance",
          args: [account, token.address],
        },
        {
          contract: comptroller,
          method: "markets",
          args: [token.address],
        },
        {
          contract: comptroller,
          method: "checkMembership",
          args: [account, token.address],
        },
        {
          contract: priceFeedContract,
          method: "getUnderlyingPrice",
          args: [token.address],
        },
        {
          contract: comptroller,
          method: "compSupplySpeeds",
          args: [token.address],
        },
        {
          contract: comptroller,
          method: "borrowCaps",
          args: [token.address],
        },
        //13
        {
          contract: comptroller,
          method: "compSupplierIndex",
          args: [token.address, account],
        },
        //14
        {
          contract: comptroller,
          method: "compSupplyState",
          args: [token.address],
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
    {
      contract: priceFeedContract,
      method: "getUnderlyingPrice",
      args: [tokens?.find((token) => token.symbol == "cCANTO")?.address],
    },
  ];

  const results =
    useCalls(typeof tokens == typeof CTOKENS ? globalCalls : []) ?? {};
  if (account == undefined) {
    return undefined;
  }
  const chuckSize = !tokens ? 0 : (results.length - 2) / tokens.length;
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
  if (!tokens) {
    return undefined;
  }
  if (chuckSize > 0 && results?.[0] != undefined && !results?.[0].error) {
    processedTokens = array_chunks(results, chuckSize);
    const LMTokens = processedTokens.map((tokenData, idx) => {
      const cash: string = formatUnits(
        tokenData[3][0],
        tokens[idx].underlying.decimals
      );
      const price: string =
        tokens[idx].symbol == "cNOTE" ||
        tokens[idx].symbol == "cUSDC" ||
        tokens[idx].symbol == "cUSDT"
          ? "1"
          : formatUnits(tokenData[10][0], 36 - tokens[idx].underlying.decimals);
      const liquidity: string = formatUnits(
        ethers.BigNumber.from(tokenData[3][0]).mul(tokenData[10][0]),
        36
      );
      const balanceOfC: string = formatUnits(
        tokenData[0][0],
        tokens[idx].decimals
      );
      const balanceOf: string =
        tokens[idx].symbol === "cCANTO"
          ? bal
          : ethers.utils.formatUnits(
              tokenData[1][0],
              tokens[idx].underlying.decimals
            );
      const exchangeRate: string = formatUnits(
        tokenData[4][0],
        18 + tokens[idx].underlying.decimals - tokens[idx].decimals
      );
      const allowance: boolean =
        tokens[idx].symbol === "cCANTO"
          ? true
          : Number(
              ethers.utils.formatUnits(
                tokenData[7][0],
                tokens[idx].underlying.decimals
              )
            ) > 0;
      const collateralFactor: string = formatEther(tokenData[8][1]);
      const isListed: boolean = tokenData[8][0];
      const borrowBalance: string = formatUnits(
        tokenData[2][0],
        tokens[idx].underlying.decimals
      );
      const supplyBalance1: string = formatUnits(
        BigNumber.from(tokenData[4][0]).mul(tokenData[0][0]),
        18 + tokens[idx].underlying.decimals
      );
      const supplyBalance: string = supplyBalance1.slice(
        0,
        supplyBalance1.indexOf(".") + tokens[idx].decimals + 1
      );
      const inSupplyMarket: boolean = Number(balanceOfC) > 0;
      const inBorrowMarket: boolean = Number(borrowBalance) > 0;
      const supplyBalanceinNote: string = (
        Number(supplyBalance) * Number(price)
      ).toFixed(18);
      const borrowBalanceinNote: string = (
        Number(borrowBalance) * Number(price)
      ).toFixed(18);
      const supplyAPY = getAPY(Number(formatEther(tokenData[5][0])));
      const borrowAPY = getAPY(Number(formatEther(tokenData[6][0])));
      const compSpeed = Number(formatEther(tokenData[11][0]));
      const distAPY = getDistributionAPY(
        compSpeed,
        Number(cash),
        Number(price),
        Number(formatEther(results[results.length - 1]?.value[0]))
      );
      const borrowCap = ethers.BigNumber.from(tokenData[12][0]).eq(
        ethers.BigNumber.from("0")
      )
        ? Number.MAX_SAFE_INTEGER
        : formatUnits(tokenData[12][0], tokens[idx].underlying.decimals);

      //supplierDiff = comptroller.supplyState().index - comptroller.compSupplierIndex(cToken.address, supplier.address)
      const supplierDIff = BigNumber.from(tokenData[14][0]).sub(
        tokenData[13][0]
      );
      const rewards = formatUnits(supplierDIff.mul(tokenData[0][0]), 54);
      const rust: LMToken = {
        data: tokens?.[idx],
        wallet: account,
        balanceOf,
        balanceOfC,
        borrowBalance,
        exchangeRate,
        supplyBalance,
        liquidity,
        cash,
        allowance,
        collateralFactor,
        inSupplyMarket,
        inBorrowMarket,
        supplyBalanceinNote,
        borrowBalanceinNote,
        collateral: tokenData[9][0],
        price,
        supplyAPY,
        borrowAPY,
        isListed,
        compSpeed,
        distAPY,
        borrowCap,
        rewards,
      };
      return rust;
    });
    let totalSupply = 0;
    let totalBorrow = 0;
    let totalBorrowLimit = 0;
    let totalBorrowLimitUsed = 0;
    let totalRewards = 0;
    LMTokens?.forEach((token) => {
      if (token?.inSupplyMarket) {
        totalSupply += Number(token.supplyBalanceinNote);
      }
      if (token?.inBorrowMarket) {
        totalBorrow += Number(token.borrowBalanceinNote);
      }

      if (token?.collateral) {
        totalBorrowLimit +=
          Number(token.collateralFactor) * Number(token.supplyBalanceinNote);
        if (token?.inBorrowMarket) {
          totalBorrowLimitUsed += Number(token.borrowBalanceinNote);
        }
      }
      totalRewards += Number(token.rewards);
    });
    //results.length-2 will get comp accrued method
    //canto accrued must be added to total rewards for each token, so that distributed rewards are included
    const cantoAccrued = formatEther(
      results[results.length - 2]?.value[0] ?? 1
    );

    const canto = LMTokens.find((item) => item.data.symbol == "cCANTO");

    const balance: LMBalance = {
      walletBalance: canto?.balanceOf,
      price: canto?.price,
      accrued: totalRewards + Number(cantoAccrued),
      cantroller: address.Comptroller,
      wallet: account,
    };

    const balances: LMTokenDetails = {
      totalSupply,
      totalBorrow,
      totalBorrowLimit,
      totalBorrowLimitUsed,
      balance,
    };

    return { LMTokens, balances };
  }

  return undefined;
}
