import { useCalls } from "@usedapp/core";
import { Contract } from "ethers";
import { CantoGravityTokens } from "../config/gravityBridgeTokens";
import { ethers } from "ethers";
import { GTokens } from "./useGravityTokens";
import { generateEndpointBalances } from "@tharsis/provider";
import { CantoMainnet } from "cantoui";
import { ERC20Abi } from "global/config/abi";

export function useCosmosTokens(account: string | undefined): {
  gravityTokens: GTokens[] | undefined;
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
    useCalls(tokens ? calls.flat() : [], { chainId: CantoMainnet.chainId }) ??
    {};

  if (account == undefined) {
    return { gravityTokens: undefined };
  }
  if (tokens == undefined) {
    return { gravityTokens: [] };
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
      const allowance = Number.MAX_SAFE_INTEGER;
      return {
        data: tokens[idx],
        wallet: account,
        balanceOf,
        allowance,
      };
    });

    if (val[0].balanceOf == undefined) return { gravityTokens: undefined };

    return { gravityTokens: val };
  }

  return { gravityTokens: undefined };
}

export interface NativeGTokens extends GTokens {
  nativeBalanceOf: string;
}

export async function getCantoBalance(
  nodeAddressIP: string,
  cantoAddress: string,
  gravityTokens: GTokens[]
): Promise<NativeGTokens[]> {
  const url = nodeAddressIP + "/" + generateEndpointBalances(cantoAddress);
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  const result = await fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      return result["balances"];
    })
    .catch((err) => {
      console.log(err);
    });
  //   console.log(result);
  return gravityTokens.map((token) => {
    // console.log(token);
    const nativeBalanceOf =
      result.find((data: any) => data.denom == token.data.nativeName)?.amount ??
      "0";

    return {
      ...token,
      nativeBalanceOf: ethers.utils.formatUnits(
        nativeBalanceOf,
        token.data.decimals
      ),
    };
  });
}

export async function getGravityTokenBalance(gravityAddress: string) {
  const url =
    "https://gravitychain.io:1317/" + generateEndpointBalances(gravityAddress);
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };
  return await fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      return result["balances"];
    })
    .catch((err) => {
      console.log(err);
    });
}
