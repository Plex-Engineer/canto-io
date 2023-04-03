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
  chainId: "",
  icon: TOKENS.cantoMainnet.CANTO.icon,
  tokens: [],
  nativeDenom: "canto",
  cantoChannel: "",
  networkChannel: "",
  restEndpoint: "",
  rpcEndpoint: "",
  addressBeginning: "canto",
  checkAddress: function (address) {
    return addressCheck(address, this.addressBeginning);
  },
};
export const ALL_BRIDGE_OUT_NETWORKS: BridgeOutNetworkData = {
  [BridgeOutNetworks.GRAVITY_BRIDGE]: {
    name: "gravity bridge",
    chainId: "gravity-bridge-3",
    icon: GravitonGrey,
    tokens: [
      ALL_IBC_TOKENS_WITH_DENOMS.GRAV,
      ALL_IBC_TOKENS_WITH_DENOMS.ETH,
      ALL_IBC_TOKENS_WITH_DENOMS.USDC,
      ALL_IBC_TOKENS_WITH_DENOMS.USDT,
    ],
    nativeDenom: "ugraviton",
    cantoChannel: "channel-0",
    networkChannel: "channel-88",
    restEndpoint: "https://gravitychain.io:1317",
    rpcEndpoint: "https://gravitychain.io:26657",
    extraEndpoints: ["https://gravity-api.polkachu.com"],
    addressBeginning: "gravity",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [BridgeOutNetworks.COSMOS_HUB]: {
    name: "cosmos hub",
    chainId: "cosmoshub-4",
    icon: cosmosIcon,
    tokens: [ALL_IBC_TOKENS_WITH_DENOMS.ATOM],
    nativeDenom: "uatom",
    cantoChannel: "channel-2",
    networkChannel: "channel-358",
    restEndpoint: "https://api-cosmoshub-ia.cosmosia.notional.ventures",
    rpcEndpoint: "https://rpc-cosmoshub.blockapsis.com",
    addressBeginning: "cosmos",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [BridgeOutNetworks.OSMOSIS]: {
    name: "osmosis",
    chainId: "osmosis-1",
    icon: TOKENS.cantoMainnet.OSMOSIS.icon,
    tokens: [ALL_IBC_TOKENS_WITH_DENOMS.OSMOSIS],
    nativeDenom: "uosmo",
    cantoChannel: "channel-5",
    networkChannel: "channel-550",
    restEndpoint: "https://lcd.osmosis.zone",
    rpcEndpoint: "https://rpc.osmosis.zone",
    addressBeginning: "osmo",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [BridgeOutNetworks.COMDEX]: {
    name: "comdex",
    chainId: "comdex-1",
    icon: TOKENS.cantoMainnet.COMDEX.icon,
    tokens: [ALL_IBC_TOKENS_WITH_DENOMS.COMDEX],
    nativeDenom: "ucmdx",
    cantoChannel: "channel-7",
    networkChannel: "channel-58",
    restEndpoint: "https://rest.comdex.one",
    rpcEndpoint: "https://rpc.comdex.one",
    addressBeginning: "comdex",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [BridgeOutNetworks.INJECTIVE]: {
    name: "injective",
    chainId: "injective-1",
    icon: TOKENS.cantoMainnet.INJECTIVE.icon,
    tokens: [ALL_IBC_TOKENS_WITH_DENOMS.INJECTIVE],
    nativeDenom: "inj",
    cantoChannel: "channel-8",
    networkChannel: "channel-99",
    restEndpoint: "https://lcd.injective.network",
    rpcEndpoint: "https://injective-rpc.polkachu.com",
    latestBlockEndpoint: "/cosmos/base/tendermint/v1beta1",
    addressBeginning: "inj",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [BridgeOutNetworks.CRESCENT]: {
    name: "crescent",
    chainId: "crescent-1",
    icon: TOKENS.cantoMainnet.CRESCENT.icon,
    tokens: [ALL_IBC_TOKENS_WITH_DENOMS.CRESCENT],
    nativeDenom: "ucre",
    cantoChannel: "channel-9",
    networkChannel: "channel-34",
    restEndpoint: "https://mainnet.crescent.network:1317",
    rpcEndpoint: "https://mainnet.crescent.network:26657",
    addressBeginning: "cre",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [BridgeOutNetworks.SOMMELIER]: {
    name: "sommelier",
    chainId: "sommelier-3",
    icon: TOKENS.cantoMainnet.SOMM.icon,
    tokens: [ALL_IBC_TOKENS_WITH_DENOMS.SOMM],
    nativeDenom: "usomm",
    cantoChannel: "channel-10",
    networkChannel: "channel-2",
    restEndpoint: "https://sommelier-api.polkachu.com",
    rpcEndpoint: "https://sommelier-rpc.lavenderfive.com",
    addressBeginning: "somm",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [BridgeOutNetworks.AKASH]: {
    name: "akash",
    chainId: "akashnet-2",
    icon: TOKENS.cantoMainnet.AKASH.icon,
    tokens: [ALL_IBC_TOKENS_WITH_DENOMS.AKASH],
    nativeDenom: "uakt",
    cantoChannel: "channel-11",
    networkChannel: "channel-59",
    restEndpoint: "https://api-akash-ia.cosmosia.notional.ventures",
    rpcEndpoint: "https://akash-rpc.polkachu.com",
    addressBeginning: "akash",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [BridgeOutNetworks.KAVA]: {
    name: "kava",
    chainId: "kava_2222-10",
    icon: TOKENS.cantoMainnet.KAVA.icon,
    tokens: [ALL_IBC_TOKENS_WITH_DENOMS.KAVA],
    nativeDenom: "ukava",
    cantoChannel: "channel-13",
    networkChannel: "channel-87",
    restEndpoint: "https://api.data.kava.io",
    rpcEndpoint: "https://rpc.data.kava.io",
    addressBeginning: "kava",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
};
