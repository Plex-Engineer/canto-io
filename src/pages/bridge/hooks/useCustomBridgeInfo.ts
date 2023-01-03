import { BigNumber } from "ethers";
import { CantoMainnet } from "global/config/networks";
import { useNetworkInfo } from "global/stores/networkInfo";
import { useEffect, useState } from "react";
import {
  allBridgeOutNetworks,
  convertCoinTokens,
  ETHGravityTokens,
} from "../config/gravityBridgeTokens";
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
  getBridgeInEventsWithStatus,
  getBridgeOutTransactions,
} from "../utils/bridgeTxPageUtils";
import { getNativeCantoBalance } from "../utils/nativeBalances";
import { useCantoERC20Balances } from "./useERC20Balances";
import { useEthGravityTokens } from "./useEthGravityTokens";

interface AllBridgeInfo {
  account: string | undefined;
  userConvertTokens: UserConvertToken[];
  userBridgeInTokens: UserGravityBridgeTokens[];
  userBridgeOutTokens: UserNativeTokens[];
  gravityAddress: string | undefined;
  selectedTokens: TokenStore["selectedTokens"];
  setSelectedToken: (selectedToken: BaseToken, type: SelectedTokens) => void;
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
      convertCoinTokens,
      CantoMainnet.chainId
    );
  const [userConvertTokens, setUserConvertTokens] = useState<
    UserConvertToken[]
  >([]);
  const { userEthGTokens: userBridgeInTokens, gravityAddress } =
    useEthGravityTokens(networkInfo.account, ETHGravityTokens);
  const [userBridgeOutTokens, setUserBridgeOutTokens] = useState<
    UserNativeTokens[]
  >([]);

  async function getConvertCoinBalance() {
    const convertNativeWithBalance = await getNativeCantoBalance(
      CantoMainnet.cosmosAPIEndpoint,
      networkInfo.cantoAddress,
      convertCoinTokens
    );
    if (!cantoERC20Fail) {
      setUserConvertTokens(
        userConvertERC20Tokens.map((token) => {
          return {
            ...token,
            nativeBalance:
              convertNativeWithBalance.find(
                (nativeToken) => nativeToken.nativeName === token.nativeName
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
        allBridgeOutNetworks[tokenStore.bridgeOutNetwork].tokens
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
        await setBridgingTransactions();
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

  return {
    account: networkInfo.account,
    userConvertTokens,
    userBridgeInTokens,
    userBridgeOutTokens,
    gravityAddress,
    selectedTokens: tokenStore.selectedTokens,
    setSelectedToken: tokenStore.setSelectedToken,
  };
}
