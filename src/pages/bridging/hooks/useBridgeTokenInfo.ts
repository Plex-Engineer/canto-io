import { ADDRESSES } from "global/config/addresses";
import { CantoMainnet, ETHMainnet } from "global/config/networks";
import { useNetworkInfo } from "global/stores/networkInfo";
import { useEffect, useState } from "react";
import {
  CONVERT_COIN_TOKENS,
  ETH_GRAVITY_BRIDGE_IN_TOKENS,
} from "../config/bridgingTokens";
import { UserERC20BridgeToken, UserNativeToken } from "../config/interfaces";
import {
  SelectedTokens,
  TokenStore,
  useBridgeTokenStore,
} from "../stores/bridgeTokenStore";
import { getNativeCantoBalances } from "../utils/nativeBalances";
import { useTokenBalances } from "./tokenBalances/useTokenBalances";

interface BridgeTokenInfo {
  userBridgeInTokens: UserERC20BridgeToken[];
  userBridgeOutTokens: UserERC20BridgeToken[];
  userNativeTokens: UserNativeToken[];
  selectedTokens: TokenStore["selectedTokens"];
  setSelectedToken: (
    selectedToken: UserERC20BridgeToken,
    type: SelectedTokens
  ) => void;
}

export function useBridgeTokenInfo(): BridgeTokenInfo {
  const networkInfo = useNetworkInfo();
  const tokenStore = useBridgeTokenStore();

  //bridge in erc20 tokens on ETH mainnet
  const { tokens: userEthBridgeInTokens, fail: ethERC20Fail } =
    useTokenBalances(
      networkInfo.account,
      ETH_GRAVITY_BRIDGE_IN_TOKENS,
      ETHMainnet.chainId,
      ADDRESSES.ETHMainnet.GravityBridge
    );
  //bridge out erc20 tokens on Canto Mainnet
  const { tokens: userCantoBridgeOutTokens, fail: cantoERC20Fail } =
    useTokenBalances(
      networkInfo.account,
      CONVERT_COIN_TOKENS,
      CantoMainnet.chainId,
      undefined
    );
  const [userNativeTokens, setUserNativeTokens] = useState<UserNativeToken[]>(
    []
  );
  async function getAllNativeTokens() {
    setUserNativeTokens(
      await getNativeCantoBalances(
        CantoMainnet.cosmosAPIEndpoint,
        networkInfo.cantoAddress,
        CONVERT_COIN_TOKENS
      )
    );
  }

  //reset all selected tokens to match new updates
  function resetAllSelectedTokens() {
    if (
      networkInfo.account &&
      networkInfo.cantoAddress &&
      !cantoERC20Fail &&
      !ethERC20Fail
    ) {
      //reselecting the tokens so it is the most updated version
      tokenStore.resetSelectedToken(
        SelectedTokens.ETHTOKEN,
        userEthBridgeInTokens
      );
      tokenStore.resetSelectedToken(
        SelectedTokens.CONVERTOUT,
        userCantoBridgeOutTokens
      );
    }
  }

  useEffect(() => {
    if (
      !(
        userEthBridgeInTokens
          .find(
            (token) =>
              tokenStore.selectedTokens[SelectedTokens.ETHTOKEN].address ==
              token.address
          )
          ?.erc20Balance.eq(
            tokenStore.selectedTokens[SelectedTokens.ETHTOKEN].erc20Balance
          ) &&
        userCantoBridgeOutTokens
          .find(
            (token) =>
              tokenStore.selectedTokens[SelectedTokens.CONVERTOUT].address ==
              token.address
          )
          ?.erc20Balance.eq(
            tokenStore.selectedTokens[SelectedTokens.CONVERTOUT].erc20Balance
          )
      )
    ) {
      resetAllSelectedTokens();
    }
  }, [userEthBridgeInTokens, userCantoBridgeOutTokens]);

  //initialize data on sign in
  useEffect(() => {
    getAllNativeTokens();
  }, [networkInfo.account, networkInfo.cantoAddress]);

  //call data per block
  useEffect(() => {
    const interval = setInterval(async () => {
      await getAllNativeTokens();
    }, 6000);
    return () => clearInterval(interval);
  }, [networkInfo.cantoAddress]);

  return {
    userBridgeInTokens: userEthBridgeInTokens,
    userBridgeOutTokens: userCantoBridgeOutTokens,
    userNativeTokens: userNativeTokens,
    selectedTokens: tokenStore.selectedTokens,
    setSelectedToken: tokenStore.setSelectedToken,
  };
}
