import { LayerZeroNetwork } from "../bridgingInterfaces";
import {
  CantoTestnet,
  FantomTestnet,
  MumbaiTestnet,
} from "global/config/networks";
import { CANTO_OFT } from "../tokens.ts/layerZero";
enum TestnetLZNetworks {
  CANTO_TEST = "CANTO_TEST",
  MUMBAI_TEST = "MUMBAI_TEST",
  FANTOM_TEST = "FANTOM_TEST",
}
type LZNetworkData = {
  [key in TestnetLZNetworks]: LayerZeroNetwork;
};

const LAYER_ZERO_TEST_NETWORKS: LZNetworkData = {
  [TestnetLZNetworks.CANTO_TEST]: {
    ...CantoTestnet,
    lzChainId: 10159,
    tokens: [CANTO_OFT("0x84fCD41C761a86C3A50E8c74Ee251f0Ce0c75dD5", true)],
  },
  [TestnetLZNetworks.MUMBAI_TEST]: {
    ...MumbaiTestnet,
    lzChainId: 10109,
    tokens: [CANTO_OFT("0x84fCD41C761a86C3A50E8c74Ee251f0Ce0c75dD5", false)],
  },
  [TestnetLZNetworks.FANTOM_TEST]: {
    ...FantomTestnet,
    lzChainId: 10112,
    tokens: [CANTO_OFT("0x84fCD41C761a86C3A50E8c74Ee251f0Ce0c75dD5", false)],
  },
};
const LAYER_ZERO_MAIN_NETWORKS = {};

export { LAYER_ZERO_TEST_NETWORKS, LAYER_ZERO_MAIN_NETWORKS };
