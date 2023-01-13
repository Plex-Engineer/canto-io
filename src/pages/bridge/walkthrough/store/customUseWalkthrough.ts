import { TransactionStatus } from "@usedapp/core";
import { BigNumber } from "ethers";
import { ADDRESSES } from "global/config/addresses";
import { useNetworkInfo } from "global/stores/networkInfo";
import { generatePubKey } from "global/utils/cantoTransactions/publicKey";
import {
  allBridgeOutNetworks,
  BridgeOutNetworkInfo,
  BridgeOutNetworks,
  BridgeOutNetworkTokenData,
} from "pages/bridge/config/gravityBridgeTokens";
import {
  BaseToken,
  BridgeTransactionType,
  UserConvertToken,
  UserGravityBridgeTokens,
  UserNativeTokens,
} from "pages/bridge/config/interfaces";
import { useCustomBridgeInfo } from "pages/bridge/hooks/useCustomBridgeInfo";
import { useApprove, useCosmos } from "pages/bridge/hooks/useTransactions";
import { SelectedTokens, useTokenStore } from "pages/bridge/stores/tokenStore";
import { useBridgeTransactionPageStore } from "pages/bridge/stores/transactionPageStore";
import useBridgeTxStore, {
  BridgeTransactionStatus,
} from "pages/bridge/stores/transactionStore";
import { convertStringToBigNumber } from "pages/bridge/utils/stringToBigNumber";
import { useBridgeWalkthroughStore } from "pages/bridge/walkthrough/store/bridgeWalkthroughStore";
import {
  didPassBridgeInWalkthroughCheck,
  didPassBridgeOutWalkthroughCheck,
} from "pages/bridge/walkthrough/walkthroughFunctions";
import { ReactNode, useEffect, useState } from "react";
import {
  BridgeInWalkthroughSteps,
  BridgeOutWalkthroughSteps,
} from "../walkthroughTracker";

interface Props {
  chainId: number;
  cantoAddress: string;
  needPubKey: boolean;
  gravityAddress: string;
  userCosmosSend: {
    address: string;
    setAddress: (s: string) => void;
  };
  canContinue: boolean;
  canGoBack: boolean;
  canSkip: boolean;
  canBridgeIn: boolean;
  canBridgeOut: boolean;
  tokens: {
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
  };
  bridgeInTx: {
    approve: {
      tx: (gravityAddress: string, amount: BigNumber) => void;
      state: TransactionStatus;
    };
    sendCosmos: {
      tx: () => void;
      state: TransactionStatus;
    };
  };
  bridgeOutNetworks: {
    allNetworks: BridgeOutNetworkTokenData;
    selectedNetwork: BridgeOutNetworkInfo;
    setNetwork: (network: BridgeOutNetworks) => void;
  };
  amount: string;
  setAmount: (amount: string) => void;
  cosmosTxStatus: BridgeTransactionStatus | undefined;
  setCosmosTxStatus: (status: BridgeTransactionStatus | undefined) => void;
  pubKey: {
    tx: () => void;
    status: ReactNode;
  };
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
  const [userCosmosSendAddress, setUserCosmosSendAddress] = useState("");

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
        stateCosmos.transaction?.hash,
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
        tokenStore.bridgeOutNetwork,
        bridgeOutToken,
        convertStringToBigNumber(amount, bridgeOutToken.decimals),
        bridgeOutToken.nativeBalance,
        bridgeTxStore.transactionStatus?.type ===
          BridgeTransactionType.BRIDGE_OUT
          ? bridgeTxStore.transactionStatus.status
          : "None",
        userCosmosSendAddress
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

  function checkIfCanClickPrevious() {
    const currentType = walkthroughStore.currentBridgeType;
    if (currentType == "IN") {
      return !BridgeInWalkthroughSteps[walkthroughStore.bridgeInStep]
        .isCheckpoint;
    } else if (currentType == "OUT") {
      return !BridgeOutWalkthroughSteps[walkthroughStore.bridgeOutStep]
        .isCheckpoint;
    }
    return true;
  }

  //function states for approval of ETH tokens and bridging to gBridge
  const { state: stateApprove, send: sendApprove } = useApprove(
    bridgeInToken.address
  );
  const { state: stateCosmos, send: sendCosmos } = useCosmos(
    gravityAddress ?? ADDRESSES.ETHMainnet.GravityBridge
  );

  //must reset transaction state when the user steps forward or back since txState is the same store
  useEffect(() => {
    bridgeTxStore.setTransactionStatus(undefined);
  }, [walkthroughStore.bridgeInStep, walkthroughStore.bridgeOutStep]);

  //constants to let walkthrough know if user has funds to perform this bridge
  const canBridgeIn = () => {
    for (const token of userBridgeInTokens) {
      if (token.balanceOf.gt(0)) return true;
    }
    for (const token of userConvertTokens) {
      if (token.nativeBalance.gt(0)) return true;
    }
    return false;
  };
  const canBridgeOut = () => {
    for (const token of userBridgeOutTokens) {
      if (token.nativeBalance.gt(0)) return true;
    }
    for (const token of userConvertTokens) {
      if (token.erc20Balance.gt(0)) return true;
    }
    return false;
  };

  const [pubKeyStatus, setPubKeyStatus] = useState("None");

  return {
    chainId: Number(networkInfo.chainId),
    cantoAddress: networkInfo.cantoAddress,
    needPubKey: !networkInfo.hasPubKey,
    gravityAddress: gravityAddress ?? ADDRESSES.ETHMainnet.GravityBridge,
    canContinue: checkIfCanContinue(),
    canGoBack: checkIfCanClickPrevious(),
    canSkip: checkIfCanSkip(userConvertTokens),
    canBridgeIn: canBridgeIn(),
    canBridgeOut: canBridgeOut(),
    userCosmosSend: {
      address: userCosmosSendAddress,
      setAddress: setUserCosmosSendAddress,
    },
    tokens: {
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
    },
    bridgeInTx: {
      approve: {
        tx: sendApprove,
        state: stateApprove,
      },
      sendCosmos: {
        tx: sendCosmos,
        state: stateCosmos,
      },
    },
    bridgeOutNetworks: {
      allNetworks: allBridgeOutNetworks,
      selectedNetwork: allBridgeOutNetworks[tokenStore.bridgeOutNetwork],
      setNetwork: tokenStore.setBridgeOutNetwork,
    },
    amount,
    setAmount,
    cosmosTxStatus: bridgeTxStore.transactionStatus,
    setCosmosTxStatus: bridgeTxStore.setTransactionStatus,
    pubKey: {
      tx: () => generatePubKey(networkInfo.account, setPubKeyStatus),
      status: pubKeyStatus,
    },
  };
}
