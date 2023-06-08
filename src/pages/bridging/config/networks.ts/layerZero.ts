import { LayerZeroNetwork } from "../bridgingInterfaces";
import {
  CantoTestnet,
  FantomTestnet,
  MumbaiTestnet,
} from "global/config/networks";
import { CANTO_OFT } from "../tokens.ts/layerZeroTokens";
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
    tokens: {
      toCanto: [],
      fromCanto: [],
    },
  },
  [TestnetLZNetworks.MUMBAI_TEST]: {
    ...MumbaiTestnet,
    lzChainId: 10109,
    tokens: {
      toCanto: [CANTO_OFT("0x56c3bcaDD2e4f80025Ab9a018e5be26F6fC33e76", false)],
      fromCanto: [
        CANTO_OFT("0x56c3bcaDD2e4f80025Ab9a018e5be26F6fC33e76", true),
      ],
    },
  },
  [TestnetLZNetworks.FANTOM_TEST]: {
    ...FantomTestnet,
    lzChainId: 10112,
    tokens: {
      toCanto: [CANTO_OFT("0x56c3bcaDD2e4f80025Ab9a018e5be26F6fC33e76", false)],
      fromCanto: [
        CANTO_OFT("0x56c3bcaDD2e4f80025Ab9a018e5be26F6fC33e76", true),
      ],
    },
  },
};
const LAYER_ZERO_MAIN_NETWORKS = {};

export { LAYER_ZERO_TEST_NETWORKS, LAYER_ZERO_MAIN_NETWORKS };
