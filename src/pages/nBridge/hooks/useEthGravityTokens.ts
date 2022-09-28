import { useCalls } from "@usedapp/core";
import { Contract } from "ethers";
import { ETHGravityTokens } from "../config/gravityBridgeTokens";
import { ethers } from "ethers";
import { ADDRESSES } from "cantoui";
import { ERC20Abi } from "global/config/abi";
import { EmptyUserGTokenData, UserGravityTokens } from "../config/interfaces";

export function useEthGravityTokens(account: string | undefined): {
  userEthGTokens: UserGravityTokens[];
  gravityAddress: string | undefined;
} {
  const tokens = ETHGravityTokens;
  const gravityAddress = ADDRESSES.ETHMainnet.GravityBridge;

  const calls =
    tokens?.map((token) => {
      const ERC20Contract = new Contract(token.address, ERC20Abi);

      return [
        {
          contract: ERC20Contract,
          method: "balanceOf",
          args: [account],
        },
        {
          contract: ERC20Contract,
          method: "allowance",
          args: [account, gravityAddress],
        },
      ];
    }) ?? [];
  const results =
    useCalls(tokens && account ? calls.flat() : [], { chainId: 1 }) ?? {};

  if (tokens == undefined) {
    return { userEthGTokens: [], gravityAddress: undefined };
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
      const allowance = tokenData[1][0];

      return {
        data: tokens[idx],
        wallet: account ?? "",
        balanceOf,
        allowance,
      };
    });

    return { userEthGTokens: val, gravityAddress: gravityAddress };
  }
  const emptyUserTokens = tokens.map((token) => {
    return {
      data: token,
      ...EmptyUserGTokenData,
    };
  });

  return { userEthGTokens: emptyUserTokens, gravityAddress: undefined };
}
