import { LayerZeroNetwork } from "../bridgingInterfaces";
import {
  CantoTestnet,
  FantomTestnet,
  MumbaiTestnet,
  GoerliTestnet,
  AvalancheTestnet,
} from "global/config/networks";
import { CANTO_OFT } from "../tokens.ts/layerZeroTokens";
enum TestnetLZNetworks {
  CANTO_TEST = "CANTO_TEST",
  MUMBAI_TEST = "MUMBAI_TEST",
  FANTOM_TEST = "FANTOM_TEST",
  GOERLI_TEST = "GOERLI_TEST",
  AVALANCHE_TEST = "AVALANCHE_TEST",
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
      toCanto: [CANTO_OFT("0x6175a322E284E6a5ff5f8BcdBE82d30B047E22d4", false)],
      fromCanto: [
        CANTO_OFT("0x6175a322E284E6a5ff5f8BcdBE82d30B047E22d4", true),
      ],
    },
  },
  [TestnetLZNetworks.FANTOM_TEST]: {
    ...FantomTestnet,
    lzChainId: 10112,
    tokens: {
      toCanto: [CANTO_OFT("0x6175a322E284E6a5ff5f8BcdBE82d30B047E22d4", false)],
      fromCanto: [
        CANTO_OFT("0x6175a322E284E6a5ff5f8BcdBE82d30B047E22d4", true),
      ],
    },
  },
  [TestnetLZNetworks.GOERLI_TEST]: {
    ...GoerliTestnet,
    lzChainId: 10121,
    tokens: {
      toCanto: [CANTO_OFT("0xd310F11Fb1bdd95568a5dB507a891946ec23642D", false)],
      fromCanto: [
        CANTO_OFT("0x6175a322E284E6a5ff5f8BcdBE82d30B047E22d4", true),
      ],
    },
  },
  [TestnetLZNetworks.AVALANCHE_TEST]: {
    ...AvalancheTestnet,
    lzChainId: 10106,
    tokens: {
      toCanto: [CANTO_OFT("0x6175a322E284E6a5ff5f8BcdBE82d30B047E22d4", false)],
      fromCanto: [
        CANTO_OFT("0x6175a322E284E6a5ff5f8BcdBE82d30B047E22d4", true),
      ],
    },
  },
};
const LAYER_ZERO_MAIN_NETWORKS = {};

export { LAYER_ZERO_TEST_NETWORKS, LAYER_ZERO_MAIN_NETWORKS };
