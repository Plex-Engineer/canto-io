import { formatUnits } from "ethers/lib/utils";
import { CONVERT_COIN_TOKENS } from "pages/bridging/config/bridgingTokens";
import {
  UserERC20BridgeToken,
  UserNativeToken,
} from "pages/bridging/config/interfaces";

interface TokenTableProps {
  name: string;
  main: string;
  gBridge: string;
  canto: string;
}
export function formatTokensAmountsbyChain(
  ethTokens: UserERC20BridgeToken[],
  cantoTokens: UserERC20BridgeToken[],
  nativeTokens: UserNativeToken[]
): TokenTableProps[] {
  return CONVERT_COIN_TOKENS.map((token) => {
    const ethToken = ethTokens.find((eTok) => eTok.name == token.name);
    const ethBalance = ethToken
      ? formatUnits(ethToken.erc20Balance, ethToken.decimals)
      : "0.0";
    const nativeToken = nativeTokens.find((cTok) => cTok.name == token.name);
    const bridgeBalance = nativeToken
      ? formatUnits(nativeToken.nativeBalance, nativeToken.decimals)
      : "0.0";
    const cantoToken = cantoTokens.find((cTok) => cTok.name == token.name);
    const evmBalance = cantoToken
      ? formatUnits(cantoToken.erc20Balance, cantoToken.decimals)
      : "0.0";
    return {
      name: token.name,
      main: ethBalance,
      gBridge: bridgeBalance,
      canto: evmBalance,
    };
  });
}
