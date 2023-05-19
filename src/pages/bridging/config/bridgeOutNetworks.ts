import cosmosIcon from "assets/icons/ATOM.svg";
import GravitonGrey from "assets/icons/Graviton-Grey.svg";
import { TOKENS } from "global/config/tokenInfo";
import { CANTO_MAIN_IBC_TOKENS_WITH_DENOMS } from "./bridgingTokens";
import { BridgeOutNetworkInfo, CantoMainBridgeOutNetworks } from "./interfaces";

export type BridgeOutNetworkData = {
  [key: string]: BridgeOutNetworkInfo;
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
const blockEndpoint = "/cosmos/base/tendermint/v1beta1";

export const EMPTY_IBC_NETWORK: BridgeOutNetworkInfo = {
  name: "unknown",
  chainId: "",
  icon: "",
  tokens: [],
  nativeDenom: "unkown",
  cantoChannel: "",
  networkChannel: "",
  restEndpoint: "",
  rpcEndpoint: "",
  addressBeginning: "unknown",
  checkAddress: function (address) {
    return addressCheck(address, this.addressBeginning);
  },
};
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
export const CANTO_MAIN_BRIDGE_OUT_NETWORKS: BridgeOutNetworkData = {
  [CantoMainBridgeOutNetworks.GRAVITY_BRIDGE]: {
    name: "gravity bridge",
    chainId: "gravity-bridge-3",
    icon: GravitonGrey,
    tokens: [
      CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.GRAV,
      CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.ETH,
      CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.USDC,
      CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.USDT,
      CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.WSTETH,
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
  [CantoMainBridgeOutNetworks.COSMOS_HUB]: {
    name: "cosmos hub",
    chainId: "cosmoshub-4",
    icon: cosmosIcon,
    tokens: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.ATOM],
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
  [CantoMainBridgeOutNetworks.OSMOSIS]: {
    name: "osmosis",
    chainId: "osmosis-1",
    icon: TOKENS.cantoMainnet.OSMOSIS.icon,
    tokens: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.OSMOSIS],
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
  [CantoMainBridgeOutNetworks.COMDEX]: {
    name: "comdex",
    chainId: "comdex-1",
    icon: TOKENS.cantoMainnet.COMDEX.icon,
    tokens: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.COMDEX],
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
  [CantoMainBridgeOutNetworks.INJECTIVE]: {
    name: "injective",
    chainId: "injective-1",
    icon: TOKENS.cantoMainnet.INJECTIVE.icon,
    tokens: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.INJECTIVE],
    nativeDenom: "inj",
    cantoChannel: "channel-8",
    networkChannel: "channel-99",
    restEndpoint: "https://lcd.injective.network",
    rpcEndpoint: "https://injective-rpc.polkachu.com",
    latestBlockEndpoint: blockEndpoint,
    addressBeginning: "inj",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [CantoMainBridgeOutNetworks.CRESCENT]: {
    name: "crescent",
    chainId: "crescent-1",
    icon: TOKENS.cantoMainnet.CRESCENT.icon,
    tokens: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.CRESCENT],
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
  [CantoMainBridgeOutNetworks.SOMMELIER]: {
    name: "sommelier",
    chainId: "sommelier-3",
    icon: TOKENS.cantoMainnet.SOMM.icon,
    tokens: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.SOMM],
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
  [CantoMainBridgeOutNetworks.AKASH]: {
    name: "akash",
    chainId: "akashnet-2",
    icon: TOKENS.cantoMainnet.AKASH.icon,
    tokens: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.AKASH],
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
  [CantoMainBridgeOutNetworks.KAVA]: {
    name: "kava",
    chainId: "kava_2222-10",
    icon: TOKENS.cantoMainnet.KAVA.icon,
    tokens: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.KAVA],
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
  [CantoMainBridgeOutNetworks.SENTINEL]: {
    name: "sentinel",
    chainId: "sentinelhub-2",
    icon: TOKENS.cantoMainnet.SENTINAL.icon,
    tokens: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.SENTINAL],
    nativeDenom: "udvpn",
    cantoChannel: "channel-16",
    networkChannel: "channel-71",
    restEndpoint: "https://api-sentinel-ia.cosmosia.notional.ventures/",
    rpcEndpoint: "https://rpc-sentinel-ia.cosmosia.notional.ventures/",
    addressBeginning: "sent",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [CantoMainBridgeOutNetworks.EVMOS]: {
    name: "evmos",
    chainId: "evmos_9001-2",
    icon: TOKENS.cantoMainnet.EVMOS.icon,
    tokens: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.EVMOS],
    nativeDenom: "aevmos",
    restEndpoint: "https://evmos.kingnodes.com",
    rpcEndpoint: "https://evmos.kingnodes.com",
    cantoChannel: "channel-15",
    networkChannel: "channel-62",
    addressBeginning: "evmos",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [CantoMainBridgeOutNetworks.PERSISTENCE]: {
    name: "persistence",
    chainId: "core-1",
    icon: TOKENS.cantoMainnet.PERSISTENCE.icon,
    tokens: [
      CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.PERSISTENCE,
      CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.PSTAKEDATOM,
    ],
    nativeDenom: "uxprt",
    restEndpoint: "https://rest.core.persistence.one",
    rpcEndpoint: "https://rpc.core.persistence.one",
    cantoChannel: "channel-17",
    networkChannel: "channel-80",
    addressBeginning: "persistence",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [CantoMainBridgeOutNetworks.STRIDE]: {
    name: "stride",
    chainId: "stride-1",
    icon: TOKENS.cantoMainnet.STRIDE.icon,
    tokens: [
      CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.STRIDE,
      CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.STEVMOS,
      CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.STATOM,
      CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.STJUNO,
      CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.STOSMO,
      CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.STSTARS,
    ],
    nativeDenom: "ustrd",
    restEndpoint: "https://stride-api.polkachu.com/",
    rpcEndpoint: "https://stride-rpc.polkachu.com/",
    latestBlockEndpoint: blockEndpoint,
    cantoChannel: "channel-18",
    networkChannel: "channel-74",
    addressBeginning: "stride",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
  [CantoMainBridgeOutNetworks.QUICKSILVER]: {
    name: "quicksilver",
    chainId: "quicksilver-2",
    icon: TOKENS.cantoMainnet.QUICKSILVER.icon,
    tokens: [
      CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.QUICKSILVER,
      CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.QATOM,
      CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.QREGEN,
      CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.QSTARS,
    ],
    nativeDenom: "uqck",
    restEndpoint: "https://quicksilver-api.lavenderfive.com:443",
    rpcEndpoint: "https://rpc.quicksilver.zone:443",
    latestBlockEndpoint: blockEndpoint,
    cantoChannel: "channel-19",
    networkChannel: "channel-24",
    addressBeginning: "quick",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
  },
};
