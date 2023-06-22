import { LayerZeroNetwork } from "../bridgingInterfaces";
import {
  CantoTestnet,
  FantomTestnet,
  MumbaiTestnet,
  GoerliTestnet,
  AvalancheTestnet,
  OptimismTestnet,
  CantoMainnet,
  ETHMainnet,
} from "global/config/networks";
import { CANTO_OFT } from "../tokens.ts/layerZeroTokens";
enum TestnetLZNetworks {
  CANTO_TEST = "CANTO_TEST",
  MUMBAI_TEST = "MUMBAI_TEST",
  FANTOM_TEST = "FANTOM_TEST",
  GOERLI_TEST = "GOERLI_TEST",
  AVALANCHE_TEST = "AVALANCHE_TEST",
  OPTIMISM_TEST = "OPTIMISM_TEST",
}
type LZTestNetworkData = {
  [key in TestnetLZNetworks]: LayerZeroNetwork;
};

const LAYER_ZERO_TEST_NETWORKS: LZTestNetworkData = {
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
  [TestnetLZNetworks.OPTIMISM_TEST]: {
    ...OptimismTestnet,
    lzChainId: 10132,
    tokens: {
      toCanto: [CANTO_OFT("0x6175a322E284E6a5ff5f8BcdBE82d30B047E22d4", false)],
      fromCanto: [
        CANTO_OFT("0x6175a322E284E6a5ff5f8BcdBE82d30B047E22d4", true),
      ],
    },
  },
};
enum MainnetLZNetworks {
  CANTO_MAIN = "CANTO_MAIN",
  ETH_MAIN = "ETH_MAIN",
}
type LZMainNetworkData = {
  [key in MainnetLZNetworks]: LayerZeroNetwork;
};
const LAYER_ZERO_MAIN_NETWORKS: LZMainNetworkData = {
  [MainnetLZNetworks.CANTO_MAIN]: {
    ...CantoMainnet,
    lzChainId: 159,
    tokens: {
      toCanto: [],
      fromCanto: [],
    },
  },
  [MainnetLZNetworks.ETH_MAIN]: {
    ...ETHMainnet,
    lzChainId: 101,
    tokens: {
      toCanto: [CANTO_OFT("0x56C03B8C4FA80Ba37F5A7b60CAAAEF749bB5b220", false)],
      fromCanto: [
        CANTO_OFT("0x56C03B8C4FA80Ba37F5A7b60CAAAEF749bB5b220", true),
      ],
    },
  },
};

export { LAYER_ZERO_TEST_NETWORKS, LAYER_ZERO_MAIN_NETWORKS };
