import { NativeToken } from "../config/interfaces";
import {
  CONVERT_COIN_TOKENS,
  ETH_GRAVITY_BRIDGE_IN_TOKENS,
} from "../config/bridgingTokens";
import { Token, TOKENS } from "global/config/tokenInfo";
import { ALL_BRIDGE_OUT_NETWORKS } from "../config/bridgeOutNetworks";

export function findNativeToken(nativeName: string): NativeToken | undefined {
  return CONVERT_COIN_TOKENS.find(
    (token) => token.nativeName.toLowerCase() == nativeName.toLowerCase()
  );
}
export function getNetworkFromAddress(address: string): string {
  for (const [, value] of Object.entries(ALL_BRIDGE_OUT_NETWORKS)) {
    if (
      value.addressBeginning == address.slice(0, value.addressBeginning.length)
    )
      return value.name;
  }
  return "canto";
}
export function findBridgeInToken(tokenAddress: string): Token | undefined {
  if (tokenAddress === "uatom") {
    return TOKENS.cantoMainnet.ATOM;
  }
  return ETH_GRAVITY_BRIDGE_IN_TOKENS.find(
    (token) => token.address.toLowerCase() === tokenAddress.toLowerCase()
  );
}

export function getNetworkFromTokenName(ibcDenom: string): string {
  for (const [, value] of Object.entries(ALL_BRIDGE_OUT_NETWORKS)) {
    for (const token of value.tokens) {
      if (token.ibcDenom == ibcDenom) {
        return value.name;
      }
    }
  }
  return "cosmos";
}
