import { CallResult } from "@usedapp/core";
import { Contract } from "ethers";
import { getCosmosAPIEndpoint } from "../getAddressUtils";

export async function checkCosmosTxConfirmation(
  txHash: string,
  chainId?: number
): Promise<boolean> {
  const fetchOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let numberOfBlocksChecked = 0;
  while (numberOfBlocksChecked < 5) {
    const tx = await (
      await fetch(
        getCosmosAPIEndpoint(chainId) + "/cosmos/tx/v1beta1/txs/" + txHash,
        fetchOptions
      )
    ).json();
    if (tx.tx_response) {
      return tx.tx_response.code === 0;
    }
    numberOfBlocksChecked++;
    await sleep(4000);
  }
  //since we have checked multiple blocks, the transaction must have failed

  return false;
}
export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//check to make sure that the multicall values are accetable
export function checkMultiCallForUndefined(
  results: CallResult<Contract, string>[]
) {
  for (const result of results) {
    if (!result || !result?.value || result?.error) {
      return false;
    }
  }
  return true;
}
