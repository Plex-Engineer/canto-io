import { useCalls, useEtherBalance } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import { PAIR, TESTPAIRS, MAINPAIRS } from "../config/pairs";
import {
  TOKENS as ALLTOKENS,
  ADDRESSES,
  CantoTestnet,
  CantoMainnet,
} from "cantoui";
import { cERC20Abi, ERC20Abi, routerAbi } from "global/config/abi";
import { LPPairInfo, UserLPPairInfo } from "../config/interfaces";
import { getSupplyBalanceFromCTokens } from "pages/lending/utils/utils";
import { formatUnits } from "ethers/lib/utils";

const useUserLPTokenInfo = (
  LPTokens: LPPairInfo[],
  account: string | undefined,
  chainId: number | undefined
): UserLPPairInfo[] => {
  const onCanto =
    Number(chainId) == CantoMainnet.chainId ||
    Number(chainId) == CantoTestnet.chainId;
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

  const CANTOBalance = useEtherBalance(account) ?? BigNumber.from(0);

  const calls = PAIRS.map((pair) => {
    const ERC20Contract = new Contract(pair.address, ERC20Abi);
    const ERC20ContractA = new Contract(pair.token1.address, ERC20Abi);
    const ERC20ContractB = new Contract(pair.token2.address, ERC20Abi);
    const cLPToken = new Contract(pair.cLPaddress, cERC20Abi);

    return [
      //0
      {
        contract: ERC20Contract,
        method: "balanceOf",
        args: [account],
      },
      //1
      {
        contract: ERC20ContractA,
        method: "balanceOf",
        args: [account],
      },
      //2
      {
        contract: ERC20ContractB,
        method: "balanceOf",
        args: [account],
      },
      //3
      {
        contract: ERC20ContractA,
        method: "allowance",
        args: [account, RouterContract.address],
      },
      //4
      {
        contract: ERC20ContractB,
        method: "allowance",
        args: [account, RouterContract.address],
      },
      //5
      {
        contract: ERC20Contract,
        method: "allowance",
        args: [account, RouterContract.address],
      },
      //6
      {
        contract: cLPToken,
        method: "balanceOf",
        args: [account],
      },
      //7
      {
        contract: cLPToken,
        method: "exchangeRateStored",
        args: [],
      },
    ];
  });

  const results = useCalls(LPTokens && onCanto ? calls.flat() : []) ?? {};
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
    return [];
  }
  if (chuckSize > 0 && results?.[0] != undefined && !results?.[0].error) {
    processedTokens = array_chunks(results, chuckSize);
    return processedTokens.map((tokenData, idx) => {
      const userLP = tokenData[0][0];

      let token1Balance;
      if (PAIRS[idx].token1.address == TOKENS.WCANTO.address) {
        token1Balance = CANTOBalance;
      } else {
        token1Balance = tokenData[1][0];
      }
      const token2Balance = tokenData[2][0];

      //if the user has supplied in the market, we can get this balance from the cLP tokens and exchange rate stored
      const userLPSupplyBalance = getSupplyBalanceFromCTokens(
        tokenData[6][0],
        tokenData[7][0],
        PAIRS[idx].cDecimals,
        PAIRS[idx].decimals
      );

      //multiplied by 1e18 so that division does not round down to whole numbers
      //number instead of BigNumber since value is not used for calculations
      const percentOwnedWithCLPConverted = Number(
        formatUnits(
          userLP
            .add(userLPSupplyBalance)
            .mul(BigNumber.from(10).pow(18))
            .div(LPTokens[idx].totalSupply.totalLP)
        )
      );
      //this percent owned is scaled to 1e18 for precision
      const BNPercentOwned = userLP
        .mul(BigNumber.from(10).pow(18))
        .div(LPTokens[idx].totalSupply.totalLP);
      //percent owned will be a number since not used for further calculations
      const userTokensA = BNPercentOwned.mul(
        LPTokens[idx].totalSupply.token1
      ).div(BigNumber.from(10).pow(18));
      const userTokensB = BNPercentOwned.mul(
        LPTokens[idx].totalSupply.token2
      ).div(BigNumber.from(10).pow(18));

      const tokenAAllowance = tokenData[3][0];
      const tokenBAllowance = tokenData[4][0];
      const LPTokenAllowance = tokenData[5][0];

      const moreData: UserLPPairInfo = {
        ...LPTokens[idx],
        userSupply: {
          totalLP: userLP,
          token1: userTokensA,
          token2: userTokensB,
          percentOwned: percentOwnedWithCLPConverted,
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
  return [];
};

export default useUserLPTokenInfo;
