import { useNetworkInfo } from "global/stores/networkInfo";
import { useEffect, useState } from "react";
import {
  IBCTokenTrace,
  UserERC20BridgeToken,
  UserNativeToken,
} from "../config/bridgingInterfaces";
import {
  getNativeCantoBalances,
  getUnknownIBCTokens,
} from "../utils/nativeBalances";
import { useTokenBalances } from "./tokenBalances/useTokenBalances";
import { useEtherBalance } from "@usedapp/core";
import { getCosmosAPIEndpoint } from "global/utils/getAddressUtils";
import { BigNumber } from "ethers";
import {
  CANTO_MAIN_CONVERT_COIN_TOKENS,
  ETH_GRAVITY_BRIDGE_IN_TOKENS,
} from "../config/tokens.ts/bridgingTokens";
import {
  CantoMainnet,
  CantoTestnet,
  ETHMainnet,
  onTestnet,
} from "global/config/networks";

interface BridgeTokenInfo {
  userBridgeInTokens: UserERC20BridgeToken[];
  userBridgeOutTokens: UserERC20BridgeToken[];
  userNativeTokens: UserNativeToken[];
  unkownIBCTokens: IBCTokenTrace[];
  ethMainBalance: BigNumber;
}

export function useBridgeTokenInfo(): BridgeTokenInfo {
  const [account, chainId, cantoAddress] = useNetworkInfo((state) => [
    state.account,
    Number(state.chainId),
    state.cantoAddress,
  ]);
  //will use cantoNetwork to get ntive tokens
  const isOnTestnet = onTestnet(chainId);
  const cantoNetwork = isOnTestnet ? CantoTestnet : CantoMainnet;

  const ethBalance = useEtherBalance(account, {
    chainId: ETHMainnet.chainId,
  });

  //bridge in erc20 tokens on ETH mainnet
  const userEthBridgeInTokens = useTokenBalances(
    account,
    ETH_GRAVITY_BRIDGE_IN_TOKENS,
    ETHMainnet.chainId,
    ETHMainnet.coreContracts.GravityBridge
  ).tokens.map((token) => {
    return {
      ...token,
      erc20Balance:
        ETHMainnet.coreContracts.WETH === token.address
          ? token.erc20Balance.add(ethBalance ?? BigNumber.from(0))
          : token.erc20Balance,
    };
  });
  //bridge out erc20 tokens on Canto Mainnet
  const { tokens: userCantoBridgeOutTokens } = useTokenBalances(
    account,
    CANTO_MAIN_CONVERT_COIN_TOKENS,
    CantoMainnet.chainId
  );
  const [userNativeTokens, setUserNativeTokens] = useState<UserNativeToken[]>(
    []
  );

  //these are used for "recover tokens" if unidentified tokens are found
  const [allUnknownIBC, setAllUnknownIBC] = useState<IBCTokenTrace[]>([]);
  async function getAllNativeTokens() {
    const { foundTokens, notFoundTokens } = await getNativeCantoBalances(
      getCosmosAPIEndpoint(cantoNetwork.chainId),
      cantoAddress,
      isOnTestnet ? [] : CANTO_MAIN_CONVERT_COIN_TOKENS
    );
    setUserNativeTokens(foundTokens);
    setAllUnknownIBC(
      await getUnknownIBCTokens(
        notFoundTokens,
        getCosmosAPIEndpoint(cantoNetwork.chainId)
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
    ethMainBalance: ethBalance ?? BigNumber.from(0),
  };
}
