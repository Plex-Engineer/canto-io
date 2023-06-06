import {
  CantoMainnet,
  CantoTestnet,
  ETHMainnet,
  FantomTestnet,
  MumbaiTestnet,
  onTestnet,
} from "global/config/networks";
import { BridgingMethods, BridgingNetwork } from "../bridgingInterfaces";
import { GBRIDGE_MAIN_NETWORKS } from "./gBridge";
import { LAYER_ZERO_TEST_NETWORKS } from "./layerZero";
import { MAINNET_IBC_NETWORKS } from "./cosmos";

function getBridgingNetworksFromChainId(chainId?: number) {
  return onTestnet(chainId) ? TESTNET_BRIDGE_NETWORKS : MAINNET_BRIDGE_NETWORKS;
}
const CANTO_MAIN_BRIDGE_NETWORK: BridgingNetwork = {
  id: "canto-main",
  name: CantoMainnet.name,
  icon: CantoMainnet.icon,
  isCanto: true,
  isEVM: true,
  evmChainId: CantoMainnet.chainId,
  supportedBridgeInMethods: [],
  supportedBridgeOutMethods: [],
};
const CANTO_TEST_BRIDGE_NETWORK: BridgingNetwork = {
  id: "canto-test",
  name: CantoTestnet.name,
  icon: CantoTestnet.icon,
  isCanto: true,
  isEVM: true,
  evmChainId: CantoTestnet.chainId,
  supportedBridgeInMethods: [],
  supportedBridgeOutMethods: [],
  [BridgingMethods.LAYER_ZERO]: LAYER_ZERO_TEST_NETWORKS.CANTO_TEST,
};

const ibcMainNetworks = () =>
  Object.entries(MAINNET_IBC_NETWORKS).map(([, val]) => ({
    id: val.name,
    name: val.name,
    icon: val.icon,
    isCanto: false,
    isEVM: false,
    supportedBridgeInMethods: [BridgingMethods.IBC],
    supportedBridgeOutMethods: [BridgingMethods.IBC],
    [BridgingMethods.IBC]: val,
  }));

const MAINNET_BRIDGE_NETWORKS: BridgingNetwork[] = [
  //CANTO
  CANTO_MAIN_BRIDGE_NETWORK,
  //gbridge
  {
    id: ETHMainnet.name,
    name: ETHMainnet.name,
    icon: ETHMainnet.icon,
    isCanto: false,
    isEVM: true,
    evmChainId: ETHMainnet.chainId,
    supportedBridgeInMethods: [
      // BridgingMethods.LAYER_ZERO
    ],
    supportedBridgeOutMethods: [
      //   BridgingMethods.LAYER_ZERO,
      BridgingMethods.GBRIDGE,
    ],
    [BridgingMethods.GBRIDGE]: GBRIDGE_MAIN_NETWORKS.ETH,
  },
  //IBC
  ...ibcMainNetworks(),
];
const TESTNET_BRIDGE_NETWORKS: BridgingNetwork[] = [
  //CANTO
  CANTO_TEST_BRIDGE_NETWORK,
  //LZ
  {
    id: MumbaiTestnet.name,
    name: MumbaiTestnet.name,
    icon: MumbaiTestnet.icon,
    isCanto: false,
    isEVM: true,
    evmChainId: MumbaiTestnet.chainId,
    supportedBridgeInMethods: [BridgingMethods.LAYER_ZERO],
    supportedBridgeOutMethods: [BridgingMethods.LAYER_ZERO],
    [BridgingMethods.LAYER_ZERO]: LAYER_ZERO_TEST_NETWORKS.MUMBAI_TEST,
  },
  {
    id: FantomTestnet.name,
    name: FantomTestnet.name,
    icon: FantomTestnet.icon,
    isCanto: false,
    isEVM: true,
    evmChainId: FantomTestnet.chainId,
    supportedBridgeInMethods: [BridgingMethods.LAYER_ZERO],
    supportedBridgeOutMethods: [BridgingMethods.LAYER_ZERO],
    [BridgingMethods.LAYER_ZERO]: LAYER_ZERO_TEST_NETWORKS.FANTOM_TEST,
  },
];

export {
  getBridgingNetworksFromChainId,
  CANTO_MAIN_BRIDGE_NETWORK,
  CANTO_TEST_BRIDGE_NETWORK,
};
