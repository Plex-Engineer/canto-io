import { useCalls } from "@usedapp/core";
import { Contract } from "ethers";
import { ETHGravityTokens } from "../config/gravityBridgeTokens";
import { ethers } from "ethers";
import { ADDRESSES } from "cantoui";
import { ERC20Abi } from "global/config/abi";

export interface GTokens {
  data: {
    symbol: string;
    name: string;
    decimals: number;
    address: string;
    isERC20: boolean;
    isLP: boolean;
    icon: string;
    cTokenAddress: string;
    nativeName: string;
  };
  wallet: string;
  balanceOf: number;
  allowance: number;
}
[];

export function useGravityTokens(account: string | undefined): {
  gravityTokens: GTokens[] | undefined;
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
  const results = useCalls(tokens ? calls.flat() : [], { chainId: 1 }) ?? {};

  if (account == undefined) {
    return { gravityTokens: undefined, gravityAddress: undefined };
  }
  if (tokens == undefined) {
    return { gravityTokens: [], gravityAddress: undefined };
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
      const balanceOf = Number(
        ethers.utils.formatUnits(tokenData[0][0], tokens[idx].decimals)
      );
      const allowance = Number(
        ethers.utils.formatUnits(tokenData[1][0], tokens[idx].decimals)
      );

      return {
        data: tokens[idx],
        wallet: account,
        balanceOf,
        allowance,
      };
    });

    if (val[0].balanceOf == undefined)
      return { gravityTokens: undefined, gravityAddress: gravityAddress };

    return { gravityTokens: val, gravityAddress: gravityAddress };
  }

  return { gravityTokens: undefined, gravityAddress: undefined };
}
