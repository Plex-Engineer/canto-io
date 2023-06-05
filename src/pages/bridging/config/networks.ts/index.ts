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

const ibcMainNetworks = () =>
  Object.entries(MAINNET_IBC_NETWORKS).map(([, val]) => ({
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
  {
    name: CantoMainnet.name,
    icon: CantoMainnet.icon,
    isCanto: true,
    isEVM: true,
    supportedBridgeInMethods: [
      //   BridgingMethods.LAYER_ZERO,
      BridgingMethods.GBRIDGE,
      BridgingMethods.IBC,
    ],
    supportedBridgeOutMethods: [
      //   BridgingMethods.LAYER_ZERO,
      BridgingMethods.IBC,
    ],
  },
  //gbridge
  {
    name: ETHMainnet.name,
    icon: ETHMainnet.icon,
    isCanto: false,
    isEVM: true,
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
  {
    name: CantoTestnet.name,
    icon: CantoTestnet.icon,
    isCanto: true,
    isEVM: true,
    supportedBridgeInMethods: [BridgingMethods.LAYER_ZERO],
    supportedBridgeOutMethods: [BridgingMethods.LAYER_ZERO],
    [BridgingMethods.LAYER_ZERO]: LAYER_ZERO_TEST_NETWORKS.CANTO_TEST,
  },
  //LZ
  {
    name: MumbaiTestnet.name,
    icon: MumbaiTestnet.icon,
    isCanto: false,
    isEVM: true,
    supportedBridgeInMethods: [BridgingMethods.LAYER_ZERO],
    supportedBridgeOutMethods: [BridgingMethods.LAYER_ZERO],
    [BridgingMethods.LAYER_ZERO]: LAYER_ZERO_TEST_NETWORKS.MUMBAI_TEST,
  },
  {
    name: FantomTestnet.name,
    icon: FantomTestnet.icon,
    isCanto: false,
    isEVM: true,
    supportedBridgeInMethods: [BridgingMethods.LAYER_ZERO],
    supportedBridgeOutMethods: [BridgingMethods.LAYER_ZERO],
    [BridgingMethods.LAYER_ZERO]: LAYER_ZERO_TEST_NETWORKS.FANTOM_TEST,
  },
];

export { getBridgingNetworksFromChainId };
