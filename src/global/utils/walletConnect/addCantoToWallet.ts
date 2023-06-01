import { getCosmosAPIEndpoint, getETHNetwork } from "../getAddressUtils";

export async function switchNetwork(chainId: number) {
  //@ts-ignore
  if (window.ethereum) {
    try {
      //@ts-ignore
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + chainId.toString(16) }],
      });
    } catch (error: unknown) {
      console.error(error);
    }
  }
}

export async function addNetwork(chainId?: number) {
  const network = getETHNetwork(chainId);
  //@ts-ignore
  if (window.ethereum) {
    try {
      //@ts-ignore
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + network.chainId.toString(16) }],
      });
    } catch (error: unknown) {
      //@ts-ignore
      if (error.code === 4902) {
        //@ts-ignore
        window?.ethereum
          .request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x" + network.chainId.toString(16),
                chainName: network.name,
                nativeCurrency: network.nativeCurrency,
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.blockExplorerUrl],
              },
            ],
          })
          .catch((error: unknown) => {
            console.error(error);
          });
      }
    }
  }
}

export async function getCantoAddressFromMetaMask(
  address: string | undefined,
  chainId?: number
) {
  const nodeURLMain = getCosmosAPIEndpoint(chainId);
  const result = await fetch(
    nodeURLMain + "/ethermint/evm/v1/cosmos_account/" + address,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );
  return (await result.json()).cosmos_address;
}
