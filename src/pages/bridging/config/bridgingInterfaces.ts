import { Token } from "global/config/interfaces/tokens";
import { Network } from "global/config/networks";

export enum BridgingMethods {
  GBRIDGE = "Gravity Bridge",
  LAYER_ZERO = "Layer Zero",
  IBC = "IBC",
}
export interface BridgingNetwork {
  id: string;
  name: string;
  icon: string;
  isCanto: boolean; //will be used to determine token lists, and bridge in or out
  isEVM: boolean; //determines how to perform transactions
  evmChainId?: number; //if isEVM, this is the chain id
  supportedBridgeInMethods: BridgingMethods[]; //from canto
  supportedBridgeOutMethods: BridgingMethods[]; //to canto
  //networks will only be here if supported by either bridge in or bridge out
  [BridgingMethods.GBRIDGE]?: GravityBridgeNetwork;
  [BridgingMethods.LAYER_ZERO]?: LayerZeroNetwork;
  [BridgingMethods.IBC]?: IBCNetwork;
}

export interface GravityBridgeNetwork extends Network {
  gravityBridgeAddress: string;
  wethAddress: string;
  tokens: {
    toCanto: Token[]; //tokens on network to bridge into canto
    fromCanto: Token[]; //tokens on canto to bridge into network
  };
}

export interface LayerZeroNetwork extends Network {
  lzChainId: number;
  tokens: {
    toCanto: LayerZeroToken[]; //tokens on network to bridge into canto
    fromCanto: LayerZeroToken[]; //tokens on canto to bridge into network
  };
}

export interface LayerZeroToken extends Token {
  isNative: boolean;
}

export interface IBCNetwork {
  evmChainId?: number;
  name: string;
  icon: string;
  chainId: string;
  nativeCurrency: {
    denom: string;
    decimals: number;
  };
  channelFromCanto: string;
  channelToCanto: string;
  restEndpoint: string;
  rpcEndpoint: string;
  extraEndpoints?: string[];
  latestBlockEndpoint?: string;
  addressBeginning: string;
  checkAddress: (address?: string) => boolean;
  tokens: {
    toCanto: NativeToken[]; //tokens on network to bridge into canto
    fromCanto: NativeToken[]; //tokens on canto to bridge into network
  };
}

export interface NativeToken extends Token {
  ibcDenom: string;
  nativeName: string;
}

export const EMPTYNETWORK: BridgingNetwork = {
  id: "empty",
  name: "",
  icon: "",
  isCanto: false,
  isEVM: false,
  supportedBridgeInMethods: [],
  supportedBridgeOutMethods: [],
};
