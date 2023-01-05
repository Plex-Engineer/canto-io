import { useNetworkInfo } from "global/stores/networkInfo";
import { allBridgeOutNetworks } from "pages/bridge/config/gravityBridgeTokens";
import {
  BaseToken,
  BridgeTransactionType,
  UserConvertToken,
  UserGravityBridgeTokens,
  UserNativeTokens,
} from "pages/bridge/config/interfaces";
import { useCustomBridgeInfo } from "pages/bridge/hooks/useCustomBridgeInfo";
import { SelectedTokens, useTokenStore } from "pages/bridge/stores/tokenStore";
import { useBridgeTransactionPageStore } from "pages/bridge/stores/transactionPageStore";
import useBridgeTxStore from "pages/bridge/stores/transactionStore";
import { convertStringToBigNumber } from "pages/bridge/utils/stringToBigNumber";
import { useBridgeWalkthroughStore } from "pages/bridge/walkthrough/store/bridgeWalkthroughStore";
import {
  didPassBridgeInWalkthroughCheck,
  didPassBridgeOutWalkthroughCheck,
} from "pages/bridge/walkthrough/walkthroughFunctions";
import { useState } from "react";

interface Props {
  chainId: number;
  canContinue: boolean;
  canSkip: boolean;
  allUserTokens: {
    convertTokens: UserConvertToken[];
    bridgeInTokens: UserGravityBridgeTokens[];
    bridgeOutTokens: UserNativeTokens[];
  };
  selectedTokens: {
    convertInToken: UserConvertToken;
    convertOutToken: UserConvertToken;
    bridgeInToken: UserGravityBridgeTokens;
    bridgeOutToken: UserNativeTokens;
  };
  setTokens: (token: BaseToken, type: SelectedTokens) => void;
  amount: string;
  setAmount: (amount: string) => void;
}
export function useCustomWalkthrough(): Props {
  //all stores we needed here:
  const completedBridgeInTxs =
    useBridgeTransactionPageStore().transactions.completedBridgeTransactions;
  const walkthroughStore = useBridgeWalkthroughStore();
  const networkInfo = useNetworkInfo();
  const tokenStore = useTokenStore();
  const bridgeTxStore = useBridgeTxStore();
  const {
    userConvertTokens,
    userBridgeInTokens,
    userBridgeOutTokens,
    gravityAddress,
  } = useCustomBridgeInfo();

  //constants to stop reference repetition
  const bridgeInToken = tokenStore.selectedTokens[SelectedTokens.ETHTOKEN];
  const convertInToken = tokenStore.selectedTokens[SelectedTokens.CONVERTIN];
  const bridgeOutToken = tokenStore.selectedTokens[SelectedTokens.BRIDGEOUT];
  const convertOutToken = tokenStore.selectedTokens[SelectedTokens.CONVERTOUT];

  //amount will be the same value across the walkthrough
  const [amount, setAmount] = useState("");

  //check if the current step is complete
  function checkIfCanContinue() {
    const currentType = walkthroughStore.currentBridgeType;
    if (currentType === "IN") {
      return didPassBridgeInWalkthroughCheck(
        walkthroughStore.bridgeInStep,
        Number(networkInfo.chainId),
        bridgeInToken,
        convertStringToBigNumber(amount, bridgeInToken.decimals),
        bridgeInToken.balanceOf,
        "",
        completedBridgeInTxs,
        convertInToken,
        convertStringToBigNumber(amount, convertInToken.decimals),
        convertInToken.nativeBalance,
        bridgeTxStore.transactionStatus?.type ===
          BridgeTransactionType.CONVERT_IN
          ? bridgeTxStore.transactionStatus.status
          : "None"
      );
    } else if (currentType === "OUT") {
      return didPassBridgeOutWalkthroughCheck(
        walkthroughStore.bridgeOutStep,
        Number(networkInfo.chainId),
        convertOutToken,
        convertStringToBigNumber(amount, convertOutToken.decimals),
        convertOutToken.erc20Balance,
        bridgeTxStore.transactionStatus?.type ===
          BridgeTransactionType.CONVERT_OUT
          ? bridgeTxStore.transactionStatus.status
          : "None",
        allBridgeOutNetworks[tokenStore.bridgeOutNetwork],
        bridgeOutToken,
        convertStringToBigNumber(amount, bridgeOutToken.decimals),
        bridgeOutToken.nativeBalance,
        bridgeTxStore.transactionStatus?.type ===
          BridgeTransactionType.BRIDGE_OUT
          ? bridgeTxStore.transactionStatus.status
          : "None"
      );
    }
    return false;
  }

  //check if user has native balance to skip ahead
  function checkIfCanSkip(convertTokens: UserConvertToken[]) {
    for (const token in convertTokens) {
      if (convertTokens[token].nativeBalance.gt(0)) {
        return true;
      }
    }
    return false;
  }

  return {
    chainId: Number(networkInfo.chainId),
    canContinue: checkIfCanContinue(),
    canSkip: checkIfCanSkip(userConvertTokens),
    allUserTokens: {
      convertTokens: userConvertTokens,
      bridgeInTokens: userBridgeInTokens,
      bridgeOutTokens: userBridgeOutTokens,
    },
    selectedTokens: {
      convertInToken,
      convertOutToken,
      bridgeInToken,
      bridgeOutToken,
    },
    setTokens: tokenStore.setSelectedToken,
    amount,
    setAmount,
  };
}
