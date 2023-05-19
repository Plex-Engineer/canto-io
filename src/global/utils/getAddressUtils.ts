import { ethers } from "ethers";
import {
  ALL_SUPPORTED_CANTO_NETWORKS,
  ALL_SUPPORTED_ETH_NETWORKS,
  ALL_SUPPORTED_NETWORKS,
  CantoMainnet,
  ETHMainnet,
} from "global/config/networks";

//DEFAULTS WILL BE CANTOMAINNET && ETHMAINNET
export function getAddressesForCantoNetwork(chainId?: number | undefined) {
  return (
    ALL_SUPPORTED_CANTO_NETWORKS.find((network) => network.chainId == chainId)
      ?.coreContracts ?? CantoMainnet.coreContracts
  );
}
export function getAddressesForEthNetwork(chainId?: number | undefined) {
  return (
    ALL_SUPPORTED_ETH_NETWORKS.find((network) => network.chainId == chainId)
      ?.coreContracts ?? ETHMainnet.coreContracts
  );
}

function getRPCURL(chainId?: number | undefined) {
  return (
    ALL_SUPPORTED_NETWORKS.find((network) => network.chainId == chainId)
      ?.rpcUrl ?? CantoMainnet.rpcUrl
  );
}
export function getCurrentProvider(chainId?: number) {
  return new ethers.providers.JsonRpcProvider(getRPCURL(chainId));
}
export function getCosmosAPIEndpoint(chainId?: number | undefined) {
  return (
    ALL_SUPPORTED_CANTO_NETWORKS.find((network) => network.chainId == chainId)
      ?.cosmosAPIEndpoint ?? CantoMainnet.cosmosAPIEndpoint
  );
}
export function getCosmosChainObj(chainId?: number | undefined) {
  const network =
    ALL_SUPPORTED_CANTO_NETWORKS.find(
      (network) => network.chainId == chainId
    ) ?? CantoMainnet;
  return {
    chainId: network.chainId,
    cosmosChainId: network.cosmosChainId,
  };
}

//will return if we are on a supported canto-type network
export function onCantoNetwork(chainId?: number | undefined): boolean {
  return !!ALL_SUPPORTED_CANTO_NETWORKS.find(
    (network) => network.chainId == chainId
  );
}
