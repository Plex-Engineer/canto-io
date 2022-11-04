import { CallResult, useCalls } from "@usedapp/core";
import { CantoTestnet } from "global/config/networks";
import { PAIR } from "pages/dexLP/config/pairs";
import { BigNumber, Contract } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { TokenPriceObject } from "./tokenPrices";
import { ERC20Abi, routerAbi } from "global/config/abi";
import { ADDRESSES } from "global/config/addresses";
import { Token } from "global/config/tokenInfo";

export interface LPTokenInfo {
  LPAddress: string;
  cLPAddress: string;
  priceInNote: number;
  stable: boolean;
  token1: {
    data: Token;
    price: string;
    //scaled by 1e18
    tokensPerLP: BigNumber;
  };
  token2: {
    data: Token;
    price: string;
    //scaled by 1e18
    tokensPerLP: BigNumber;
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
      const token1Reserves = tokenData[0].reserveA;
      const token2Reserves = tokenData[0].reserveB;
      const totalLP = tokenData[1][0];
      const token1Price =
        tokenPrices.find(
          (priceObj) => priceObj.address == LPTokens[idx].token1.address
        )?.priceInNote ?? "0";
      const token2Price =
        tokenPrices.find(
          (priceObj) => priceObj.address == LPTokens[idx].token2.address
        )?.priceInNote ?? "0";
      const LPPrice =
        (Number(formatUnits(token1Reserves, LPTokens[idx].token1.decimals)) *
          Number(token1Price) +
          Number(formatUnits(token2Reserves, LPTokens[idx].token2.decimals)) *
            Number(token2Price)) /
        Number(formatUnits(totalLP, LPTokens[idx].decimals));

      return {
        LPAddress: LPTokens[idx].address,
        cLPAddress: LPTokens[idx].cLPaddress,
        priceInNote: LPPrice,
        stable: LPTokens[idx].stable,
        token1: {
          price: token1Price,
          data: LPTokens[idx].token1,
          tokensPerLP: token1Reserves
            .mul(BigNumber.from(10).pow(18))
            .div(totalLP),
        },
        token2: {
          price: token2Price,
          data: LPTokens[idx].token2,
          tokensPerLP: token2Reserves
            .mul(BigNumber.from(10).pow(18))
            .div(totalLP),
        },
      };
    });
  }
  return undefined;
}
