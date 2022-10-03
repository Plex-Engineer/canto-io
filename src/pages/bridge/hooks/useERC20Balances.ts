import { useCalls } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import { NativeERC20Tokens, UserERC20Tokens } from "../config/interfaces";
import { ERC20Abi } from "../../../global/config/abi";

export function useCantoERC20Balances(
  account: string | undefined,
  tokens: NativeERC20Tokens[],
  chainId: number
): {
  userTokens: UserERC20Tokens[];
} {
  const calls =
    tokens?.map((token) => {
      const ERC20Contract = new Contract(token.address, ERC20Abi);
      return [
        {
          contract: ERC20Contract,
          method: "balanceOf",
          args: [account],
        },
      ];
    }) ?? [];
  const results =
    useCalls(tokens && account ? calls.flat() : [], {
      chainId: chainId,
    }) ?? {};

  if (tokens == undefined) {
    return { userTokens: [] };
  }
  const chuckSize = results.length / tokens.length;
  let processedTokens: Array<any>;
  const array_chunks = (array: any[], chunk_size: number) => {
    const rep = array.map((array) => array?.value);
    const chunks: any[] = [];

    for (let i = 0; i < array.length; i += chunk_size) {
      chunks.push(rep.slice(i, i + chunk_size));
    }
    return chunks;
  };
  if (chuckSize > 0 && results?.[0] != undefined && !results?.[0].error) {
    processedTokens = array_chunks(results, chuckSize);
    const val = processedTokens.map((tokenData, idx) => {
      const balanceOf = tokenData[0][0];
      return {
        ...tokens[idx],
        wallet: account ?? "",
        erc20Balance: balanceOf,
      };
    });
    return { userTokens: val };
  }

  return {
    userTokens: tokens.map((token) => {
      return {
        ...token,
        wallet: "",
        erc20Balance: BigNumber.from(0),
      };
    }),
  };
}
