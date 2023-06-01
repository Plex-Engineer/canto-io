import { BaseSelector } from "../config/interfaces";
import { getLZNetworksFromChainId } from "../config/layerZero";
import { BridgeOutMethods } from "./bridgeOutStore";
import { ZERO_ADDRESS } from "global/config/interfaces/tokens";
import bridgeIcon from "assets/icons/canto-bridge.svg";

function isTokenCanto(tokenAddress: string) {
  return tokenAddress === ZERO_ADDRESS;
}
export function getBridgeOutNetworksFromMethod(
  method: string,
  chainId?: number
): BaseSelector[] {
  switch (method) {
    case BridgeOutMethods.IBC:
      return [
        {
          id: "canto-bridge",
          name: "Canto Bridge",
          icon: bridgeIcon,
        },
      ];
    case BridgeOutMethods.LAYER_ZERO:
      return getLZNetworksFromChainId(chainId);
    default:
      return [];
  }
}

export function getBridgeOutMethodFromToken(
  tokenAddress: string
): BridgeOutMethods {
  return isTokenCanto(tokenAddress)
    ? BridgeOutMethods.LAYER_ZERO
    : BridgeOutMethods.IBC;
}
