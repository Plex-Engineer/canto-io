import create from "zustand";
import { BridgingNetwork, EMPTYNETWORK } from "../config/bridgingInterfaces";
import { Token } from "global/config/interfaces/tokens";
import {
  CANTO_MAIN_BRIDGE_NETWORK,
  getBridgingNetworksFromChainId,
} from "../config/networks.ts";
import { getUserTokenBalances } from "global/utils/api/tokenBalances";
import { useNetworkInfo } from "global/stores/networkInfo";

interface BridgingStore {
  allNetworks: BridgingNetwork[];
  fromNetwork: BridgingNetwork;
  toNetwork: BridgingNetwork;
  setNetwork: (network: BridgingNetwork, isFrom: boolean) => Promise<void>;
  allTokens: Token[]; //include balances on the tokens
  selectedToken: Token | undefined;
  setToken: (token: Token) => void;
  //to know if we are on testnet
  chainIdChanged: (chainId: number) => Promise<void>;
}

const useBridgingStore = create<BridgingStore>((set, get) => ({
  allNetworks: getBridgingNetworksFromChainId(),
  fromNetwork: getBridgingNetworksFromChainId()[1], //defualt will be ETH
  toNetwork: CANTO_MAIN_BRIDGE_NETWORK, //default will be CANTO
  setNetwork: async (network, isFrom) => {
    set(isFrom ? { fromNetwork: network } : { toNetwork: network });
    const fromIsEVM = get().fromNetwork.isEVM;
    if (fromIsEVM) {
      const accountInfo = useNetworkInfo.getState();
      set({
        allTokens: await getUserTokenBalances(
          getTokensFromBridgingNetworks(get().fromNetwork, get().toNetwork),
          accountInfo.account,
          Number(get().fromNetwork.evmChainId)
        ),
      });
    } else {
      //ibc chain so we don't want to get balances here
      set({
        allTokens: getTokensFromBridgingNetworks(
          get().fromNetwork,
          get().toNetwork
        ),
      });
    }
  },
  allTokens: [],
  selectedToken: undefined,
  setToken: (token) => set({ selectedToken: token }),
  chainIdChanged: async (chainId) => {
    const allNetworks = getBridgingNetworksFromChainId(chainId);
    const from = allNetworks[1] ?? EMPTYNETWORK;
    const to = allNetworks[0] ?? EMPTYNETWORK;
    const accountInfo = useNetworkInfo.getState();
    set({
      allNetworks: allNetworks,
      fromNetwork: from,
      toNetwork: to,
      allTokens: await getUserTokenBalances(
        getTokensFromBridgingNetworks(from, to),
        accountInfo.account,
        Number(from.evmChainId)
      ),
      selectedToken: undefined,
    });
  },
}));

function getTokensFromBridgingNetworks(
  from: BridgingNetwork,
  to: BridgingNetwork
) {
  const allTokens = [];
  if (to.isCanto) {
    //BRIDGE IN: look to see how to bridge from the other network
    for (const method of from.supportedBridgeOutMethods) {
      allTokens.push(...(from[method]?.tokens?.toCanto ?? []));
    }
  } else if (from.isCanto) {
    //BRIDGE OUT: look to see how to bridge into other network
    for (const method of to.supportedBridgeInMethods) {
      allTokens.push(...(to[method]?.tokens.fromCanto ?? []));
    }
  }
  return allTokens;
}

export default useBridgingStore;
