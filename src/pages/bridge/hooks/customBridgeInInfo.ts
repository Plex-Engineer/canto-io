import { TransactionState } from "@usedapp/core";
import { BigNumber, ethers } from "ethers";
import { ADDRESSES } from "global/config/addresses";
import { CantoTransactionType } from "global/config/transactionTypes";
import { useNetworkInfo } from "global/stores/networkInfo";
import { Mixpanel } from "mixpanel";
import { useEffect, useState } from "react";
import { BaseToken, UserGravityBridgeTokens } from "../config/interfaces";
import { useBridgeStore } from "../stores/gravityStore";
import { SelectedTokens } from "../stores/tokenStore";
import useBridgeTxStore from "../stores/transactionStore";
import { getReactiveButtonText } from "../utils/reactiveButtonText";
import { convertStringToBigNumber } from "../utils/stringToBigNumber";
import { useApprove, useCosmos } from "./useTransactions";

interface CustomBridgeInInfo {
  amount: string;
  setAmount: (amount: string) => void;
  bridgeButtonText: string;
  bridgeDisabled: boolean;
  stateApprove: TransactionState;
  stateCosmos: TransactionState;
  sendEthToGBridge: (amount: string) => void;
  resetApprove: () => void;
  resetCosmos: () => void;
}

export function useBridgeEthToCantoInfo(
  selectedETHToken: UserGravityBridgeTokens,
  setToken: (token: BaseToken, selectedFrom: SelectedTokens) => void,
  gravityAddress?: string
): CustomBridgeInInfo {
  const networkInfo = useNetworkInfo();
  const bridgeTxStore = useBridgeTxStore();
  const bridgeStore = useBridgeStore();

  const [amount, setAmount] = useState<string>("");

  //function states for approving/bridging
  const {
    state: stateApprove,
    send: sendApprove,
    resetState: resetApprove,
  } = useApprove(selectedETHToken.address);
  const {
    state: stateCosmos,
    send: sendCosmos,
    resetState: resetCosmos,
  } = useCosmos(gravityAddress ?? ADDRESSES.ETHMainnet.GravityBridge);

  const [bridgeButtonText, bridgeDisabled] = getReactiveButtonText(
    networkInfo.hasPubKey,
    convertStringToBigNumber(amount, selectedETHToken?.decimals ?? 18),
    selectedETHToken,
    stateApprove.status,
    stateCosmos.status
  );

  const send = (amount: string) => {
    //Checking if amount enter is greater than balance available in wallet and token has been approved.
    const parsedAmount = convertStringToBigNumber(
      amount,
      selectedETHToken.decimals
    );
    if (!networkInfo.cantoAddress) return;
    if (
      (parsedAmount.gte(selectedETHToken.allowance) ||
        selectedETHToken.allowance.lte(0)) &&
      stateApprove.status == "None"
    ) {
      mixpanelTrack(CantoTransactionType.ENABLE);
      sendApprove(
        gravityAddress,
        BigNumber.from(
          "115792089237316195423570985008687907853269984665640564039457584007913129639935"
        )
      );
    } else if (parsedAmount.gt(0)) {
      mixpanelTrack(CantoTransactionType.BRIDGE_IN);
      sendCosmos(
        selectedETHToken.address,
        networkInfo.cantoAddress,
        parsedAmount
      );
    }
  };

  //reset the status of the tx when the loading modal is closed to keep the reactive button from being stuck
  useEffect(() => {
    if (!bridgeTxStore.transactionStatus) {
      resetCosmos();
    }
  }, [bridgeTxStore.transactionStatus?.status]);

  //event tracker
  useEffect(() => {
    bridgeStore.setApproveStatus(stateApprove.status);
    if (stateApprove.status == "Success") {
      setToken(
        {
          ...selectedETHToken,
          allowance: BigNumber.from(ethers.constants.MaxUint256),
        },
        SelectedTokens.ETHTOKEN
      );
      setTimeout(() => {
        resetApprove();
      }, 1000);
    }
  }, [stateApprove]);

  function mixpanelTrack(txType: CantoTransactionType) {
    Mixpanel.events.transactions.transactionStarted(txType, {
      tokenName: selectedETHToken.symbol,
      amount: amount,
    });
  }

  return {
    amount,
    setAmount,
    bridgeButtonText,
    bridgeDisabled,
    sendEthToGBridge: send,
    stateApprove: stateApprove.status,
    stateCosmos: stateCosmos.status,
    resetApprove,
    resetCosmos,
  };
}
