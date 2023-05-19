import {
  CantoMainnet,
  CantoTestnet,
  ETHMainnet,
  GravityTestnet,
} from "global/config/networks";
import { BridgeNetworkPair } from "./interfaces";
import {
  CANTO_MAIN_CONVERT_COIN_TOKENS,
  CANTO_MAIN_IBC_TOKENS_WITH_DENOMS,
  CANTO_MAIN_NATIVE_COMSOS_TOKENS,
  ETH_GRAVITY_BRIDGE_IN_TOKENS,
} from "./bridgingTokens";
import { CANTO_MAIN_BRIDGE_OUT_NETWORKS } from "./bridgeOutNetworks";

function onSendingNetwork(chainId?: number | undefined): boolean {
  return !!ALL_BRIDGE_NETWORK_PAIRS.find(
    (pair) => pair.sending.network.chainId == chainId
  );
}
function onReceivingNetwork(chainId?: number | undefined): boolean {
  return !!ALL_BRIDGE_NETWORK_PAIRS.find(
    (pair) => pair.receiving.network.chainId == chainId
  );
}

export function getNetworkPair(chainId: number | undefined): BridgeNetworkPair {
  const pairId = getPairId(chainId);
  return (
    ALL_BRIDGE_NETWORK_PAIRS.find((pair) => pair.pairId == pairId) ??
    ALL_BRIDGE_NETWORK_PAIRS[0]
  );
}
function getPairId(chainId: number | undefined) {
  return (
    ALL_BRIDGE_NETWORK_PAIRS.find(
      (pair) =>
        pair.sending.network.chainId == chainId ||
        pair.receiving.network.chainId == chainId
    )?.pairId ?? "ETH-Canto"
  );
}

const ALL_BRIDGE_NETWORK_PAIRS: BridgeNetworkPair[] = [
  {
    pairId: "ETH-Canto",
    sending: {
      network: ETHMainnet,
      tokens: ETH_GRAVITY_BRIDGE_IN_TOKENS,
    },
    receiving: {
      network: CantoMainnet,
      convertCoinTokens: CANTO_MAIN_CONVERT_COIN_TOKENS,
      nativeCosmosTokens: CANTO_MAIN_NATIVE_COMSOS_TOKENS,
      ibcTokens: CANTO_MAIN_IBC_TOKENS_WITH_DENOMS,
      bridgeOutNetworks: CANTO_MAIN_BRIDGE_OUT_NETWORKS,
    },
  },
  {
    pairId: "GravityTest-CantoTest",
    sending: {
      network: GravityTestnet,
      tokens: [],
    },
    receiving: {
      network: CantoTestnet,
      convertCoinTokens: [],
      nativeCosmosTokens: [],
      ibcTokens: {},
      bridgeOutNetworks: {},
    },
  },
];
