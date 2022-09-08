import { useCalls, useEtherBalance } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import { formatUnits, formatEther } from "ethers/lib/utils";
import { PAIR, TESTPAIRS, MAINPAIRS } from "../config/pairs";
import { TOKENS as ALLTOKENS, ADDRESSES, CantoTestnet } from "cantoui";
import { cERC20Abi, ERC20Abi, routerAbi } from "global/config/abi";

export interface AllPairInfo {
  basePairInfo: PAIR;
  totalSupply: {
    totalLP: string;
    tvl: string;
    token1: string;
    token2: string;
    //ratio is token1/token2
    ratio: number;
  };
  userSupply: {
    totalLP: string;
    token1: string;
    token2: string;
    percentOwned: number;
  };
  balances: {
    token1: string;
    token2: string;
  };
  prices: {
    //prices are in terms of Note for 1 unit of token (scaled by decimals)
    token1: string;
    token2: string;
  };
  allowance: {
    token1: string;
    token2: string;
    LPtoken: string;
  };
}
export const emptyPairInfo = {
  basePairInfo: MAINPAIRS[0],
  totalSupply: {
    totalLP: "",
    tvl: "",
    token1: "",
    token2: "",
    //ratio is token1/token2
    ratio: 0,
  },
  userSupply: {
    totalLP: "",
    token1: "",
    token2: "",
    percentOwned: 0,
  },
  balances: {
    token1: "",
    token2: "",
  },
  prices: {
    //prices are in terms of Note for 1 unit of token (scaled by decimals)
    token1: "",
    token2: "",
  },
  allowance: {
    token1: "",
    token2: "",
    LPtoken: "",
  },
};
const useTokens = (
  account: string | undefined,
  chainId: number | undefined
) => {
  const routerAddress =
    chainId == CantoTestnet.chainId
      ? ADDRESSES.testnet.PriceFeed
      : ADDRESSES.cantoMainnet.PriceFeed;
  const RouterContract = new Contract(routerAddress, routerAbi);

  const PAIRS: PAIR[] = chainId == CantoTestnet.chainId ? TESTPAIRS : MAINPAIRS;
  const TOKENS =
    chainId == CantoTestnet.chainId
      ? ALLTOKENS.cantoTestnet
      : ALLTOKENS.cantoMainnet;

  const CANTOBalance = formatEther(useEtherBalance(account) ?? 0);

  const calls = PAIRS.map((pair) => {
    const ERC20Contract = new Contract(pair.address, ERC20Abi);
    const ERC20ContractA = new Contract(pair.token1.address, ERC20Abi);
    const ERC20ContractB = new Contract(pair.token2.address, ERC20Abi);
    const cLPToken = new Contract(pair.cLPaddress, cERC20Abi);

    return [
      {
        contract: ERC20Contract,
        method: "balanceOf",
        args: [account],
      },
      {
        contract: RouterContract,
        method: "getReserves",
        args: [pair.token1.address, pair.token2.address, pair.stable],
      },
      {
        contract: ERC20Contract,
        method: "totalSupply",
        args: [],
      },
      {
        contract: ERC20ContractA,
        method: "balanceOf",
        args: [account],
      },
      {
        contract: ERC20ContractB,
        method: "balanceOf",
        args: [account],
      },
      {
        contract: RouterContract,
        method: "getUnderlyingPrice",
        args: [pair.token1.cTokenAddress],
      },
      {
        contract: RouterContract,
        method: "getUnderlyingPrice",
        args: [pair.token2.cTokenAddress],
      },
      {
        contract: ERC20ContractA,
        method: "allowance",
        args: [account, RouterContract.address],
      },
      {
        contract: ERC20ContractB,
        method: "allowance",
        args: [account, RouterContract.address],
      },
      {
        contract: ERC20Contract,
        method: "allowance",
        args: [account, RouterContract.address],
      },
      {
        contract: RouterContract,
        method: "getUnderlyingPrice",
        args: [pair.cLPaddress],
      },
      //11
      {
        contract: cLPToken,
        method: "balanceOf",
        args: [account],
      },
      //12
      {
        contract: cLPToken,
        method: "exchangeRateStored",
        args: [],
      },
    ];
  });

  const results = useCalls(chainId == undefined ? [] : calls.flat()) ?? {};
  // console.log(results)
  if (account == undefined) {
    return [];
  }

  const chuckSize = !PAIRS ? 0 : results.length / PAIRS.length;
  let processedTokens: Array<any>;
  const array_chunks = (array: any[], chunk_size: number) => {
    const rep = array.map((array) => array?.value);
    const chunks = [];

    //array length minus 2, since we are ading the global functions that will increase the array size by 2
    for (let i = 0; i < array.length; i += chunk_size) {
      chunks.push(rep.slice(i, i + chunk_size));
    }
    return chunks;
  };

  if (!PAIRS) {
    return undefined;
  }
  if (chuckSize > 0 && results?.[0] != undefined && !results?.[0].error) {
    processedTokens = array_chunks(results, chuckSize);
    return processedTokens.map((tokenData, idx) => {
      const totalSupply = formatUnits(tokenData[2][0], PAIRS[idx].decimals);
      const reserves = tokenData[1];
      // console.log(reserves)
      const reserveA = formatUnits(
        reserves.reserveA.toString(),
        PAIRS[idx].token1.decimals
      );
      const reserveB = formatUnits(
        reserves.reserveB.toString(),
        PAIRS[idx].token2.decimals
      );
      const ratio = Number((Number(reserveA) / Number(reserveB)).toFixed(6));
      const userLP = formatUnits(tokenData[0][0], PAIRS[idx].decimals);

      let token1Balance;
      if (PAIRS[idx].token1.address == TOKENS.WCANTO.address) {
        token1Balance = CANTOBalance;
      } else {
        token1Balance = formatUnits(
          tokenData[3][0],
          PAIRS[idx].token1.decimals
        );
      }
      const token2Balance = formatUnits(
        tokenData[4][0],
        PAIRS[idx].token2.decimals
      );

      //if the user has supplied in the market, we can get this balance from the cLP tokens and exchange rate stored
      const userLPSupplyBalance = formatUnits(
        BigNumber.from(tokenData[11][0]).mul(tokenData[12][0]),
        18 + PAIRS[idx].decimals
      );
      const percentOwnedWithCLPConverted =
        (Number(userLP) + Number(userLPSupplyBalance)) / Number(totalSupply);

      const percentOwned = Number(userLP) / Number(totalSupply);
      const userTokensA = percentOwned * Number(reserveA);
      const userTokensB = percentOwned * Number(reserveB);

      const tokenAPriceInNote = formatUnits(
        tokenData[5][0],
        36 - PAIRS[idx].token1.decimals
      );
      const tokenBPriceInNote = formatUnits(
        tokenData[6][0],
        36 - PAIRS[idx].token2.decimals
      );

      const tokenAAllowance = formatUnits(
        tokenData[7][0],
        PAIRS[idx].token1.decimals
      );
      const tokenBAllowance = formatUnits(
        tokenData[8][0],
        PAIRS[idx].token2.decimals
      );
      const LPTokenAllowance = formatUnits(
        tokenData[9][0],
        PAIRS[idx].decimals
      );
      // console.log(tokenData[9][0])
      const LPUnderlyingPriceInNote = formatUnits(
        tokenData[10][0],
        36 - PAIRS[idx].decimals
      );

      const totalValueLocked =
        Number(LPUnderlyingPriceInNote) * Number(totalSupply);

      const moreData: AllPairInfo = {
        basePairInfo: PAIRS[idx],
        totalSupply: {
          totalLP: totalSupply,
          tvl: totalValueLocked.toFixed(2).toString(),
          token1: reserveA,
          token2: reserveB,
          ratio: ratio,
        },
        userSupply: {
          totalLP: userLP,
          token1: userTokensA.toString(),
          token2: userTokensB.toString(),
          percentOwned: percentOwnedWithCLPConverted,
        },
        prices: {
          token1: tokenAPriceInNote,
          token2: tokenBPriceInNote,
        },
        allowance: {
          token1: tokenAAllowance,
          token2: tokenBAllowance,
          LPtoken: LPTokenAllowance,
        },
        balances: {
          token1: token1Balance,
          token2: token2Balance,
        },
      };
      return moreData;
    });
  }
  return undefined;
};

export default useTokens;
