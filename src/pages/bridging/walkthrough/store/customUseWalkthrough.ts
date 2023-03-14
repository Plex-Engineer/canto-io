import { useEtherBalance } from "@usedapp/core";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { ADDRESSES } from "global/config/addresses";
import { useNetworkInfo } from "global/stores/networkInfo";
import { generatePubKey } from "global/utils/cantoTransactions/publicKey";
import { ALL_BRIDGE_OUT_NETWORKS } from "pages/bridging/config/bridgeOutNetworks";
import {
  BaseToken,
  BridgeOutNetworkInfo,
  BridgeOutNetworks,
  UserBridgeInToken,
  UserConvertToken,
  UserNativeToken,
} from "pages/bridging/config/interfaces";
import { useBridgeTokenInfo } from "pages/bridging/hooks/useBridgeTokenInfo";
import {
  BridgeTransaction,
  useBridgingTransactions,
} from "pages/bridging/hooks/useBridgingTransactions";
import { useTransactionHistory } from "pages/bridging/hooks/useTransactionHistory";
import {
  SelectedTokens,
  useBridgeTokenStore,
} from "pages/bridging/stores/bridgeTokenStore";
import { convertStringToBigNumber } from "pages/bridging/utils/utils";
import { useState } from "react";
import {
  BridgeInWalkthroughSteps,
  BridgeOutWalkthroughSteps,
} from "../config/interfaces";
import {
  didPassBridgeInWalkthroughCheck,
  didPassBridgeOutWalkthroughCheck,
} from "../utils/walkthroughStepChecks";
import { useBridgeWalkthroughStore } from "./bridgeWalkthroughStore";

