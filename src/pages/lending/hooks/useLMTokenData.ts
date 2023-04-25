import { formatEther } from "@ethersproject/units";
import { CallResult, useCalls } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import { ethers } from "ethers";
import { CantoTestnet, CantoMainnet } from "global/config/networks";
import { cTokensBase, mainnetBasecTokens } from "../config/lendingMarketTokens";
import { LMTokenDetails } from "../config/interfaces";
import { cERC20Abi, comptrollerAbi, routerAbi } from "global/config/abi";
import { CTOKENS } from "global/config/tokenInfo";
import { ADDRESSES } from "global/config/addresses";
import { checkMultiCallForUndefined } from "global/utils/utils";
import { CTOKEN } from "global/config/interfaces/tokens";

const formatUnits = ethers.utils.formatUnits;
const parseUnits = ethers.utils.parseUnits;

export function useLMTokenData(chainId?: string): LMTokenDetails[] {
  const onCanto =
    Number(chainId) == CantoMainnet.chainId ||
    Number(chainId) == CantoTestnet.chainId;
  const tokens: CTOKEN[] =
    Number(chainId) == CantoTestnet.chainId ? cTokensBase : mainnetBasecTokens;
  const address =
    Number(chainId) == CantoTestnet.chainId
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

  //comptroller contract
  const comptroller = new Contract(address?.Comptroller, comptrollerAbi);
  //canto contract
  const priceFeedContract = new Contract(address?.PriceFeed, routerAbi);
  const calls =
    tokens?.map((token) => {
      //canto contract
      const cERC20Contract = new Contract(token.address, cERC20Abi);
      return [
        //0
        {
          contract: cERC20Contract,
          method: "getCash",
          args: [],
        },
        //1
        {
          contract: cERC20Contract,
          method: "exchangeRateStored",
          args: [],
        },
        //2
        {
          contract: cERC20Contract,
          method: "supplyRatePerBlock",
          args: [],
        },
        //3
        {
          contract: cERC20Contract,
          method: "borrowRatePerBlock",
          args: [],
        },
        //4
        {
          contract: comptroller,
          method: "markets",
          args: [token.address],
        },
        //5
        {
          contract: priceFeedContract,
          method: "getUnderlyingPrice",
          args: [token.address],
        },
        //6
        {
          contract: comptroller,
          method: "compSupplySpeeds",
          args: [token.address],
        },
        //7
        {
          contract: comptroller,
          method: "borrowCaps",
          args: [token.address],
        },
      ];
    }) ?? [];

  const globalCalls = [
    ...calls.flat(),
    {
      contract: priceFeedContract,
      method: "getUnderlyingPrice",
      args: [tokens?.find((token) => token.symbol == "cCANTO")?.address],
    },
  ];

  const results =
    useCalls(typeof tokens == typeof CTOKENS ? globalCalls : [], {
      chainId: onCanto ? Number(chainId) : CantoMainnet.chainId,
    }) ?? {};

  const chuckSize = !tokens ? 0 : (results.length - 1) / tokens.length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let processedTokens: Array<any>;
  const array_chunks = (
    array: CallResult<Contract, string>[],
    chunk_size: number
  ) => {
    const rep = array.map((array) => array?.value);
    const chunks = [];

    //array length minus 1, since we are ading the global function that will increase the array size by 1
    for (let i = 0; i < array.length - 1; i += chunk_size) {
      chunks.push(rep.slice(i, i + chunk_size));
    }
    return chunks;
  };
  if (!tokens) {
    return [];
  }
  if (chuckSize > 0 && checkMultiCallForUndefined(results)) {
    processedTokens = array_chunks(results, chuckSize);
    return processedTokens.map((tokenData, idx) => {
      const price =
        tokens[idx].symbol == "cNOTE" ||
        tokens[idx].symbol == "cUSDC" ||
        tokens[idx].symbol == "cUSDT"
          ? parseUnits("1", 36 - tokens[idx].underlying.decimals)
          : tokenData[5][0];
      const borrowCap = tokenData[7][0].eq(ethers.BigNumber.from("0"))
        ? BigNumber.from(Number.MAX_SAFE_INTEGER - 1)
        : tokenData[7][0];

      const liquidity: string = formatUnits(
        ethers.BigNumber.from(tokenData[0][0]).mul(tokenData[5][0]),
        36
      );
      const supplyAPY = getAPY(Number(formatEther(tokenData[2][0])));
      const borrowAPY = getAPY(Number(formatEther(tokenData[3][0])));
      const compSpeed = Number(formatEther(tokenData[6][0]));
      const distAPY = getDistributionAPY(
        compSpeed,
        Number(formatUnits(tokenData[0][0], tokens[idx].underlying.decimals)),
        Number(
          formatUnits(tokenData[5][0], 36 - tokens[idx].underlying.decimals)
        ),
        Number(formatEther(results[results.length - 1]?.value[0]))
      );

      const rust: LMTokenDetails = {
        data: tokens?.[idx],
        cash: tokenData[0][0],
        exchangeRate: tokenData[1][0],
        isListed: tokenData[4][0],
        collateralFactor: tokenData[4][1],
        price,
        borrowCap,
        liquidity,
        supplyAPY,
        borrowAPY,
        distAPY,
      };
      return rust;
    });
  }

  return [];
}
