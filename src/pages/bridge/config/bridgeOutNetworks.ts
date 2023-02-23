import { NativeERC20Tokens } from "./interfaces";
import {
  CONVERT_COIN_TOKENS,
  COSMOS_HUB_BRIDGE_OUT_TOKENS,
} from "./bridgingTokens";
import cosmosIcon from "assets/icons/ATOM.svg";
import GravitonGrey from "assets/icons/Graviton-Grey.svg";

export interface BridgeOutNetworkInfo {
  name: string;
  icon: string;
  tokens: NativeERC20Tokens[];
  channel: string;
  endpoint: string;
  addressBeginning: string;
  checkAddress: (address: string) => boolean;
}
export type BridgeOutNetworkTokenData = {
  [key in BridgeOutNetworks]: BridgeOutNetworkInfo;
};

export enum BridgeOutNetworks {
  GRAVITY_BRIDGE,
  COSMOS_HUB,
}

export const ALL_BRIDGE_OUT_NETWORKS: BridgeOutNetworkTokenData = {
  [BridgeOutNetworks.GRAVITY_BRIDGE]: {
    name: "gravity bridge",
    icon: GravitonGrey,
    tokens: CONVERT_COIN_TOKENS,
    channel: "channel-0",
    endpoint: "https://gravitychain.io:1317",
    addressBeginning: "gravity",
    checkAddress: function (address) {
      return (
        address.slice(0, this.addressBeginning.length) ==
          this.addressBeginning && address.length == 46
      );
    },
  },
  [BridgeOutNetworks.COSMOS_HUB]: {
    name: "cosmos hub",
    icon: cosmosIcon,
    tokens: COSMOS_HUB_BRIDGE_OUT_TOKENS,
    channel: "channel-2",
    endpoint: "https://api-cosmoshub-ia.cosmosia.notional.ventures/",
    addressBeginning: "cosmos",
    checkAddress: function (address) {
      return (
        address.slice(0, this.addressBeginning.length) ==
          this.addressBeginning && address.length == 45
      );
    },
  },
};
