import cosmosIcon from "assets/icons/ATOM.svg";
import GravitonGrey from "assets/icons/Graviton-Grey.svg";
import { TOKENS } from "global/config/tokenInfo";
import { ALL_IBC_TOKENS_WITH_DENOMS } from "./bridgingTokens";
import { BridgeOutNetworkInfo, BridgeOutNetworks } from "./interfaces";

export type BridgeOutNetworkData = {
  [key in BridgeOutNetworks]: BridgeOutNetworkInfo;
};

function addressCheck(address: string | undefined, addressBeginning: string) {
  if (!address) {
    return false;
  }
  return (
    address.slice(0, addressBeginning.length) == addressBeginning &&
    address.length == 39 + addressBeginning.length
  );
}
export const CANTO_IBC_NETWORK: BridgeOutNetworkInfo = {
  name: "canto",
  icon: TOKENS.cantoMainnet.CANTO.icon,
  tokens: [],
  cantoChannel: "",
  networkChannel: "",
  endpoint: "",
  addressBeginning: "canto",
  checkAddress: function (address) {
    return addressCheck(address, this.addressBeginning);
  },
};
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
    cantoChannel: "channel-0",
    networkChannel: "channel-88",
    endpoint: "https://gravitychain.io:1317",
    extraEndpoints: ["https://gravity-api.polkachu.com"],
    addressBeginning: "gravity",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [BridgeOutNetworks.COSMOS_HUB]: {
    name: "cosmos hub",
    icon: cosmosIcon,
    tokens: [ALL_IBC_TOKENS_WITH_DENOMS.ATOM],
    cantoChannel: "channel-2",
    networkChannel: "channel-358",
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
    cantoChannel: "channel-5",
    networkChannel: "channel-550",
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
    cantoChannel: "channel-7",
    networkChannel: "channel-58",
    endpoint: "https://rest.comdex.one",
    addressBeginning: "comdex",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [BridgeOutNetworks.INJECTIVE]: {
    name: "injective",
    icon: TOKENS.cantoMainnet.INJECTIVE.icon,
    tokens: [ALL_IBC_TOKENS_WITH_DENOMS.INJECTIVE],
    cantoChannel: "channel-8",
    networkChannel: "channel-99",
    endpoint: "https://lcd.injective.network/",
    latestBlockEndpoint: "/cosmos/base/tendermint/v1beta1",
    addressBeginning: "inj",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [BridgeOutNetworks.CRESCENT]: {
    name: "crescent",
    icon: TOKENS.cantoMainnet.CRESCENT.icon,
    tokens: [ALL_IBC_TOKENS_WITH_DENOMS.CRESCENT],
    cantoChannel: "channel-9",
    networkChannel: "channel-34",
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
    cantoChannel: "channel-10",
    networkChannel: "channel-2",
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
    cantoChannel: "channel-11",
    networkChannel: "channel-59",
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
    cantoChannel: "channel-13",
    networkChannel: "channel-87",
    endpoint: "https://api.data.kava.io/",
    addressBeginning: "kava",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
};
