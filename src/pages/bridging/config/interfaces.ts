import { BigNumber, ethers } from "ethers";
import emptyToken from "assets/empty.svg";
import { BridgeTransaction } from "../hooks/useBridgingTransactions";
import { ReactNode } from "react";
import { IBCPathInfo } from "../utils/nativeBalances";
import { Token } from "global/config/interfaces/tokens";
import { CantoNetwork, ETHNetwork } from "global/config/networks";
import { IBCTOKENS } from "./bridgingTokens";
import { BridgeOutNetworkData } from "./bridgeOutNetworks";

/**
 * FOR SELECTORS
 */
export interface BaseSelector {
  id: string;
  name: string;
  icon: string;
}
export interface SelectorProps {
  allOptions: BaseSelector[];
  selectedId: string | undefined;
  setSelectedId: (id: string) => void;
}

/**
 * NETWORK INTERFACES
 */

/**
 * When bridging in, there must be a sending network and a receiving network
 * Ex. ETH -> Canto
 * Ex. GravityTest -> CantoTest
 * Each will be in a pair, for correct contract calls to be made and correct tokens to display when on either network
 */
export interface BridgeNetworkPair {
  pairId: string;
  sending: {
    network: ETHNetwork;
    tokens: Token[];
  };
  receiving: {
    network: CantoNetwork;
    convertCoinTokens: NativeToken[];
    nativeCosmosTokens: NativeToken[];
    ibcTokens: IBCTOKENS;
    bridgeOutNetworks: BridgeOutNetworkData;
  };
}

/**
 * cantoChannel is the channel that you must use to ibc FROM canto
 * networkChannel is the channel that you must use from the respective chain TO canto
 */
export interface BridgeOutNetworkInfo {
  name: string;
  chainId: string;
  icon: string;
  tokens: NativeToken[];
  nativeDenom: string;
  cantoChannel: string;
  networkChannel: string;
  restEndpoint: string;
  rpcEndpoint: string;
  extraEndpoints?: string[];
  latestBlockEndpoint?: string;
  addressBeginning: string;
  checkAddress: (address?: string) => boolean;
}
export enum CantoMainBridgeOutNetworks {
  GRAVITY_BRIDGE = "Gravity Bridge",
  COSMOS_HUB = "Cosmos Hub",
  COMDEX = "Comdex",
  OSMOSIS = "Osmosis",
  SOMMELIER = "Sommelier",
  INJECTIVE = "Injective",
  KAVA = "Kava",
  AKASH = "Akash",
  CRESCENT = "Crescent",
  SENTINEL = "Sentinel",
  EVMOS = "Evmos",
  PERSISTENCE = "Persistence",
  STRIDE = "Stride",
  QUICKSILVER = "Quicksilver",
}

/**
 * TOKEN INTERFACES
 */

export interface Step1TokenGroups {
  groupName: string;
  tokens: BaseToken[] | undefined;
  getBalance: (token: BaseToken) => string;
}
export interface BaseToken extends Token {
  [x: string | number | symbol]: unknown;
}

export interface UserERC20BridgeToken extends BaseToken {
  erc20Balance: BigNumber;
  allowance: BigNumber;
}
export interface NativeToken extends BaseToken {
  ibcDenom: string;
  nativeName: string;
  supportedOutChannels: CantoMainBridgeOutNetworks[];
}
export interface UserNativeToken extends NativeToken {
  nativeBalance: BigNumber;
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
export const EMPTY_ERC20_BRIDGE_TOKEN: UserERC20BridgeToken = {
  ...EMPTY_TOKEN,
  erc20Balance: BigNumber.from(0),
  allowance: BigNumber.from(ethers.constants.MaxUint256),
};
export const EMPTY_NATIVE_TOKEN: UserNativeToken = {
  ...EMPTY_TOKEN,
  ibcDenom: "",
  nativeName: "",
  supportedOutChannels: [],
  nativeBalance: BigNumber.from(0),
};

/**
 * TRANSACTION INTERFACES
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
  defaultNetwork: BridgeOutNetworkInfo;
  token: UserNativeToken;
}

/**
 * MODAL INTERFACES
 */
export interface BridgeModal {
  amount: BigNumber;
  token: BaseToken;
  tx: BridgeTransaction;
  from: {
    chain: string;
    address: string;
    chainId: number;
  };
  to: {
    chain: string;
    address: string;
  };
  onClose: () => void;
  ibcTo?: BridgeOutNetworkInfo;
  extraDetails?: ReactNode;
}
