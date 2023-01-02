import { CantoMainnet } from "global/config/networks";

export async function checkCosmosTxConfirmation(
  txHash: string
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
        CantoMainnet.cosmosAPIEndpoint + "/cosmos/tx/v1beta1/txs/" + txHash,
        fetchOptions
      )
    ).json();
    if (tx.tx_response) {
      return true;
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
