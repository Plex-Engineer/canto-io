import { CallResult, useCalls } from "@usedapp/core";
import { BigNumber, Contract, ethers } from "ethers";
import { ERC20Abi } from "global/config/abi";
import { Token } from "global/config/interfaces/tokens";
import { checkMultiCallForUndefined } from "global/utils/cantoTransactions/transactionChecks";
import { UserERC20BridgeToken } from "pages/bridging/config/interfaces";

export function useTokenBalances(
  account: string | undefined,
  tokens: Token[],
  chainId: number,
  allowanceFrom?: string
): { tokens: UserERC20BridgeToken[]; fail: boolean } {
  const needAllowance = !!allowanceFrom;
  const calls = tokens.map((token) => {
    const ERC20Contract = new Contract(token.address, ERC20Abi);
    if (needAllowance) {
      return [
        {
          contract: ERC20Contract,
          method: "balanceOf",
          args: [account],
        },
        {
          contract: ERC20Contract,
          method: "allowance",
          args: [account, allowanceFrom],
        },
      ];
    } else {
      return [
        {
          contract: ERC20Contract,
          method: "balanceOf",
          args: [account],
        },
      ];
    }
  });
  const results = useCalls(tokens && account ? calls.flat() : [], {
    chainId: chainId,
    refresh: "everyBlock",
  });

  const chuckSize = results.length / tokens.length;
  let processedTokens: Array<Array<Array<BigNumber>>>;
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
  if (
    chuckSize > 0 &&
    checkMultiCallForUndefined(results) &&
    account != undefined
  ) {
    processedTokens = array_chunks(results, chuckSize);
    const userTokens = processedTokens.map((tokenData, idx) => {
      //must perform a safety check to make sure we are not trying to index undefined values
      if (needAllowance) {
        return {
          ...tokens[idx],
          erc20Balance: tokenData[0][0] ?? BigNumber.from(0),
          allowance: tokenData[1][0] ?? BigNumber.from(0),
        };
      } else {
        return {
          ...tokens[idx],
          erc20Balance: tokenData[0][0] ?? BigNumber.from(0),
          allowance: BigNumber.from(ethers.constants.MaxUint256),
        };
      }
    });
    return { tokens: userTokens, fail: false };
  }
  const userTokens = tokens.map((token) => {
    if (needAllowance) {
      return {
        ...token,
        erc20Balance: BigNumber.from(0),
        allowance: BigNumber.from(0),
      };
    } else {
      return {
        ...token,
        erc20Balance: BigNumber.from(0),
        allowance: BigNumber.from(ethers.constants.MaxUint256),
      };
    }
  });
  return { tokens: userTokens, fail: true };
}
