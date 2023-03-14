import { BigNumber } from "ethers";
import { ADDRESSES } from "global/config/addresses";
import { CantoMainnet, ETHMainnet } from "global/config/networks";
import { useNetworkInfo } from "global/stores/networkInfo";
import { useEffect, useState } from "react";
import { ALL_BRIDGE_OUT_NETWORKS } from "../config/bridgeOutNetworks";
import {
  CONVERT_COIN_TOKENS,
  ETH_GRAVITY_BRIDGE_IN_TOKENS,
} from "../config/bridgingTokens";
import {
  BaseToken,
  UserBridgeInToken,
  UserConvertToken,
  UserNativeToken,
} from "../config/interfaces";
import {
  SelectedTokens,
  TokenStore,
  useBridgeTokenStore,
} from "../stores/bridgeTokenStore";
import { getNativeCantoBalances } from "../utils/nativeBalances";
import { useTokenBalances } from "./tokenBalances/useTokenBalances";

interface BridgeTokenInfo {
  userBridgeInTokens: UserBridgeInToken[];
  userConvertTokens: UserConvertToken[];
  userBridgeOutTokens: UserNativeToken[];
  selectedTokens: TokenStore["selectedTokens"];
  setSelectedToken: (selectedToken: BaseToken, type: SelectedTokens) => void;
}

export function useBridgeTokenInfo(): BridgeTokenInfo {
  const networkInfo = useNetworkInfo();
  const tokenStore = useBridgeTokenStore();

  //bridge in tokens
  const { tokens: userBridgeInTokens, fail: ethFail } = useTokenBalances(
    networkInfo.account,
    ETH_GRAVITY_BRIDGE_IN_TOKENS,
    ETHMainnet.chainId,
    ADDRESSES.ETHMainnet.GravityBridge
  );
  //get erc20 balance of convert tokens
  const { tokens: userConvertERC20Tokens, fail: nativeERC20Fail } =
    useTokenBalances(
      networkInfo.account,
      CONVERT_COIN_TOKENS,
      CantoMainnet.chainId,
      undefined
    );
  const [userConvertTokens, setUserConvertTokens] = useState<
    UserConvertToken[]
  >([]);

  //match up the native tokens with the erc20 tokens for convert coin tokens
  async function matchNativeTokensWithConvertCoins() {
    if (!nativeERC20Fail) {
      const userNativeTokens = await getNativeCantoBalances(
        CantoMainnet.cosmosAPIEndpoint,
        networkInfo.cantoAddress,
        CONVERT_COIN_TOKENS
      );
      setUserConvertTokens(
        userNativeTokens.map((token) => {
          const matchedERC20Token = userConvertERC20Tokens.find(
            (erc20token) => erc20token.address === token.address
          );
          return {
            ...token,
            erc20Balance: matchedERC20Token?.erc20Balance ?? BigNumber.from(0),
          };
        })
      );
    }
  }
  //bridge out tokens
  const [userBridgeOutTokens, setUserBridgeOutTokens] = useState<
    UserNativeToken[]
  >([]);
  async function getBridgeOutTokens() {
    setUserBridgeOutTokens(
      await getNativeCantoBalances(
        CantoMainnet.cosmosAPIEndpoint,
        networkInfo.cantoAddress,
        ALL_BRIDGE_OUT_NETWORKS[tokenStore.bridgeOutNetwork].tokens
      )
    );
  }

  //reset all selected tokens to match new updates
  function resetAllSelectedTokens() {
    if (
      networkInfo.account &&
      networkInfo.cantoAddress &&
      !nativeERC20Fail &&
      !ethFail
    ) {
      //reselecting the tokens so it is the most updated version
      tokenStore.resetSelectedToken(
        SelectedTokens.ETHTOKEN,
        userBridgeInTokens
      );
      tokenStore.resetSelectedToken(
        SelectedTokens.CONVERTIN,
        userConvertTokens
      );
      tokenStore.resetSelectedToken(
        SelectedTokens.CONVERTOUT,
        userConvertTokens
      );
      tokenStore.resetSelectedToken(
        SelectedTokens.BRIDGEOUT,
        userBridgeOutTokens
      );
    }
  }

  async function setAllData() {
    await getBridgeOutTokens();
    await matchNativeTokensWithConvertCoins();
    resetAllSelectedTokens();
  }
  //initialize data on sign in
  useEffect(() => {
    setAllData();
  }, [networkInfo.account, networkInfo.cantoAddress]);

  //call data per block
  useEffect(() => {
    const interval = setInterval(async () => {
      await setAllData();
    }, 6000);
    return () => clearInterval(interval);
  }, [ethFail, nativeERC20Fail]);

  //useEffect to get tokens quick after user makes changes
  useEffect(() => {
    matchNativeTokensWithConvertCoins();
  }, [nativeERC20Fail]);
  useEffect(() => {
    getBridgeOutTokens();
  }, [tokenStore.bridgeOutNetwork]);

  return {
    userBridgeInTokens,
    userConvertTokens,
    userBridgeOutTokens,
    selectedTokens: tokenStore.selectedTokens,
    setSelectedToken: tokenStore.setSelectedToken,
  };
}
