import { CallResult, useCalls, useEtherBalance } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import { CantoTestnet, CantoMainnet } from "global/config/networks";
import { cERC20Abi, ERC20Abi, routerAbi } from "global/config/abi";
import { LPPairInfo, UserLPPairInfo } from "../config/interfaces";
import { getSupplyBalanceFromCTokens } from "pages/lending/utils/supplyWithdrawLimits";
import { formatUnits } from "ethers/lib/utils";
import { ADDRESSES } from "global/config/addresses";
import { checkForCantoInPair } from "../utils/pairCheck";
import { checkMultiCallForUndefined } from "global/utils/cantoTransactions/transactionChecks";
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
  const CANTOBalance = useEtherBalance(account) ?? BigNumber.from(0);

  const calls = LPTokens.map((pair) => {
    const ERC20Contract = new Contract(pair.basePairInfo.address, ERC20Abi);
    const ERC20ContractA = new Contract(
      pair.basePairInfo.token1.address,
      ERC20Abi
    );
    const ERC20ContractB = new Contract(
      pair.basePairInfo.token2.address,
      ERC20Abi
    );
    const cLPToken = new Contract(pair.basePairInfo.cLPaddress, cERC20Abi);

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

  const results =
    useCalls(LPTokens && onCanto && account ? calls.flat() : []) ?? {};

  const chuckSize = !LPTokens ? 0 : results.length / LPTokens.length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let processedTokens: Array<any>;
  const array_chunks = (
    array: CallResult<Contract, string>[],
    chunk_size: number
  ) => {
    const rep = array.map((array) => array?.value);
    const chunks = [];

    //array length minus 2, since we are ading the global functions that will increase the array size by 2
    for (let i = 0; i < array.length; i += chunk_size) {
      chunks.push(rep.slice(i, i + chunk_size));
    }
    return chunks;
  };

  if (chuckSize > 0 && checkMultiCallForUndefined(results)) {
    processedTokens = array_chunks(results, chuckSize);
    return processedTokens.map((tokenData, idx) => {
      const userLP = tokenData[0][0];

      const [isToken1Canto, isToken2Canto] = checkForCantoInPair(
        LPTokens[idx].basePairInfo,
        chainId
      );
      const token1Balance = isToken1Canto ? CANTOBalance : tokenData[1][0];
      const token2Balance = isToken2Canto ? CANTOBalance : tokenData[2][0];

      //if the user has supplied in the market, we can get this balance from the cLP tokens and exchange rate stored
      const userLPSupplyBalance = getSupplyBalanceFromCTokens(
        tokenData[6][0],
        tokenData[7][0]
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
  return LPTokens.map((pair) => {
    return {
      ...pair,
      userSupply: {
        totalLP: BigNumber.from(0),
        token1: BigNumber.from(0),
        token2: BigNumber.from(0),
        percentOwned: 0,
      },
      allowance: {
        token1: BigNumber.from(0),
        token2: BigNumber.from(0),
        LPtoken: BigNumber.from(0),
      },
      balances: {
        token1: BigNumber.from(0),
        token2: BigNumber.from(0),
      },
    };
  });
};

export default useUserLPTokenInfo;
