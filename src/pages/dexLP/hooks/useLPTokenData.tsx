import { useCalls } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import { PAIR, TESTPAIRS, MAINPAIRS } from "../config/pairs";
import { ADDRESSES, CantoMainnet, CantoTestnet } from "cantoui";
import { ERC20Abi, routerAbi } from "global/config/abi";
import { LPPairInfo } from "../config/interfaces";

const useLPTokenData = (chainId: number | undefined): LPPairInfo[] => {
  const onCanto =
    Number(chainId) == CantoMainnet.chainId ||
    Number(chainId) == CantoTestnet.chainId;
  const routerAddress =
    chainId == CantoTestnet.chainId
      ? ADDRESSES.testnet.PriceFeed
      : ADDRESSES.cantoMainnet.PriceFeed;
  const RouterContract = new Contract(routerAddress, routerAbi);

  const PAIRS: PAIR[] = chainId == CantoTestnet.chainId ? TESTPAIRS : MAINPAIRS;

  const calls = PAIRS.map((pair) => {
    const ERC20Contract = new Contract(pair.address, ERC20Abi);

    return [
      //0
      {
        contract: ERC20Contract,
        method: "totalSupply",
        args: [],
      },
      //1
      {
        contract: RouterContract,
        method: "getReserves",
        args: [pair.token1.address, pair.token2.address, pair.stable],
      },
      //2
      {
        contract: RouterContract,
        method: "getUnderlyingPrice",
        args: [pair.token1.cTokenAddress],
      },
      //3
      {
        contract: RouterContract,
        method: "getUnderlyingPrice",
        args: [pair.token2.cTokenAddress],
      },
      //4
      {
        contract: RouterContract,
        method: "getUnderlyingPrice",
        args: [pair.cLPaddress],
      },
    ];
  });

  const results =
    useCalls(!PAIRS ? [] : calls.flat(), {
      chainId: onCanto ? Number(chainId) : CantoMainnet.chainId,
    }) ?? {};

  const chuckSize = !PAIRS ? 0 : results.length / PAIRS.length;
  let processedTokens: Array<any>;
  const array_chunks = (array: any[], chunk_size: number) => {
    const rep = array.map((array) => array?.value);
    const chunks = [];

    for (let i = 0; i < array.length; i += chunk_size) {
      chunks.push(rep.slice(i, i + chunk_size));
    }
    return chunks;
  };

  if (!PAIRS) {
    return [];
  }
  if (chuckSize > 0 && results?.[0] != undefined && !results?.[0].error) {
    processedTokens = array_chunks(results, chuckSize);
    return processedTokens.map((tokenData, idx) => {
      const totalSupply = tokenData[0][0];

      const reserves = tokenData[1];
      const reserveA = reserves.reserveA;
      const reserveB = reserves.reserveB;
      let ratio: BigNumber;
      let aTob: boolean;
      if (
        reserveA
          .div(BigNumber.from(10).pow(PAIRS[idx].token1.decimals))
          .gte(reserveB.div(BigNumber.from(10).pow(PAIRS[idx].token2.decimals)))
      ) {
        ratio = reserveA.div(reserveB);
        aTob = true;
      } else {
        ratio = reserveB.div(reserveA);
        aTob = false;
      }

      const tokenAPrice = tokenData[2][0];
      const tokenBPrice = tokenData[3][0];
      const LPUnderlyingPrice = tokenData[4][0];

      const totalValueLocked = LPUnderlyingPrice.mul(totalSupply).div(
        BigNumber.from(10).pow(PAIRS[idx].decimals)
      );
      const moreData: LPPairInfo = {
        basePairInfo: PAIRS[idx],
        totalSupply: {
          totalLP: totalSupply,
          tvl: totalValueLocked,
          token1: reserveA,
          token2: reserveB,
          ratio: {
            aTob: aTob,
            ratio: ratio,
          },
        },
        prices: {
          token1: tokenAPrice,
          token2: tokenBPrice,
        },
      };
      return moreData;
    });
  }
  return [];
};

export default useLPTokenData;
