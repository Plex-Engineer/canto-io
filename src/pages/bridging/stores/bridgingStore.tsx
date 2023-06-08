import create from "zustand";
import { BridgingNetwork, EMPTYNETWORK } from "../config/bridgingInterfaces";
import { Token } from "global/config/interfaces/tokens";
import {
  CANTO_MAIN_BRIDGE_NETWORK,
  getBridgingNetworksFromChainId,
} from "../config/networks.ts";
import { getUserTokenBalances } from "global/utils/api/tokenBalances";
import { useNetworkInfo } from "global/stores/networkInfo";
import { BigNumber } from "ethers";
import { bridgeTxRouter } from "../utils/transactions";
import { useTransactionStore } from "global/stores/transactionStore";
import { onTestnet } from "global/config/networks";

interface BridgingStore {
  //networks
  allNetworks: BridgingNetwork[];
  fromNetwork: BridgingNetwork;
  toNetwork: BridgingNetwork;
  setNetwork: (network: BridgingNetwork, isFrom: boolean) => Promise<void>;
  //tokens
  allTokens: Token[]; //include balances on the tokens
  selectedToken: Token | undefined;
  setToken: (token?: Token) => void;
  syncTokens: () => Promise<void>;
  //to know if we are on testnet
  onTestnet: boolean;
  chainIdChanged: (chainId: number) => Promise<void>;
  //tx
  bridgeTx: (amount: BigNumber, toChainAddress?: string) => Promise<boolean>;
}

const useBridgingStore = create<BridgingStore>((set, get) => ({
  allNetworks: getBridgingNetworksFromChainId(),
  fromNetwork: getBridgingNetworksFromChainId()[1], //defualt will be ETH
  toNetwork: CANTO_MAIN_BRIDGE_NETWORK, //default will be CANTO
  setNetwork: async (network, isFrom) => {
    //reset tokens first
    set({ selectedToken: undefined, allTokens: [] });

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
  syncTokens: async () => {
    const fromIsEVM = get().fromNetwork.isEVM;
    if (fromIsEVM) {
      const newTokenList = await getUserTokenBalances(
        getTokensFromBridgingNetworks(get().fromNetwork, get().toNetwork),
        useNetworkInfo.getState().account,
        Number(get().fromNetwork.evmChainId)
      );
      const selectedToken = newTokenList.find(
        (token) => token.address === get().selectedToken?.address
      );
      set({ allTokens: newTokenList, selectedToken: selectedToken });
    }
  },
  onTestnet: false,
  chainIdChanged: async (chainId) => {
    const isOnTestnet = onTestnet(chainId);
    if (isOnTestnet !== get().onTestnet) {
      //we have a new set of networks, so we need to update the store
      const allNetworks = getBridgingNetworksFromChainId(chainId);
      const from = allNetworks[1] ?? EMPTYNETWORK;
      const to = allNetworks[0] ?? EMPTYNETWORK;
      const accountInfo = useNetworkInfo.getState();
      set({
        onTestnet: isOnTestnet,
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
    }
  },
  bridgeTx: async (amount, toChainAddress?: string) =>
    await bridgeTxRouter(
      useTransactionStore.getState(),
      useNetworkInfo.getState().account,
      useNetworkInfo.getState().cantoAddress,
      get().fromNetwork,
      get().toNetwork,
      get().selectedToken,
      amount,
      toChainAddress
    ),
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
