import { useCalls } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import { CantoGravityTokens } from "../config/gravityBridgeTokens";
import { ethers } from "ethers";
import { CantoMainnet } from "cantoui";
import { ERC20Abi } from "global/config/abi";
import { EmptyUserGTokenData, UserGravityTokens } from "../config/interfaces";

export function useCantoGravityTokens(account: string | undefined): {
  userGravityTokens: UserGravityTokens[] | undefined;
} {
  const tokens = CantoGravityTokens;

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
      chainId: CantoMainnet.chainId,
    }) ?? {};

  if (tokens == undefined) {
    return { userGravityTokens: [] };
  }
  const chuckSize = results.length / tokens.length;
  let processedTokens: Array<any>;
  const array_chunks = (array: any[], chunk_size: number) => {
    const rep = array.map((array) => array?.value);
    const chunks = [];

    for (let i = 0; i < array.length; i += chunk_size) {
      chunks.push(rep.slice(i, i + chunk_size));
    }
    return chunks;
  };
  if (chuckSize > 0 && results?.[0] != undefined && !results?.[0].error) {
    processedTokens = array_chunks(results, chuckSize);
    const val = processedTokens.map((tokenData, idx) => {
      const balanceOf = tokenData[0][0];
      const allowance = BigNumber.from(ethers.constants.MaxUint256);
      return {
        data: tokens[idx],
        wallet: account ?? "",
        balanceOf,
        allowance,
      };
    });
    return { userGravityTokens: val };
  }

  return {
    userGravityTokens: tokens.map((token) => {
      return {
        data: token,
        ...EmptyUserGTokenData,
      };
    }),
  };
}
