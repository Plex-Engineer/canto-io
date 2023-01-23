import {
  CantoMainnet,
  CantoTestnet,
  NodeAddresses,
} from "global/config/networks";
import { BigNumber, ethers } from "ethers";


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

export async function getChainIdandAccount(): Promise<string[] | undefined[]> {
  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    await window.ethereum.request({ method: "eth_requestAccounts" });
    //@ts-ignore
    return [window.ethereum.networkVersion, window.ethereum.selectedAddress];
  }
  return [undefined, undefined];
}
export async function connect() {
  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    window.ethereum.request({ method: "eth_requestAccounts" });
    addNetwork();
  }
}

export async function getAccountBalance(account: string | undefined) {
  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    return await window.ethereum.request({
      method: "eth_getBalance",
      params: [account, "latest"],
    });
  }
  return BigNumber.from(0);
}

export async function getCantoAddressFromMetaMask(address: string | undefined) {
  const nodeURLMain = CantoMainnet.cosmosAPIEndpoint;
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

export function addEthMainToWallet() {
  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: "0x1",
        },
      ],
    });
  }
}
