import { ADDRESSES } from "global/config/addresses";
import { CantoMainnet, ETHMainnet } from "global/config/networks";
import { useNetworkInfo } from "global/stores/networkInfo";
import { useEffect, useState } from "react";
import {
  CONVERT_COIN_TOKENS,
  ETH_GRAVITY_BRIDGE_IN_TOKENS,
} from "../config/bridgingTokens";
import {
  EMPTY_ERC20_BRIDGE_TOKEN,
  IBCTokenTrace,
  UserERC20BridgeToken,
  UserNativeToken,
} from "../config/interfaces";
import {
  SelectedTokens,
  useBridgeTokenStore,
} from "../stores/bridgeTokenStore";
import {
  getNativeCantoBalances,
  getUnknownIBCTokens,
} from "../utils/nativeBalances";
import { useTokenBalances } from "./tokenBalances/useTokenBalances";
import { TOKENS } from "global/config/tokenInfo";

interface BridgeTokenInfo {
  userBridgeInTokens: UserERC20BridgeToken[];
  userBridgeOutTokens: UserERC20BridgeToken[];
  userNativeTokens: UserNativeToken[];
  unkownIBCTokens: IBCTokenTrace[];
  selectedTokens: {
    bridgeInToken: UserERC20BridgeToken;
    bridgeOutToken: UserERC20BridgeToken;
  };
  setSelectedToken: (selectedToken: string, type: SelectedTokens) => void;
}

export function useBridgeTokenInfo(): BridgeTokenInfo {
  const networkInfo = useNetworkInfo();
  const tokenStore = useBridgeTokenStore();

  //bridge in erc20 tokens on ETH mainnet
  const userEthBridgeInTokens = useTokenBalances(
    networkInfo.account,
    ETH_GRAVITY_BRIDGE_IN_TOKENS,
    ETHMainnet.chainId,
    ADDRESSES.ETHMainnet.GravityBridge
  ).tokens.map((token) => ({
    ...token,
    erc20Balance:
      token.address === TOKENS.ETHMainnet.WETH.address
        ? token.erc20Balance.add(networkInfo.balance)
        : token.erc20Balance,
  }));
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

  //these are used for "recover tokens" if unidentified tokens are found
  const [allUnknownIBC, setAllUnknownIBC] = useState<IBCTokenTrace[]>([]);
  async function getAllNativeTokens() {
    const { foundTokens, notFoundTokens } = await getNativeCantoBalances(
      CantoMainnet.cosmosAPIEndpoint,
      networkInfo.cantoAddress,
      CONVERT_COIN_TOKENS
    );
    setUserNativeTokens(foundTokens);
    setAllUnknownIBC(await getUnknownIBCTokens(notFoundTokens));
  }

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
    unkownIBCTokens: allUnknownIBC,
    selectedTokens: {
      bridgeInToken:
        userEthBridgeInTokens.find(
          (token) =>
            token.address.toLowerCase() ==
            tokenStore.selectedTokens[SelectedTokens.ETHTOKEN].toLowerCase()
        ) ?? EMPTY_ERC20_BRIDGE_TOKEN,
      bridgeOutToken:
        userCantoBridgeOutTokens.find(
          (token) =>
            token.address.toLowerCase() ==
            tokenStore.selectedTokens[SelectedTokens.CONVERTOUT].toLowerCase()
        ) ?? EMPTY_ERC20_BRIDGE_TOKEN,
    },
    setSelectedToken: tokenStore.setSelectedToken,
  };
}
