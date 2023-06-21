import { IBCNetwork } from "../bridgingInterfaces";
import { CANTO_MAIN_IBC_TOKENS_WITH_DENOMS } from "../tokens.ts/bridgingTokens";
import GravitonGrey from "assets/icons/Graviton-Grey.svg";
import cosmosIcon from "assets/icons/ATOM.svg";
import { TOKENS } from "global/config/tokenInfo";

export enum MainnetIBCNetworks {
  GRAVITY_BRIDGE = "Gravity_Bridge",
  COSMOS_HUB = "Cosmos_Hub",
  COMDEX = "Comdex",
  OSMOSIS = "Osmosis",
  SOMMELIER = "Sommelier",
  INJECTIVE = "Injective",
  KAVA = "Kava",
  AKASH = "Akash",
  CRESCENT = "Crescent",
  SENTINEL = "Sentinel",
  EVMOS = "Evmos",
  PERSISTENCE = "Persistence",
  STRIDE = "Stride",
  QUICKSILVER = "Quicksilver",
}
type CosmosIBCNetworkData = {
  [key in MainnetIBCNetworks]: IBCNetwork;
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

export const CANTO_IBC_NETWORK: IBCNetwork = {
  name: "canto",
  chainId: "canto_7700-1",
  icon: TOKENS.cantoMainnet.CANTO.icon,
  nativeCurrency: { denom: "acanto", decimals: 18 },
  channelFromCanto: "",
  channelToCanto: "",
  restEndpoint: "",
  rpcEndpoint: "",
  addressBeginning: "canto",
  checkAddress: function (address) {
    return addressCheck(address, this.addressBeginning);
  },
  tokens: {
    toCanto: [],
    fromCanto: [],
  },
};

const MAINNET_IBC_NETWORKS: CosmosIBCNetworkData = {
  [MainnetIBCNetworks.GRAVITY_BRIDGE]: {
    name: "gravity bridge",
    icon: GravitonGrey,
    chainId: "gravity-bridge-3",
    nativeCurrency: {
      denom: "ugraviton",
      decimals: 6,
    },
    channelFromCanto: "channel-0",
    channelToCanto: "channel-88",
    restEndpoint: "https://gravitychain.io:1317",
    rpcEndpoint: "https://gravitychain.io:26657",
    extraEndpoints: ["https://gravity-api.polkachu.com"],
    addressBeginning: "gravity",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
    tokens: {
      toCanto: [
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.GRAV,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.ETH,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.USDC,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.USDT,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.WSTETH,
      ],
      fromCanto: [
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.GRAV,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.ETH,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.USDC,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.USDT,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.WSTETH,
      ],
    },
  },
  [MainnetIBCNetworks.COSMOS_HUB]: {
    name: "cosmos hub",
    icon: cosmosIcon,
    chainId: "cosmoshub-4",
    nativeCurrency: {
      denom: "uatom",
      decimals: 6,
    },
    channelFromCanto: "channel-2",
    channelToCanto: "channel-358",
    restEndpoint: "https://api-cosmoshub-ia.cosmosia.notional.ventures",
    rpcEndpoint: "https://rpc-cosmoshub.blockapsis.com",
    addressBeginning: "cosmos",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
    tokens: {
      toCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.ATOM],
      fromCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.ATOM],
    },
  },
  [MainnetIBCNetworks.OSMOSIS]: {
    name: "osmosis",
    icon: TOKENS.cantoMainnet.OSMOSIS.icon,
    chainId: "osmosis-1",
    nativeCurrency: {
      denom: "uosmo",
      decimals: 6,
    },
    channelFromCanto: "channel-5",
    channelToCanto: "channel-550",
    restEndpoint: "https://lcd.osmosis.zone",
    rpcEndpoint: "https://rpc.osmosis.zone",
    addressBeginning: "osmo",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
    tokens: {
      toCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.OSMOSIS],
      fromCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.OSMOSIS],
    },
  },
  [MainnetIBCNetworks.COMDEX]: {
    name: "comdex",
    icon: TOKENS.cantoMainnet.COMDEX.icon,
    chainId: "comdex-1",
    nativeCurrency: {
      denom: "ucmdx",
      decimals: 6,
    },
    channelFromCanto: "channel-7",
    channelToCanto: "channel-58",
    restEndpoint: "https://rest.comdex.one",
    rpcEndpoint: "https://rpc.comdex.one",
    addressBeginning: "comdex",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
    tokens: {
      toCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.COMDEX],
      fromCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.COMDEX],
    },
  },
  [MainnetIBCNetworks.INJECTIVE]: {
    name: "injective",
    icon: TOKENS.cantoMainnet.INJECTIVE.icon,
    chainId: "injective-1",
    nativeCurrency: {
      denom: "inj",
      decimals: 18,
    },
    channelFromCanto: "channel-8",
    channelToCanto: "channel-99",
    restEndpoint: "https://lcd.injective.network",
    rpcEndpoint: "https://injective-rpc.polkachu.com",
    latestBlockEndpoint: blockEndpoint,
    addressBeginning: "inj",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
    tokens: {
      toCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.INJECTIVE],
      fromCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.INJECTIVE],
    },
  },
  [MainnetIBCNetworks.CRESCENT]: {
    name: "crescent",
    icon: TOKENS.cantoMainnet.CRESCENT.icon,
    chainId: "crescent-1",
    nativeCurrency: {
      denom: "ucre",
      decimals: 6,
    },
    channelFromCanto: "channel-9",
    channelToCanto: "channel-34",
    restEndpoint: "https://mainnet.crescent.network:1317",
    rpcEndpoint: "https://mainnet.crescent.network:26657",
    addressBeginning: "cre",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
    tokens: {
      toCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.CRESCENT],
      fromCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.CRESCENT],
    },
  },
  [MainnetIBCNetworks.SOMMELIER]: {
    name: "sommelier",
    icon: TOKENS.cantoMainnet.SOMM.icon,
    chainId: "sommelier-3",
    nativeCurrency: {
      denom: "usomm",
      decimals: 6,
    },
    channelFromCanto: "channel-10",
    channelToCanto: "channel-2",
    restEndpoint: "https://sommelier-api.polkachu.com",
    rpcEndpoint: "https://sommelier-rpc.lavenderfive.com",
    addressBeginning: "somm",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
    tokens: {
      toCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.SOMM],
      fromCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.SOMM],
    },
  },
  [MainnetIBCNetworks.AKASH]: {
    name: "akash",
    icon: TOKENS.cantoMainnet.AKASH.icon,
    chainId: "akashnet-2",
    nativeCurrency: {
      denom: "uakt",
      decimals: 6,
    },
    channelFromCanto: "channel-11",
    channelToCanto: "channel-59",
    restEndpoint: "https://api-akash-ia.cosmosia.notional.ventures",
    rpcEndpoint: "https://akash-rpc.polkachu.com",
    addressBeginning: "akash",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
    tokens: {
      toCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.AKASH],
      fromCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.AKASH],
    },
  },
  [MainnetIBCNetworks.KAVA]: {
    name: "kava",
    icon: TOKENS.cantoMainnet.KAVA.icon,
    chainId: "kava_2222-10",
    nativeCurrency: {
      denom: "ukava",
      decimals: 6,
    },
    channelFromCanto: "channel-13",
    channelToCanto: "channel-87",
    restEndpoint: "https://api.data.kava.io",
    rpcEndpoint: "https://rpc.data.kava.io",
    addressBeginning: "kava",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
    tokens: {
      toCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.KAVA],
      fromCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.KAVA],
    },
  },
  [MainnetIBCNetworks.SENTINEL]: {
    name: "sentinel",
    icon: TOKENS.cantoMainnet.SENTINAL.icon,
    chainId: "sentinelhub-2",
    nativeCurrency: {
      denom: "udvpn",
      decimals: 6,
    },
    channelFromCanto: "channel-16",
    channelToCanto: "channel-71",
    restEndpoint: "https://api-sentinel-ia.cosmosia.notional.ventures/",
    rpcEndpoint: "https://rpc-sentinel-ia.cosmosia.notional.ventures/",
    addressBeginning: "sent",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
    tokens: {
      toCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.SENTINAL],
      fromCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.SENTINAL],
    },
  },
  [MainnetIBCNetworks.EVMOS]: {
    name: "evmos",
    icon: TOKENS.cantoMainnet.EVMOS.icon,
    chainId: "evmos_9001-2",
    nativeCurrency: {
      denom: "aevmos",
      decimals: 18,
    },
    restEndpoint: "https://evmos.kingnodes.com",
    channelFromCanto: "channel-15",
    channelToCanto: "channel-62",
    rpcEndpoint: "https://evmos.kingnodes.com",
    addressBeginning: "evmos",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
    tokens: {
      toCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.EVMOS],
      fromCanto: [CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.EVMOS],
    },
  },
  [MainnetIBCNetworks.PERSISTENCE]: {
    name: "persistence",
    icon: TOKENS.cantoMainnet.PERSISTENCE.icon,
    chainId: "core-1",
    nativeCurrency: {
      denom: "uxprt",
      decimals: 6,
    },
    restEndpoint: "https://rest.core.persistence.one",
    channelFromCanto: "channel-17",
    channelToCanto: "channel-80",
    rpcEndpoint: "https://rpc.core.persistence.one",
    addressBeginning: "persistence",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
    tokens: {
      toCanto: [
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.PERSISTENCE,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.PSTAKEDATOM,
      ],
      fromCanto: [
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.PERSISTENCE,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.PSTAKEDATOM,
      ],
    },
  },
  [MainnetIBCNetworks.STRIDE]: {
    name: "stride",
    icon: TOKENS.cantoMainnet.STRIDE.icon,
    chainId: "stride-1",
    nativeCurrency: {
      denom: "ustrd",
      decimals: 6,
    },
    restEndpoint: "https://stride-api.polkachu.com/",
    rpcEndpoint: "https://stride-rpc.polkachu.com/",
    channelFromCanto: "channel-18",
    channelToCanto: "channel-74",
    latestBlockEndpoint: blockEndpoint,
    addressBeginning: "stride",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
    tokens: {
      toCanto: [
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.STRIDE,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.STEVMOS,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.STATOM,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.STJUNO,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.STOSMO,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.STSTARS,
      ],
      fromCanto: [
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.STRIDE,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.STEVMOS,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.STATOM,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.STJUNO,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.STOSMO,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.STSTARS,
      ],
    },
  },
  [MainnetIBCNetworks.QUICKSILVER]: {
    name: "quicksilver",
    icon: TOKENS.cantoMainnet.QUICKSILVER.icon,
    chainId: "quicksilver-2",
    nativeCurrency: {
      denom: "uqck",
      decimals: 6,
    },
    restEndpoint: "https://quicksilver-api.lavenderfive.com:443",
    rpcEndpoint: "https://rpc.quicksilver.zone:443",
    channelFromCanto: "channel-19",
    channelToCanto: "channel-24",
    latestBlockEndpoint: blockEndpoint,
    addressBeginning: "quick",
    checkAddress: function (address) {
      return addressCheck(address, this.addressBeginning);
    },
    tokens: {
      toCanto: [
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.QUICKSILVER,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.QATOM,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.QREGEN,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.QSTARS,
      ],
      fromCanto: [
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.QUICKSILVER,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.QATOM,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.QREGEN,
        CANTO_MAIN_IBC_TOKENS_WITH_DENOMS.QSTARS,
      ],
    },
  },
};
const TESTNET_IBC_NETWORKS = {};

export { MAINNET_IBC_NETWORKS, TESTNET_IBC_NETWORKS };
