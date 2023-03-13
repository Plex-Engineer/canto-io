import styled from "@emotion/styled";
import { formatUnits } from "ethers/lib/utils";
import GlobalLoadingModal from "global/components/modals/loadingModal";
import { CantoTransactionType } from "global/config/transactionTypes";
import { PrimaryButton, Text } from "global/packages/src";
import Modal from "global/packages/src/components/molecules/Modal";
import { CantoMainnet } from "global/providers";
import { formatBalance } from "global/utils/utils";
import { useState } from "react";
import { ConvertTransaction } from "../config/interfaces";
import { BridgeTransaction } from "../hooks/useBridgingTransactions";
import { convertSecondsToString } from "../utils/utils";
import ConfirmationModal from "./modals/confirmationModal";

interface Props {
  transaction: ConvertTransaction;
  txFactory: () => BridgeTransaction;
}
const MiniTransaction = (props: Props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const txStats = props.txFactory();

  function getTxStatus(): string {
    switch (txStats.state) {
      case "None":
        return "complete";
      case "Mining":
        return "ongoing";
      case "PendingSignature":
        return "signing";
      case "Success":
        return "done";
      case "Exception":
      case "Fail":
        return "error";
      default:
        return "complete";
    }
  }

  return (
    <Styled>
      <Modal
        title="confirmation"
        open={isModalOpen}
        onClose={() => {
          if (txStats.state != "Mining" && txStats.state != "PendingSignature")
            txStats.resetState();
          setModalOpen(false);
        }}
      >
        <ConfirmationModal
          networkID={CantoMainnet.chainId}
          activeToken={props.transaction}
          state={txStats.state}
          onConfirm={() => {
            txStats.send(props.transaction.amount.toString());
          }}
        />
      </Modal>

      <div className="dual-item">
        <Text size="text3" align="left">
          origin
        </Text>
        <Text type="title">{props.transaction.origin}</Text>
      </div>

      {props.transaction.timeLeft != "0" && (
        <div className="dual-item">
          <Text size="text3" align="left">
            time left
          </Text>
          <Text type="title" size="text2">
            {convertSecondsToString(props.transaction.timeLeft)}
          </Text>
        </div>
      )}
      <div className="dual-item">
        <Text size="text3" align="left">
          amount
        </Text>
        <Text type="title">
          {formatBalance(
            formatUnits(
              props.transaction.amount,
              props.transaction.token.decimals
            )
          )}
          {" " + props.transaction.token.symbol}
        </Text>
      </div>
      {props.transaction.timeLeft == "0" && (
        <PrimaryButton
          style={{
            maxWidth: "7rem",
          }}
          height="normal"
          disabled={props.transaction.timeLeft !== "0"}
          weight="bold"
          filled
          onClick={() => {
            setModalOpen(true);
          }}
        >
          {props.transaction.timeLeft !== "0" ? "ongoing" : getTxStatus()}
        </PrimaryButton>
      )}
    </Styled>
  );
};

const Styled = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  padding: 0 16px;
  justify-content: space-between;
  align-items: center;
  background: #010101;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
`;

export default MiniTransaction;
