import { CallResult, useCalls } from "@usedapp/core";
import { CantoTestnet } from "global/config/networks";
import { PAIR } from "pages/dexLP/config/pairs";
import { Contract } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { TokenPriceObject } from "./tokenPrices";
import { ERC20Abi, routerAbi } from "global/config/abi";
import { ADDRESSES } from "global/config/addresses";

export interface LPTokenInfo {
  LPAddress: string;
  priceInNote: number;
  token1: {
    tokenSymbol: string;
    tokenAddress: string;
    tokensPerLP: number;
  };
  token2: {
    tokenSymbol: string;
    tokenAddress: string;
    tokensPerLP: number;
  };
}
export function useLPInfo(
  chainId: string | undefined,
  tokenPrices: TokenPriceObject[] | undefined,
  LPTokens: PAIR[]
): LPTokenInfo[] | undefined {
  const router =
    Number(chainId) == CantoTestnet.chainId
      ? ADDRESSES.testnet.PriceFeed
      : ADDRESSES.cantoMainnet.PriceFeed;
  const routerContract = new Contract(router, routerAbi);
  const calls = LPTokens.map((lpToken) => {
    return [
      {
        contract: routerContract,
        method: "getReserves",
        args: [lpToken.token1.address, lpToken.token2.address, lpToken.stable],
      },
      {
        contract: new Contract(lpToken.address, ERC20Abi),
        method: "totalSupply",
        args: [],
      },
    ];
  });

  const results = useCalls(calls.flat()) ?? {};

  const chuckSize = !LPTokens ? 0 : results.length / LPTokens.length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let processedTokens: Array<any>;
  const array_chunks = (
    array: CallResult<Contract, string>[],
    chunk_size: number
  ) => {
    const rep = array.map((array) => array?.value);
    const chunks = [];

    for (let i = 0; i < array.length; i += chunk_size) {
      chunks.push(rep.slice(i, i + chunk_size));
    }
    return chunks;
  };
  if (!LPTokens || !tokenPrices) {
    return undefined;
  }
  if (chuckSize > 0 && results?.[0] != undefined && !results?.[0].error) {
    processedTokens = array_chunks(results, chuckSize);
    return processedTokens.map((tokenData, idx) => {
      const token1Reserves = formatUnits(
        tokenData[0].reserveA,
        LPTokens[idx].token1.decimals
      );
      const token2Reserves = formatUnits(
        tokenData[0].reserveB,
        LPTokens[idx].token2.decimals
      );
      const totalLP = formatUnits(tokenData[1][0], LPTokens[idx].decimals);
      const token1Price =
        tokenPrices.find(
          (priceObj) => priceObj.address == LPTokens[idx].token1.address
        )?.priceInNote ?? 0;
      const token2Price =
        tokenPrices.find(
          (priceObj) => priceObj.address == LPTokens[idx].token2.address
        )?.priceInNote ?? 0;
      const LPPrice =
        (Number(token1Reserves) * Number(token1Price) +
          Number(token2Reserves) * Number(token2Price)) /
        Number(totalLP);

      return {
        LPAddress: LPTokens[idx].address,
        priceInNote: LPPrice,
        token1: {
          tokenSymbol: LPTokens[idx].token1.symbol,
          tokenAddress: LPTokens[idx].token1.address,
          tokensPerLP: Number(token1Reserves) / Number(totalLP),
        },
        token2: {
          tokenSymbol: LPTokens[idx].token2.symbol,
          tokenAddress: LPTokens[idx].token2.address,
          tokensPerLP: Number(token2Reserves) / Number(totalLP),
        },
      };
    });
  }
  return undefined;
}
