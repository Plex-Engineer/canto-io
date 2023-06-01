import { useNetworkInfo } from "global/stores/networkInfo";
import { useEffect, useState } from "react";
import {
  BridgeNetworkPair,
  EMPTY_ERC20_BRIDGE_TOKEN,
  IBCTokenTrace,
  SelectorProps,
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
import { BigNumber } from "ethers";
import { useBridgeOutStore } from "../stores/bridgeOutStore";
import { onTestnet } from "global/config/networks";

interface BridgingProps {
  allTokens: {
    userBridgeInTokens: UserERC20BridgeToken[];
    userBridgeOutTokens: UserERC20BridgeToken[];
    userNativeTokens: UserNativeToken[];
    unkownIBCTokens: IBCTokenTrace[];
  };
  bridgeIn: {
    token: SelectorProps;
    methods: SelectorProps;
    networks: SelectorProps;
  };
  bridgeOut: {
    token: SelectorProps;
    methods: SelectorProps;
    networks: SelectorProps;
  };
}

export function useBridging(): BridgingProps {
  const [account, chainId, cantoAddress] = useNetworkInfo((state) => [
    state.account,
    Number(state.chainId),
    state.cantoAddress,
  ]);
  const bridgeOutStore = useBridgeOutStore();
  const isOnTestnet = onTestnet(chainId);

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
  ).tokens.map((token) => {
    return {
      ...token,
      erc20Balance:
        sendingNetwork.network.coreContracts.WETH === token.address
          ? token.erc20Balance.add(ethBalance ?? BigNumber.from(0))
          : token.erc20Balance,
    };
  });
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
}
