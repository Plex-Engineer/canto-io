import { formatUnits } from "ethers/lib/utils";
import { convertCoinTokens } from "pages/bridge/config/gravityBridgeTokens";
import {
  UserConvertToken,
  UserGravityBridgeTokens,
} from "pages/bridge/config/interfaces";

interface TokenTableProps {
  name: string;
  main: string;
  gBridge: string;
  canto: string;
}
export function formatTokensAmountsbyChain(
  ethTokens: UserGravityBridgeTokens[],
  convertTokens: UserConvertToken[]
): TokenTableProps[] {
  return convertCoinTokens.map((token) => {
    const ethToken = ethTokens.find((eTok) => eTok.name == token.name);
    const ethBalance = ethToken
      ? formatUnits(ethToken.balanceOf, ethToken.decimals)
      : "0";
    const convertToken = convertTokens.find((cTok) => cTok.name == token.name);
    const bridgeBalance = convertToken
      ? formatUnits(convertToken.nativeBalance, convertToken.decimals)
      : "0";
    const evmBalance = convertToken
      ? formatUnits(convertToken.erc20Balance, convertToken.decimals)
      : "0";
    return {
      name: token.name,
      main: ethBalance,
      gBridge: bridgeBalance,
      canto: evmBalance,
    };
  });
}
