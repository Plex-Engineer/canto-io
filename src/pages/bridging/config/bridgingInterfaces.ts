import { Token } from "global/config/interfaces/tokens";
import { Network } from "global/config/networks";

export enum BridgingMethods {
  GBRIDGE = "Gravity Bridge",
  LAYER_ZERO = "Layer Zero",
  IBC = "IBC",
}
export interface BridgingNetwork {
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
  tokens: Token[];
}

export interface LayerZeroNetwork extends Network {
  lzChainId: number;
  tokens: LayerZeroToken[];
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
  tokens: NativeToken[];
}

export interface NativeToken extends Token {
  ibcDenom: string;
  nativeName: string;
}

export const EMPTYNETWORK: BridgingNetwork = {
  name: "",
  icon: "",
  isCanto: false,
  isEVM: false,
  supportedBridgeInMethods: [],
  supportedBridgeOutMethods: [],
};
