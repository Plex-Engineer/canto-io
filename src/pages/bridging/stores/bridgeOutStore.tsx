import create from "zustand";
import {
  getBridgeOutMethodFromToken,
  getBridgeOutNetworksFromMethod,
} from "./utils";
import { useNetworkInfo } from "global/stores/networkInfo";

import layerZeroIcon from "assets/icons/layer_zero.png";
import bridgeIcon from "assets/icons/canto-bridge.svg";
import { BaseSelector } from "../config/interfaces";

export enum BridgeOutMethods {
  IBC = "IBC",
  LAYER_ZERO = "LAYER_ZERO",
}

export const ALL_BRIDGE_OUT_METHODS: BaseSelector[] = [
  {
    id: BridgeOutMethods.IBC,
    name: "IBC",
    icon: bridgeIcon,
  },
  {
    id: BridgeOutMethods.LAYER_ZERO,
    name: "Layer Zero",
    icon: layerZeroIcon,
  },
];

interface BridgeOutStore {
  selectedBridgeMethod: string;
  setBridgeMethod: (method: string) => void;
  selectedToken: string | undefined;
  setToken: (token: string) => void;
  bridgeOutNetworks: BaseSelector[];
  selectedBridgeOutNetwork: string | undefined;
  setBridgeOutNetwork: (networkId: string) => void;
}

export const useBridgeOutStore = create<BridgeOutStore>()((set) => ({
  selectedBridgeMethod: BridgeOutMethods.IBC,
  setBridgeMethod: (method) =>
    set({
      selectedBridgeMethod: method,
      selectedToken: undefined,
      selectedBridgeOutNetwork: undefined,
      bridgeOutNetworks: getBridgeOutNetworksFromMethod(
        method,
        Number(useNetworkInfo.getState().chainId)
      ),
    }),
  selectedToken: undefined,
  setToken: (tokenAddress) => {
    const bridgeMethod = getBridgeOutMethodFromToken(tokenAddress);
    set({
      selectedToken: tokenAddress,
      selectedBridgeMethod: bridgeMethod,
      bridgeOutNetworks: getBridgeOutNetworksFromMethod(
        bridgeMethod,
        Number(useNetworkInfo.getState().chainId)
      ),
    });
  },
  bridgeOutNetworks: getBridgeOutNetworksFromMethod(
    BridgeOutMethods.IBC,
    Number(useNetworkInfo.getState().chainId)
  ),
  selectedBridgeOutNetwork: undefined,
  setBridgeOutNetwork: (networkId) =>
    set({ selectedBridgeOutNetwork: networkId }),
}));
