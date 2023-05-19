import { CantoMainBridgeOutNetworks, NativeToken } from "../config/interfaces";
import { TOKENS } from "global/config/tokenInfo";
import { EMPTY_IBC_NETWORK } from "../config/bridgeOutNetworks";
import { Token } from "global/config/interfaces/tokens";
import { getNetworkPair } from "../config/networkPairs";

export function findNativeToken(
  nativeName: string,
  chainId?: number
): NativeToken | undefined {
  return getNetworkPair(chainId).receiving.convertCoinTokens.find(
    (token) => token.nativeName.toLowerCase() == nativeName.toLowerCase()
  );
}
export function getNetworkFromAddress(
  address: string,
  chainId?: number
): string {
  for (const [, value] of Object.entries(
    getNetworkPair(chainId).receiving.bridgeOutNetworks
  )) {
    if (
      value.addressBeginning == address.slice(0, value.addressBeginning.length)
    )
      return value.name;
  }
  return "canto";
}
export function findBridgeInToken(
  tokenAddress: string,
  chainId?: number
): Token | undefined {
  if (tokenAddress === "uatom") {
    return TOKENS.cantoMainnet.ATOM;
  }
  return getNetworkPair(chainId).sending.tokens.find(
    (token) => token.address.toLowerCase() === tokenAddress.toLowerCase()
  );
}

export function getNetworkFromTokenName(
  ibcDenom: string,
  bridgeIn: boolean,
  chainId?: number
): string {
  for (const [, value] of Object.entries(
    getNetworkPair(chainId).receiving.bridgeOutNetworks
  )) {
    for (const token of value.tokens) {
      if (token.ibcDenom == ibcDenom) {
        return token.supportedOutChannels.includes(
          CantoMainBridgeOutNetworks.GRAVITY_BRIDGE
        ) && bridgeIn
          ? "ETH"
          : value.name;
      }
    }
  }
  return "cosmos";
}
export function getNetworkFromCantoChannel(channel: string, chainId?: number) {
  for (const [, value] of Object.entries(
    getNetworkPair(chainId).receiving.bridgeOutNetworks
  )) {
    if (value.cantoChannel === channel) return value;
  }
  return EMPTY_IBC_NETWORK;
}
