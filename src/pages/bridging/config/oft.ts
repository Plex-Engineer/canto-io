import {
  CantoTestnet,
  FantomTestnet,
  MumbaiTestnet,
  Network,
} from "global/config/networks";

export function getLZNetworksFromChainId(chainId?: number) {
  if (
    LAYER_ZERO_TEST_NETWORKS.filter((network) => network.chainId === chainId)
      .length > 0
  ) {
    return LAYER_ZERO_TEST_NETWORKS;
  }
  return LAYER_ZERO_MAIN_NETWORKS;
}

export interface LayerZeroNetwork extends Network {
  lzChainId: number;
  oftAddress: string;
}

const LAYER_ZERO_TEST_NETWORKS: LayerZeroNetwork[] = [
  {
    ...CantoTestnet,
    lzChainId: 10159,
    oftAddress: "0x84fCD41C761a86C3A50E8c74Ee251f0Ce0c75dD5",
  },
  {
    ...MumbaiTestnet,
    lzChainId: 10109,
    oftAddress: "0x84fCD41C761a86C3A50E8c74Ee251f0Ce0c75dD5",
  },
  {
    ...FantomTestnet,
    lzChainId: 10112,
    oftAddress: "0x84fCD41C761a86C3A50E8c74Ee251f0Ce0c75dD5",
  },
];
const LAYER_ZERO_MAIN_NETWORKS: LayerZeroNetwork[] = [];
