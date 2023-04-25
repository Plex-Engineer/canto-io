import styled from "@emotion/styled";
import { OutlinedButton, Text } from "global/packages/src";
import loadingGif from "assets/loading.gif";
import completeIcon from "assets/complete.svg";
import warningIcon from "assets/warning.svg";
import {
  getTransactionStatusString,
  transactionStatusActions,
} from "global/utils/utils";
import {
  CantoTransactionType,
  TransactionState,
} from "global/config/interfaces/transactionTypes";
import { ReactNode, useEffect, useState } from "react";
import close from "assets/icons/close.svg";
import { Mixpanel } from "mixpanel";

interface GlobalLoadingProps {
  transactionType: CantoTransactionType;
  status: TransactionState;
  tokenName?: string;
  customMessage?: string | ReactNode;
  additionalMessage?: string | ReactNode;
  txHash?: string;
  onClose: () => void;
  mixPanelEventInfo?: object;
}

const GlobalLoadingModal = (props: GlobalLoadingProps) => {
  const [txLogged, setTxLogged] = useState(false);
  const [txConfirmed, setTxConfirmed] = useState(false);
  const actionObj = transactionStatusActions(
    props.transactionType,
    props.tokenName
  );
  const currentStatus = getTransactionStatusString(
    actionObj.action,
    actionObj.inAction,
    actionObj.postAction,
    props.status
  );
  useEffect(() => {
    if (props.status == "PendingSignature" && !txLogged) {
      setTxLogged(true);
      Mixpanel.events.transactions.transactionStarted(
        props.transactionType,
        props.mixPanelEventInfo
      );
    }
    if (props.status == "Success" && !txConfirmed) {
      setTxConfirmed(true);
      Mixpanel.events.transactions.transactionSuccess(
        props.transactionType,
        props.txHash,
        props.mixPanelEventInfo
      );
    }
    if (
      (props.status == "Fail" || props.status == "Exception") &&
      !txConfirmed
    ) {
      setTxConfirmed(true);
      Mixpanel.events.transactions.transactionFailed(
        props.transactionType,
        props.txHash,
        currentStatus,
        props.mixPanelEventInfo
      );
    }
  }, [props.status]);

  return (
    <LoadingModal>
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          props.onClose();
        }}
      >
        <img
          src={close}
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            width: "40px",
            cursor: "pointer",
          }}
        />
      </div>
      <img
        src={
          props.status == "Success"
            ? completeIcon
            : props.status == "Fail" || props.status == "Exception"
            ? warningIcon
            : loadingGif
        }
        style={{
          marginBottom: "1rem",
        }}
        height={80}
        width={80}
      />
      <Text size="title2" type="title" style={{ marginBottom: "2rem" }}>
        {props.tokenName}
      </Text>
      <Text size="text1" type="text">
        {props.customMessage ?? currentStatus}
      </Text>
      <br />
      <Text size="text1" type="text">
        {props.additionalMessage}
      </Text>
      {props.txHash ? (
        <OutlinedButton
          className="btn"
          onClick={() => {
            Mixpanel.events.loadingModal.blockExplorerOpened(props.txHash);
            window.open("https://tuber.build/tx/" + props.txHash, "_blank");
          }}
        >
          open in block explorer
        </OutlinedButton>
      ) : null}
    </LoadingModal>
  );
};

const LoadingModal = styled.div`
  display: flex;
  background-color: black;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 2rem;
  .btn {
    margin-top: 2rem;
  }
`;
export default GlobalLoadingModal;
