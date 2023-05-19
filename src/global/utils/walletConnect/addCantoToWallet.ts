import {
  CantoMainnet,
  CantoTestnet,
  NodeAddresses,
} from "global/config/networks";
import { ethers } from "ethers";
import { getCosmosAPIEndpoint } from "../getAddressUtils";

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
export function getProvider(chainId: number) {
  const providerURL =
    CantoTestnet.chainId == chainId ? CantoTestnet.rpcUrl : CantoMainnet.rpcUrl;
  return new ethers.providers.JsonRpcProvider(providerURL);
}

export async function addNetwork() {
  //@ts-ignore
  if (window.ethereum) {
    try {
      //@ts-ignore
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + CantoMainnet.chainId.toString(16) }],
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
                chainId: "0x" + CantoMainnet.chainId.toString(16),
                chainName: "Canto",
                nativeCurrency: {
                  name: "Canto Coin",
                  symbol: "CANTO",
                  decimals: 18,
                },
                rpcUrls: [NodeAddresses.CantoMainnet.Plex.rpcUrl],
                blockExplorerUrls: [CantoMainnet.blockExplorerUrl],
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
