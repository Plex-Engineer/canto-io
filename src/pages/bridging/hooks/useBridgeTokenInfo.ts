import { useNetworkInfo } from "global/stores/networkInfo";
import { useEffect, useState } from "react";
import {
  BridgeNetworkPair,
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
import { useEtherBalance } from "@usedapp/core";
import { getNetworkPair } from "../config/networkPairs";
import { getCosmosAPIEndpoint } from "global/utils/getAddressUtils";

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
  networkPair: BridgeNetworkPair;
}

export function useBridgeTokenInfo(): BridgeTokenInfo {
  const [account, chainId, cantoAddress] = useNetworkInfo((state) => [
    state.account,
    Number(state.chainId),
    state.cantoAddress,
  ]);
  const tokenStore = useBridgeTokenStore();

  //will use these to determine what tokens to show
  const networkPair = getNetworkPair(chainId);
  const [sendingNetwork, receivingNetwork] = [
    networkPair.sending,
    networkPair.receiving,
  ];

  const ethBalance = useEtherBalance(account, {
    chainId: sendingNetwork.network.chainId,
  });

  //bridge in erc20 tokens on ETH mainnet
  const userEthBridgeInTokens = useTokenBalances(
    account,
    sendingNetwork.tokens,
    sendingNetwork.network.chainId,
    sendingNetwork.network.coreContracts.GravityBridge
  ).tokens;
  //bridge out erc20 tokens on Canto Mainnet
  const { tokens: userCantoBridgeOutTokens } = useTokenBalances(
    account,
    receivingNetwork.convertCoinTokens,
    receivingNetwork.network.chainId
  );
  const [userNativeTokens, setUserNativeTokens] = useState<UserNativeToken[]>(
    []
  );

  //these are used for "recover tokens" if unidentified tokens are found
  const [allUnknownIBC, setAllUnknownIBC] = useState<IBCTokenTrace[]>([]);
  async function getAllNativeTokens() {
    const { foundTokens, notFoundTokens } = await getNativeCantoBalances(
      getCosmosAPIEndpoint(receivingNetwork.network.chainId),
      cantoAddress,
      receivingNetwork.convertCoinTokens
    );
    setUserNativeTokens(foundTokens);
    setAllUnknownIBC(
      await getUnknownIBCTokens(
        notFoundTokens,
        getCosmosAPIEndpoint(receivingNetwork.network.chainId)
      )
    );
  }

  //initialize data on sign in
  useEffect(() => {
    getAllNativeTokens();
  }, [account, cantoAddress, chainId]);

  //call data per block
  useEffect(() => {
    const interval = setInterval(async () => {
      await getAllNativeTokens();
    }, 6000);
    return () => clearInterval(interval);
  }, [cantoAddress, chainId]);

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
    networkPair,
  };
}
