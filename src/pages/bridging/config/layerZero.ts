import cantoIcon from "assets/icons/canto-evm.svg";

export function getLZNetworksFromChainId(chainId?: number) {
  if (
    LAYER_ZERO_TEST_NETWORKS.filter((network) => network.evmChainId === chainId)
      .length > 0
  ) {
    return LAYER_ZERO_TEST_NETWORKS;
  }
  return LAYER_ZERO_MAIN_NETWORKS;
}

export interface LayerZeroNetwork {
  id: string;
  name: string;
  icon: string;
  evmChainId: number;
  lzChainId: number;
}

const LAYER_ZERO_TEST_NETWORKS: LayerZeroNetwork[] = [
  {
    id: "canto-testnet",
    name: "Canto Testnet",
    icon: cantoIcon,
    evmChainId: 7701,
    lzChainId: 10159,
  },
  {
    id: "mumbai-testnet",
    name: "Mumbai Testnet",
    icon: cantoIcon,
    evmChainId: 80001,
    lzChainId: 10109,
  },
  {
    id: "fantom-testnet",
    name: "Fantom Testnet",
    icon: cantoIcon,
    evmChainId: 4002,
    lzChainId: 10112,
  },
];
const LAYER_ZERO_MAIN_NETWORKS: LayerZeroNetwork[] = [];
