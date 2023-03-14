import { formatUnits } from "ethers/lib/utils";
import { CONVERT_COIN_TOKENS } from "pages/bridging/config/bridgingTokens";
import {
  UserBridgeInToken,
  UserConvertToken,
} from "pages/bridging/config/interfaces";

interface TokenTableProps {
  name: string;
  main: string;
  gBridge: string;
  canto: string;
}
export function formatTokensAmountsbyChain(
  ethTokens: UserBridgeInToken[],
  convertTokens: UserConvertToken[]
): TokenTableProps[] {
  return CONVERT_COIN_TOKENS.map((token) => {
    const ethToken = ethTokens.find((eTok) => eTok.name == token.name);
    const ethBalance = ethToken
      ? formatUnits(ethToken.erc20Balance, ethToken.decimals)
      : "0.0";
    const convertToken = convertTokens.find((cTok) => cTok.name == token.name);
    const bridgeBalance = convertToken
      ? formatUnits(convertToken.nativeBalance, convertToken.decimals)
      : "0.0";
    const evmBalance = convertToken
      ? formatUnits(convertToken.erc20Balance, convertToken.decimals)
      : "0.0";
    return {
      name: token.name,
      main: ethBalance,
      gBridge: bridgeBalance,
      canto: evmBalance,
    };
  });
}
