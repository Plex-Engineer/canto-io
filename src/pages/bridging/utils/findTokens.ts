import { NativeToken } from "../config/interfaces";
import {
  ALL_IBC_TOKENS_WITH_DENOMS,
  CONVERT_COIN_TOKENS,
  ETH_GRAVITY_BRIDGE_IN_TOKENS,
} from "../config/bridgingTokens";
import { TOKENS } from "global/config/tokenInfo";
import {
  ALL_BRIDGE_OUT_NETWORKS,
  EMPTY_IBC_NETWORK,
} from "../config/bridgeOutNetworks";
import { Token } from "global/config/interfaces/tokens";

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

export function getNetworkFromTokenName(
  ibcDenom: string,
  bridgeIn: boolean
): string {
  const ibcEthList = [
    ALL_IBC_TOKENS_WITH_DENOMS.USDC.ibcDenom,
    ALL_IBC_TOKENS_WITH_DENOMS.USDT.ibcDenom,
    ALL_IBC_TOKENS_WITH_DENOMS.ETH.ibcDenom,
    ALL_IBC_TOKENS_WITH_DENOMS.WSTETH.ibcDenom,
  ];
  if (ibcEthList.includes(ibcDenom) && bridgeIn) return "ETH";

  for (const [, value] of Object.entries(ALL_BRIDGE_OUT_NETWORKS)) {
    for (const token of value.tokens) {
      if (token.ibcDenom == ibcDenom) {
        return value.name;
      }
    }
  }
  return "cosmos";
}
export function getNetworkFromCantoChannel(channel: string) {
  for (const [, value] of Object.entries(ALL_BRIDGE_OUT_NETWORKS)) {
    if (value.cantoChannel === channel) return value;
  }
  return EMPTY_IBC_NETWORK;
}
