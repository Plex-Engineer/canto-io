import { useCalls} from "@usedapp/core";
import { Contract } from "ethers";
import { GravityTestnet } from "config/networks";
import { gravityTokenBase, mainnetGravityTokensBase } from "config/gravityBridgeTokens";
import {abi } from "config/abi"
import { ethers } from "ethers";
import { ADDRESSES } from "cantoui";


export interface GTokens  {
  data: {
      symbol: string;
      name: string;
      decimals: number;
      address: string;
      isERC20: boolean;
      isLP: boolean;
      icon: string;
      cTokenAddress: string;
      nativeName?: string
  };
  wallet: string;
  balanceOf: string;
  allowance: number;
}[]

export function useGravityTokens(
  account: string | undefined, chainId:number
): { gravityTokens : GTokens[] | undefined, gravityAddress: string| undefined} {
  const tokens = chainId == GravityTestnet.chainId ? gravityTokenBase : mainnetGravityTokensBase
  const gravityAddress = chainId == GravityTestnet.chainId ? ADDRESSES.gravityBridgeTest.GravityBridge : ADDRESSES.ETHMainnet.GravityBridge;

  const calls =
    tokens?.map((token) => {
      const ERC20Contract = new Contract(token.address, abi.Erc20);

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
  const results = useCalls(typeof tokens == typeof mainnetGravityTokensBase ? calls.flat(): []) ?? {};

  if (account == undefined) {
    return {gravityTokens: undefined, gravityAddress: undefined};
  }
  if(tokens == undefined){
    return {gravityTokens: [], gravityAddress: undefined }
  }
  const chuckSize = results.length / tokens.length;
  let processedTokens: Array<any>;
  const array_chunks = (array: any[], chunk_size: number) => {
    const rep = array.map((array) => array?.value);
    let chunks = [];

    for (let i = 0; i < array.length; i += chunk_size) {
      chunks.push(rep.slice(i, i + chunk_size));
    }
    return chunks;
  };
  if (chuckSize > 0 && results?.[0] != undefined && !results?.[0].error) {
    processedTokens = array_chunks(results, chuckSize);
    const val = processedTokens.map((tokenData, idx) => {
      const balanceOf = ethers.utils.formatUnits(tokenData[0][0], tokens[idx].decimals)
      const allowance = Number(ethers.utils.formatUnits(tokenData[1][0], tokens[idx].decimals));
     
      return {
        data: tokens[idx],
        wallet: account,
        balanceOf,
        allowance,
      };
    });

    if(val[0].balanceOf == undefined)
    return {gravityTokens: undefined, gravityAddress: gravityAddress}

    return {gravityTokens: val, gravityAddress: gravityAddress};
  }

  return {gravityTokens: undefined, gravityAddress: undefined};
}
