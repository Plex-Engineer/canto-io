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
} from "global/config/transactionTypes";

interface GlobalLoadingProps {
  transactionType: CantoTransactionType;
  status: TransactionState;
  tokenName?: string;
  customMessage?: string;
  txHash?: string;
}

const GlobalLoadingModal = (props: GlobalLoadingProps) => {
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
  return (
    <LoadingModal>
      <img
        src={
          props.status == "Success"
            ? completeIcon
            : props.status == "Fail" || props.status == "Exception"
            ? warningIcon
            : loadingGif
        }
        height={100}
        width={100}
      />
      <Text size="title2" type="title" style={{ marginBottom: "2rem" }}>
        {props.tokenName}
      </Text>
      <Text size="text1" type="text">
        {props.customMessage ?? currentStatus}
      </Text>
      {props.txHash ? (
        <OutlinedButton
          className="btn"
          onClick={() => {
            window.open(
              "https://evm.explorer.canto.io/tx/" + props.txHash,
              "_blank"
            );
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
  z-index: 3;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .btn {
    margin-top: 2rem;
  }
`;
export default GlobalLoadingModal;
