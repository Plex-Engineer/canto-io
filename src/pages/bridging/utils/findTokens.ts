import { NativeToken } from "../config/interfaces";
import { TOKENS } from "global/config/tokenInfo";
import { Token } from "global/config/interfaces/tokens";
import { MAINNET_IBC_NETWORKS } from "../config/networks.ts/cosmos";
import {
  CANTO_MAIN_CONVERT_COIN_TOKENS,
  ETH_GRAVITY_BRIDGE_IN_TOKENS,
} from "../config/tokens.ts/bridgingTokens";

export function findNativeToken(
  nativeName: string,
  chainId?: number
): NativeToken | undefined {
  return CANTO_MAIN_CONVERT_COIN_TOKENS.find(
    (token) => token.nativeName.toLowerCase() == nativeName.toLowerCase()
  );
}
export function getNetworkFromAddress(
  address: string,
  chainId?: number
): string {
  for (const [, value] of Object.entries(MAINNET_IBC_NETWORKS)) {
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
  return ETH_GRAVITY_BRIDGE_IN_TOKENS.find(
    (token) => token.address.toLowerCase() === tokenAddress.toLowerCase()
  );
}

export function getNetworkFromTokenName(
  ibcDenom: string,
  bridgeIn: boolean,
  chainId?: number
): string {
  for (const [key, value] of Object.entries(MAINNET_IBC_NETWORKS)) {
    for (const token of value.tokens.toCanto) {
      if (token.ibcDenom == ibcDenom) {
        return key === "Gravity_Bridge" && bridgeIn ? "ETH" : value.name;
      }
    }
  }
  return "cosmos";
}
export function getNetworkFromCantoChannel(channel: string) {
  for (const [, value] of Object.entries(MAINNET_IBC_NETWORKS)) {
    if (value.channelFromCanto === channel) return value;
  }
  return undefined;
}
