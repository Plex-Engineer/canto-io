import { Chain } from "@usedapp/core";
import { Token } from "global/config/interfaces/tokens";

interface BridgingNetwork {
  name: string;
  icon: string;
  isCanto: boolean; //will be used to determine token lists, and bridge in or out
  isGravityBridge: boolean;
  gravityBridge?: GravityBridgeNetwork; //will only be here if isGravityBridge is true
  isLayerZero: boolean;
  layerZero?: LayerZeroNetwork; //will only be here if isLayerZero is true
  isIBC: boolean;
  ibc?: IBCNetwork; //will only be here if isIBC is true
}

interface GravityBridgeNetwork extends BridgingNetwork, Chain {
  gravityBridgeAddress: string;
  wethAddress: string;
  tokens: Token[];
}

interface LayerZeroNetwork extends BridgingNetwork, Chain {
  lzChainId: number;
  oftTokens: Token[];
}

interface IBCNetwork extends BridgingNetwork {
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

interface NativeToken extends Token {
  ibcDenom: string;
  nativeName: string;
}
