import { Token } from "global/config/interfaces/tokens";
import { Network } from "global/config/networks";
import emptyToken from "assets/empty.svg";
import { BigNumber, ethers } from "ethers";
import { IBCPathInfo } from "../utils/nativeBalances";

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

export const EMPTYNETWORK: BridgingNetwork = {
  id: "empty",
  name: "",
  icon: "",
  isCanto: false,
  isEVM: false,
  supportedBridgeInMethods: [],
  supportedBridgeOutMethods: [],
};
/**
 * TOKENS
 */

export interface NativeToken extends Token {
  ibcDenom: string;
  nativeName: string;
}
export interface UserNativeToken extends NativeToken {
  nativeBalance: BigNumber;
}
export interface UserERC20BridgeToken extends Token {
  erc20Balance: BigNumber;
  allowance: BigNumber;
}
export interface BasicNativeBalance {
  denom: string;
  amount: string;
}

export interface IBCTokenTrace extends BasicNativeBalance {
  ibcInfo: IBCPathInfo;
}

//Empty token data for initialization
const EMPTY_TOKEN: Token = {
  isERC20: false,
  isLP: false,
  symbol: "choose token",
  address: "0x0412C7c846bb6b7DC462CF6B453f76D8440b2609",
  decimals: 6,
  icon: emptyToken,
  name: "choose token",
  tokenGroups: [],
};
export const EMPTY_NATIVE_TOKEN: UserNativeToken = {
  ...EMPTY_TOKEN,
  ibcDenom: "",
  nativeName: "",
  nativeBalance: BigNumber.from(0),
};
export const EMPTY_ERC20_BRIDGE_TOKEN: UserERC20BridgeToken = {
  ...EMPTY_TOKEN,
  erc20Balance: BigNumber.from(0),
  allowance: BigNumber.from(ethers.constants.MaxUint256),
};

/**
 * Transactions
 */
export interface NativeTransaction {
  origin: string;
  timeLeft: string;
  amount: BigNumber;
  token: UserNativeToken;
}
export interface RecoveryTransaction {
  origin: string;
  symbol: string;
  amount: BigNumber;
  onRecovery?: () => void;
  channelPath: string[];
  defaultNetwork?: IBCNetwork;
  token: UserNativeToken;
}
