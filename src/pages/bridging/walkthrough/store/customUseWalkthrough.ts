import { useEtherBalance } from "@usedapp/core";
import { formatUnits, parseEther, parseUnits } from "ethers/lib/utils";
import { ADDRESSES } from "global/config/addresses";
import { useNetworkInfo } from "global/stores/networkInfo";
import { generatePubKey } from "global/utils/cantoTransactions/publicKey";
import { ALL_BRIDGE_OUT_NETWORKS } from "pages/bridging/config/bridgeOutNetworks";
import {
  BridgeOutNetworkInfo,
  BridgeOutNetworks,
  EMPTY_ERC20_BRIDGE_TOKEN,
  EMPTY_NATIVE_TOKEN,
  UserERC20BridgeToken,
  UserNativeToken,
} from "pages/bridging/config/interfaces";
import { useBridgeTokenInfo } from "pages/bridging/hooks/useBridgeTokenInfo";
import {
  BridgeTransaction,
  useBridgingTransactions,
} from "pages/bridging/hooks/useBridgingTransactions";
import { useTransactionHistory } from "pages/bridging/hooks/useTransactionHistory";
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

export enum WalkthroughSelectedTokens {
  ETH_BRIDGE_IN,
  CONVERT_IN,
  CONVERT_OUT,
  BRIDGE_OUT,
}
interface Props {
  networkInfo: {
    chainId: number;
    cantoAddress: string;
    needPubKey: boolean;
    canPubKey: boolean;
    gravityAddress: string;
    notEnoughCantoBalance: boolean;
  };
  tokens: {
    allUserTokens: {
      userBridgeInTokens: UserERC20BridgeToken[];
      userBridgeOutTokens: UserERC20BridgeToken[];
      userNativeTokens: UserNativeToken[];
    };
    selectedTokens: {
      convertInToken: UserNativeToken;
      convertOutToken: UserERC20BridgeToken;
      bridgeInToken: UserERC20BridgeToken;
      bridgeOutToken: UserNativeToken;
    };
    setTokens: (tokenAddress: string, type: WalkthroughSelectedTokens) => void;
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
  const walkthroughStore = useBridgeWalkthroughStore();
  const completedBridgeInTxs =
    useTransactionHistory().completeBridgeInTransactions;
  const ethBalance = useEtherBalance(networkInfo.account, { chainId: 1 });
  const [amount, setAmount] = useState("");
  const [userCosmosSendAddress, setUserCosmosSendAddress] = useState("");
  const [selectedCosmoNetwork, setSelectedCosmosNetwork] =
    useState<BridgeOutNetworks>(0);

  //token selector
  const [selectedTokens, setSelectedTokens] = useState({
    [WalkthroughSelectedTokens.ETH_BRIDGE_IN]: "",
    [WalkthroughSelectedTokens.CONVERT_IN]: "",
    [WalkthroughSelectedTokens.CONVERT_OUT]: "",
    [WalkthroughSelectedTokens.BRIDGE_OUT]: "",
  });
  function setSelectedToken(
    tokenAddress: string,
    type: WalkthroughSelectedTokens
  ) {
    if (
      type == WalkthroughSelectedTokens.CONVERT_IN ||
      type == WalkthroughSelectedTokens.BRIDGE_OUT
    ) {
      const token = bridgingTokens.userNativeTokens.find(
        (token) => token.address.toLowerCase() == tokenAddress.toLowerCase()
      );
      if (token) {
        setAmount(formatUnits(token.nativeBalance, token.decimals));
      }
    }
    setSelectedTokens((selectedTokens) => {
      return {
        ...selectedTokens,
        [type]: tokenAddress,
      };
    });
  }

  function findNativeToken(
    type:
      | WalkthroughSelectedTokens.CONVERT_IN
      | WalkthroughSelectedTokens.BRIDGE_OUT,
    fromList: UserNativeToken[]
  ) {
    return (
      fromList.find(
        (token) =>
          token.address.toLowerCase() == selectedTokens[type].toLowerCase()
      ) ?? EMPTY_NATIVE_TOKEN
    );
  }
  function findERC20Token(
    type:
      | WalkthroughSelectedTokens.CONVERT_OUT
      | WalkthroughSelectedTokens.ETH_BRIDGE_IN,
    fromList: UserERC20BridgeToken[]
  ) {
    return (
      fromList.find(
        (token) =>
          token.address.toLowerCase() == selectedTokens[type].toLowerCase()
      ) ?? EMPTY_ERC20_BRIDGE_TOKEN
    );
  }
  const allSelectedTokens = {
    bridgeInToken: findERC20Token(
      WalkthroughSelectedTokens.ETH_BRIDGE_IN,
      bridgingTokens.userBridgeInTokens
    ),
    convertInToken: findNativeToken(
      WalkthroughSelectedTokens.CONVERT_IN,
      bridgingTokens.userNativeTokens
    ),
    convertOutToken: findERC20Token(
      WalkthroughSelectedTokens.CONVERT_OUT,
      bridgingTokens.userBridgeOutTokens
    ),
    bridgeOutToken: findNativeToken(
      WalkthroughSelectedTokens.BRIDGE_OUT,
      bridgingTokens.userNativeTokens
    ),
  };
  //tx hooks for all transactions
  const transactionHooks = useBridgingTransactions();
  const [pubKeyStatus, setPubKeyStatus] = useState("None");

  //all transactions object
  const allTransactionsObject = {
    approve: transactionHooks.bridgeIn.approveToken(
      allSelectedTokens.bridgeInToken.address
    ),
    sendCosmos: transactionHooks.bridgeIn.sendToCosmos(
      ADDRESSES.ETHMainnet.GravityBridge,
      allSelectedTokens.bridgeInToken.address,
      networkInfo.cantoAddress
    ),
    convertIn: transactionHooks.convertCoin.convertTx(
      allSelectedTokens.convertInToken.ibcDenom,
      networkInfo.cantoAddress,
      true
    ),
    convertOut: transactionHooks.convertCoin.convertTx(
      allSelectedTokens.convertOutToken.address,
      networkInfo.cantoAddress,
      false
    ),
    bridgeOut: transactionHooks.bridgeOut.ibcOut(
      allSelectedTokens.bridgeOutToken.ibcDenom
    ),
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
        allSelectedTokens.bridgeInToken,
        convertStringToBigNumber(
          amount,
          allSelectedTokens.bridgeInToken.decimals
        ),
        allSelectedTokens.bridgeInToken.erc20Balance,
        "",
        completedBridgeInTxs,
        allSelectedTokens.convertInToken,
        allTransactionsObject.convertIn.state
      );
    } else if (currentType === "OUT") {
      return didPassBridgeOutWalkthroughCheck(
        walkthroughStore.bridgeOutStep,
        Number(networkInfo.chainId),
        allSelectedTokens.convertOutToken,
        convertStringToBigNumber(
          amount,
          allSelectedTokens.convertOutToken.decimals
        ),
        allSelectedTokens.convertOutToken.erc20Balance,
        allTransactionsObject.convertOut.state,
        selectedCosmoNetwork,
        allSelectedTokens.bridgeOutToken,
        allTransactionsObject.bridgeOut.state,
        userCosmosSendAddress
      );
    }
    return false;
  }

  //check if user has native balance to skip ahead
  function checkIfCanSkip(convertTokens: UserNativeToken[]) {
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
    for (const token of bridgingTokens.userNativeTokens) {
      if (token.nativeBalance.gt(0)) return true;
    }
    return false;
  };
  const canBridgeOut = () => {
    for (const token of bridgingTokens.userBridgeOutTokens) {
      if (token.erc20Balance.gt(0)) return true;
    }
    for (const token of bridgingTokens.userNativeTokens) {
      if (token.nativeBalance.gt(0)) return true;
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
      gravityAddress: ADDRESSES.ETHMainnet.GravityBridge,
    },
    tokens: {
      allUserTokens: {
        userBridgeInTokens: bridgingTokens.userBridgeInTokens,
        userBridgeOutTokens: bridgingTokens.userBridgeOutTokens,
        userNativeTokens: bridgingTokens.userNativeTokens,
      },
      selectedTokens: allSelectedTokens,
      setTokens: setSelectedToken,
    },
    walkthroughInfo: {
      canContinue: checkIfCanContinue(),
      canGoBack: checkIfCanClickPrevious(),
      canSkip: checkIfCanSkip(bridgingTokens.userNativeTokens),
      canBridgeIn: canBridgeIn(),
      canBridgeOut: canBridgeOut(),
    },
    transactions: allTransactionsObject,
    userInputs: {
      amount,
      setAmount,
      address: userCosmosSendAddress,
      setAddress: setUserCosmosSendAddress,
      selectedNetwork: ALL_BRIDGE_OUT_NETWORKS[selectedCosmoNetwork],
      setNetwork: setSelectedCosmosNetwork,
    },
  };
}