interface Props {
  networkInfo: {
    chainId: number;
    cantoAddress: string;
    needPubKey: boolean;
    canPubKey: boolean;
    gravityAddress: string;
    notEnoughCantoBalance: boolean;
  };
  walkthroughInfo: {
    canContinue: boolean;
    canGoBack: boolean;
    canSkip: boolean;
    canBridgeIn: boolean;
    canBridgeOut: boolean;
  };
  transactions: {
    approve: BridgeTransaction;
    sendCosmos: BridgeTransaction;
    convertIn: BridgeTransaction;
    convertOut: BridgeTransaction;
    bridgeOut: BridgeTransaction;
    pubKey: {
      state: string;
      send: () => void;
    };
  };
  tokens: {
    allUserTokens: {
      convertTokens: UserConvertToken[];
      bridgeInTokens: UserBridgeInToken[];
      bridgeOutTokens: UserNativeToken[];
    };
    selectedTokens: {
      convertInToken: UserConvertToken;
      convertOutToken: UserConvertToken;
      bridgeInToken: UserBridgeInToken;
      bridgeOutToken: UserNativeToken;
    };
    setTokens: (token: BaseToken, type: SelectedTokens) => void;
  };
  userInputs: {
    amount: string;
    setAmount: (amount: string) => void;
    address: string;
    setAddress: (s: string) => void;
    selectedNetwork: BridgeOutNetworkInfo;
    setNetwork: (network: BridgeOutNetworks) => void;
  };
}
export function useCustomWalkthrough(): Props {
  //all stores we needed here:
  const networkInfo = useNetworkInfo();
  const bridgingTokens = useBridgeTokenInfo();
  const completedBridgeInTxs =
    useTransactionHistory().completeBridgeInTransactions;
  const walkthroughStore = useBridgeWalkthroughStore();
  const bridgeOutNetworkStore = useBridgeTokenStore();
  const ethBalance = useEtherBalance(networkInfo.account, { chainId: 1 });

  //tx hooks for all transactions
  const transactionHooks = useBridgingTransactions();

  //constants to stop reference repetition
  const bridgeInToken = bridgingTokens.selectedTokens[SelectedTokens.ETHTOKEN];
  const convertInToken =
    bridgingTokens.selectedTokens[SelectedTokens.CONVERTIN];
  const bridgeOutToken =
    bridgingTokens.selectedTokens[SelectedTokens.BRIDGEOUT];
  const convertOutToken =
    bridgingTokens.selectedTokens[SelectedTokens.CONVERTOUT];

  //amount will be the same value across the walkthrough
  const [pubKeyStatus, setPubKeyStatus] = useState("None");
  const [amount, setAmount] = useState("");
  const [userCosmosSendAddress, setUserCosmosSendAddress] = useState("");
  const gravityAddress = ADDRESSES.ETHMainnet.GravityBridge;

  //all transactions object
  const allTransactionsObject = {
    approve: transactionHooks.bridgeIn.approveToken(bridgeInToken.address),
    sendCosmos: transactionHooks.bridgeIn.sendToCosmos(
      gravityAddress,
      bridgeInToken.address,
      networkInfo.cantoAddress
    ),
    convertIn: transactionHooks.convertCoin.convertTx(
      convertInToken.ibcDenom,
      networkInfo.cantoAddress,
      true
    ),
    convertOut: transactionHooks.convertCoin.convertTx(
      convertOutToken.ibcDenom,
      networkInfo.cantoAddress,
      false
    ),
    bridgeOut: transactionHooks.bridgeOut.ibcOut(bridgeOutToken.ibcDenom),
    pubKey: {
      state: pubKeyStatus,
      send: () => generatePubKey(networkInfo.account, setPubKeyStatus),
    },
  };

  //check if the current step is complete
  function checkIfCanContinue() {
    const currentType = walkthroughStore.currentBridgeType;
    if (currentType === "IN") {
      return didPassBridgeInWalkthroughCheck(
        walkthroughStore.bridgeInStep,
        Number(networkInfo.chainId),
        bridgeInToken,
        convertStringToBigNumber(amount, bridgeInToken.decimals),
        bridgeInToken.erc20Balance,
        "",
        completedBridgeInTxs,
        convertInToken,
        allTransactionsObject.convertIn.state
      );
    } else if (currentType === "OUT") {
      return didPassBridgeOutWalkthroughCheck(
        walkthroughStore.bridgeOutStep,
        Number(networkInfo.chainId),
        convertOutToken,
        convertStringToBigNumber(amount, convertOutToken.decimals),
        convertOutToken.erc20Balance,
        allTransactionsObject.convertOut.state,
        bridgeOutNetworkStore.bridgeOutNetwork,
        bridgeOutToken,
        allTransactionsObject.bridgeOut.state,
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

  //constants to let walkthrough know if user has funds to perform this bridge
  const canBridgeIn = () => {
    for (const token of bridgingTokens.userBridgeInTokens) {
      if (token.erc20Balance.gt(0)) return true;
    }
    for (const token of bridgingTokens.userConvertTokens) {
      if (token.nativeBalance.gt(0)) return true;
    }
    return false;
  };
  const canBridgeOut = () => {
    for (const token of bridgingTokens.userBridgeOutTokens) {
      if (token.nativeBalance.gt(0)) return true;
    }
    for (const token of bridgingTokens.userConvertTokens) {
      if (token.erc20Balance.gt(0)) return true;
    }
    return false;
  };

  const canPubKey =
    (ethBalance?.gt(parseUnits("0.01")) ||
      networkInfo.balance?.gt(parseUnits("0.5"))) ??
    true;
  return {
    networkInfo: {
      chainId: Number(networkInfo.chainId),
      cantoAddress: networkInfo.cantoAddress,
      notEnoughCantoBalance: networkInfo.balance.lt(parseEther("3")),
      needPubKey: !networkInfo.hasPubKey,
      canPubKey,
      gravityAddress: gravityAddress ?? ADDRESSES.ETHMainnet.GravityBridge,
    },
    walkthroughInfo: {
      canContinue: checkIfCanContinue(),
      canGoBack: checkIfCanClickPrevious(),
      canSkip: checkIfCanSkip(bridgingTokens.userConvertTokens),
      canBridgeIn: canBridgeIn(),
      canBridgeOut: canBridgeOut(),
    },
    transactions: {
      approve: transactionHooks.bridgeIn.approveToken(bridgeInToken.address),
      sendCosmos: transactionHooks.bridgeIn.sendToCosmos(
        gravityAddress,
        bridgeInToken.address,
        networkInfo.cantoAddress
      ),
      convertIn: transactionHooks.convertCoin.convertTx(
        convertInToken.ibcDenom,
        networkInfo.cantoAddress,
        true
      ),
      convertOut: transactionHooks.convertCoin.convertTx(
        convertOutToken.ibcDenom,
        networkInfo.cantoAddress,
        false
      ),
      bridgeOut: transactionHooks.bridgeOut.ibcOut(bridgeOutToken.ibcDenom),
      pubKey: {
        state: pubKeyStatus,
        send: () => generatePubKey(networkInfo.account, setPubKeyStatus),
      },
    },
    tokens: {
      allUserTokens: {
        convertTokens: bridgingTokens.userConvertTokens,
        bridgeInTokens: bridgingTokens.userBridgeInTokens,
        bridgeOutTokens: bridgingTokens.userBridgeOutTokens,
      },
      selectedTokens: {
        convertInToken,
        convertOutToken,
        bridgeInToken,
        bridgeOutToken,
      },
      setTokens: bridgingTokens.setSelectedToken,
    },
    userInputs: {
      amount,
      setAmount,
      address: userCosmosSendAddress,
      setAddress: setUserCosmosSendAddress,
      selectedNetwork:
        ALL_BRIDGE_OUT_NETWORKS[bridgeOutNetworkStore.bridgeOutNetwork],
      setNetwork: bridgeOutNetworkStore.setBridgeOutNetwork,
    },
  };
}
