import { NativeERC20Tokens } from "./interfaces";
import { ALL_IBC_TOKENS_WITH_DENOMS } from "./bridgingTokens";
import cosmosIcon from "assets/icons/ATOM.svg";
import GravitonGrey from "assets/icons/Graviton-Grey.svg";
import { TOKENS } from "global/config/tokenInfo";

export interface BridgeOutNetworkInfo {
  name: string;
  icon: string;
  tokens: NativeERC20Tokens[];
  channel: string;
  endpoint: string;
  addressBeginning: string;
  checkAddress: (address: string) => boolean;
}
export type BridgeOutNetworkData = {
  [key in BridgeOutNetworks]: BridgeOutNetworkInfo;
};

export enum BridgeOutNetworks {
  GRAVITY_BRIDGE,
  COSMOS_HUB,
  COMDEX,
  OSMOSIS,
  SOMMELIER,
  INJECTIVE,
  KAVA,
  AKASH,
  CRESCENT,
}
function addressCheck(address: string, addressBeginning: string) {
  return (
    address.slice(0, addressBeginning.length) == addressBeginning &&
    address.length == 39 + addressBeginning.length
  );
}
export const ALL_BRIDGE_OUT_NETWORKS: BridgeOutNetworkData = {
  [BridgeOutNetworks.GRAVITY_BRIDGE]: {
    name: "gravity bridge",
    icon: GravitonGrey,
    tokens: [
      ALL_IBC_TOKENS_WITH_DENOMS.GRAV,
      ALL_IBC_TOKENS_WITH_DENOMS.ETH,
      ALL_IBC_TOKENS_WITH_DENOMS.USDC,
      ALL_IBC_TOKENS_WITH_DENOMS.USDT,
      ALL_IBC_TOKENS_WITH_DENOMS.ATOM,
    ],
    channel: "channel-0",
    endpoint: "https://gravitychain.io:1317",
    addressBeginning: "gravity",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [BridgeOutNetworks.COSMOS_HUB]: {
    name: "cosmos hub",
    icon: cosmosIcon,
    tokens: [ALL_IBC_TOKENS_WITH_DENOMS.ATOM],
    channel: "channel-2",
    endpoint: "https://api-cosmoshub-ia.cosmosia.notional.ventures/",
    addressBeginning: "cosmos",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [BridgeOutNetworks.OSMOSIS]: {
    name: "osmosis",
    icon: TOKENS.cantoMainnet.OSMOSIS.icon,
    tokens: [ALL_IBC_TOKENS_WITH_DENOMS.OSMOSIS],
    channel: "channel-5",
    endpoint: "https://lcd.osmosis.zone/",
    addressBeginning: "osmo",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [BridgeOutNetworks.COMDEX]: {
    name: "comdex",
    icon: TOKENS.cantoMainnet.COMDEX.icon,
    tokens: [ALL_IBC_TOKENS_WITH_DENOMS.COMDEX],
    channel: "channel-7",
    endpoint: "https://rest.comdex.one",
    addressBeginning: "comdex",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [BridgeOutNetworks.CRESCENT]: {
    name: "crescent",
    icon: TOKENS.cantoMainnet.CRESCENT.icon,
    tokens: [ALL_IBC_TOKENS_WITH_DENOMS.CRESCENT],

    channel: "channel-9",
    endpoint: "https://mainnet.crescent.network:1317",
    addressBeginning: "cre",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [BridgeOutNetworks.SOMMELIER]: {
    name: "sommelier",
    icon: TOKENS.cantoMainnet.SOMM.icon,
    tokens: [ALL_IBC_TOKENS_WITH_DENOMS.SOMM],
    channel: "channel-10",
    endpoint: "https://sommelier-api.polkachu.com",
    addressBeginning: "somm",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [BridgeOutNetworks.AKASH]: {
    name: "akash",
    icon: TOKENS.cantoMainnet.AKASH.icon,
    tokens: [ALL_IBC_TOKENS_WITH_DENOMS.AKASH],
    channel: "channel-11",
    endpoint: "https://api-akash-ia.cosmosia.notional.ventures",
    addressBeginning: "akash",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [BridgeOutNetworks.KAVA]: {
    name: "kava",
    icon: TOKENS.cantoMainnet.KAVA.icon,
    tokens: [ALL_IBC_TOKENS_WITH_DENOMS.KAVA],
    channel: "channel-13",
    endpoint: "https://api.data.kava.io/",
    addressBeginning: "kava",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [BridgeOutNetworks.INJECTIVE]: {
    name: "injective",
    icon: TOKENS.cantoMainnet.INJECTIVE.icon,
    tokens: [ALL_IBC_TOKENS_WITH_DENOMS.INJECTIVE],
    channel: "channel-99",
    endpoint: "https://k8s.global.mainnet.lcd.injective.network:443", //TODO:
    addressBeginning: "inj",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
};
