import { BigNumber } from "ethers";
import { CantoMainnet } from "global/config/networks";
import { useNetworkInfo } from "global/stores/networkInfo";
import { ReactNode, useEffect, useState } from "react";
import { ALL_BRIDGE_OUT_NETWORKS } from "../config/bridgeOutNetworks";
import {
  CONVERT_COIN_TOKENS,
  ETH_GRAVITY_BRIDGE_IN_TOKENS,
} from "../config/bridgingTokens";
import {
  BaseToken,
  UserConvertToken,
  UserGravityBridgeTokens,
  UserNativeTokens,
} from "../config/interfaces";
import {
  SelectedTokens,
  TokenStore,
  useTokenStore,
} from "../stores/tokenStore";
import { useTransactionChecklistStore } from "../stores/transactionChecklistStore";
import { useBridgeTransactionPageStore } from "../stores/transactionPageStore";
import {
  convertSecondsToString,
  getBridgeInEventsWithStatus,
  getBridgeOutTransactions,
} from "../utils/bridgeTxPageUtils";
import { getNativeCantoBalance } from "../utils/nativeBalances";
import { useCantoERC20Balances } from "./useERC20Balances";
import { useEthGravityTokens } from "./useEthGravityTokens";

interface AllBridgeInfo {
  account: string | undefined;
  hasPubKey: boolean;
  userConvertTokens: UserConvertToken[];
  userBridgeInTokens: UserGravityBridgeTokens[];
  userBridgeOutTokens: UserNativeTokens[];
  gravityAddress: string | undefined;
  selectedTokens: TokenStore["selectedTokens"];
  setSelectedToken: (selectedToken: BaseToken, type: SelectedTokens) => void;
  bridgeInUserStatus: ReactNode;
}
export function useCustomBridgeInfo(): AllBridgeInfo {
  const networkInfo = useNetworkInfo();
  const tokenStore = useTokenStore();
  const transactionStore = useBridgeTransactionPageStore();
  const transactionChecklistStore = useTransactionChecklistStore();

  //setting the bridging transactions into local storage
  async function setBridgingTransactions() {
    if (networkInfo.account && networkInfo.cantoAddress) {
      const [completedBridgeIn, pendingBridgeIn] =
        await getBridgeInEventsWithStatus(networkInfo.account);
      const bridgeOutTransactions = await getBridgeOutTransactions(
        networkInfo.cantoAddress
      );
      transactionStore.setTransactions(
        networkInfo.account,
        pendingBridgeIn,
        completedBridgeIn,
        bridgeOutTransactions
      );
    }
  }
  //set the convert erc20 tokens
  const { userTokens: userConvertERC20Tokens, fail: cantoERC20Fail } =
    useCantoERC20Balances(
      networkInfo.account,
      CONVERT_COIN_TOKENS,
      CantoMainnet.chainId
    );
  const [userConvertTokens, setUserConvertTokens] = useState<
    UserConvertToken[]
  >([]);
  const { userEthGTokens: userBridgeInTokens, gravityAddress } =
    useEthGravityTokens(networkInfo.account, ETH_GRAVITY_BRIDGE_IN_TOKENS);
  const [userBridgeOutTokens, setUserBridgeOutTokens] = useState<
    UserNativeTokens[]
  >([]);

  async function getConvertCoinBalance() {
    const convertNativeWithBalance = await getNativeCantoBalance(
      CantoMainnet.cosmosAPIEndpoint,
      networkInfo.cantoAddress,
      CONVERT_COIN_TOKENS
    );
    if (!cantoERC20Fail) {
      setUserConvertTokens(
        userConvertERC20Tokens.map((token) => {
          return {
            ...token,
            nativeBalance:
              convertNativeWithBalance.find(
                (nativeToken) => nativeToken.ibcDenom === token.ibcDenom
              )?.nativeBalance ?? BigNumber.from(0),
          };
        })
      );
    }
  }
  async function getBridgeOutTokens() {
    setUserBridgeOutTokens(
      await getNativeCantoBalance(
        CantoMainnet.cosmosAPIEndpoint,
        networkInfo.cantoAddress,
        ALL_BRIDGE_OUT_NETWORKS[tokenStore.bridgeOutNetwork].tokens
      )
    );
  }
  async function getAllBalances() {
    await getConvertCoinBalance();
    await getBridgeOutTokens();
  }

  useEffect(() => {
    if (networkInfo.account && networkInfo.cantoAddress) {
      getAllBalances();
      setBridgingTransactions();
      transactionStore.checkAccount(networkInfo.account);
      tokenStore.checkTimeAndResetTokens();
      transactionChecklistStore.checkPreviousAccount(networkInfo.account);
    }
  }, [networkInfo.account, networkInfo.cantoAddress]);

  //useEffect to get tokens quick after user makes changes
  useEffect(() => {
    getConvertCoinBalance();
  }, [cantoERC20Fail]);
  useEffect(() => {
    getBridgeOutTokens();
  }, [tokenStore.bridgeOutNetwork]);

  //Useffect for calling data per block
  useEffect(() => {
    if (networkInfo.account && networkInfo.cantoAddress) {
      const interval = setInterval(async () => {
        await getAllBalances();
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
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [userBridgeInTokens, userBridgeOutTokens, userConvertTokens]);
  useEffect(() => {
    const interval = setInterval(async () => {
      await setBridgingTransactions();
    }, 30000);
    return () => clearInterval(interval);
  });
  const bridgeInUserStatus = () => {
    if (userConvertTokens.length == 0) {
      return "retreiving status...";
    }
    for (const token of userConvertTokens) {
      if (token.nativeBalance.gt(0)) {
        return (
          <>
            status: step 1 complete <br /> proceed with step 2: bridge to canto
          </>
        );
      }
    }
    const latestEthBridge =
      transactionStore.transactions.pendingBridgeTransactions[0];
    return latestEthBridge ? (
      <>
        status: bridging in progress <br /> estimated completion time:{" "}
        {convertSecondsToString(latestEthBridge.secondsUntilConfirmed)}
      </>
    ) : (
      <>
        {" "}
        status: begin bridging <br /> proceed with step 1: ethereum to bridge
      </>
    );
  };

  return {
    account: networkInfo.account,
    hasPubKey: networkInfo.hasPubKey,
    userConvertTokens,
    userBridgeInTokens,
    userBridgeOutTokens,
    gravityAddress,
    selectedTokens: tokenStore.selectedTokens,
    setSelectedToken: tokenStore.setSelectedToken,
    bridgeInUserStatus: bridgeInUserStatus(),
  };
}
