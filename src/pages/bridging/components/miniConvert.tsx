import styled from "@emotion/styled";
import { formatUnits } from "ethers/lib/utils";
import Modal from "global/packages/src/components/molecules/Modal";
import { truncateNumber } from "global/utils/formattingNumbers";
import { useState } from "react";
import { convertSecondsToString, formatAddress } from "../utils/utils";
import ConfirmTxModal, {
  TokenWithIcon,
} from "global/components/modals/confirmTxModal";
import { getBridgeExtraDetails } from "./bridgeDetails";
import { PrimaryButton, Text } from "global/packages/src";
import { NativeTransaction } from "../config/bridgingInterfaces";

interface Props {
  transaction: NativeTransaction;
  cantoAddress: string;
  ethAddress: string;
  tx?: (...args: any[]) => void;
}
const MiniConvert = (props: Props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <Styled>
      <Modal
        title="confirmation"
        open={isModalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <ConfirmTxModal
          title={"Convert Coin"}
          titleIcon={TokenWithIcon({
            icon: props.transaction.token.icon,
            name: props.transaction.token.symbol,
          })}
          disableConfirm={false}
          extraInputs={[]}
          confirmationValues={[
            { title: "from", value: formatAddress(props.cantoAddress, 6) },
            {
              title: "to",
              value: formatAddress(props.ethAddress, 6),
            },
            {
              title: "amount",
              value:
                truncateNumber(
                  formatUnits(
                    props.transaction.amount,
                    props.transaction.token.decimals
                  )
                ) +
                " " +
                props.transaction.token.symbol,
            },
          ]}
          onConfirm={props.tx ?? (() => false)}
          extraDetails={getBridgeExtraDetails(
            true,
            true,
            formatAddress(props.cantoAddress, 6),
            formatAddress(props.ethAddress, 6)
          )}
          onClose={() => {
            setModalOpen(false);
          }}
        />
      </Modal>
      <div
        className="dual-item"
        style={{
          width: "120%",
        }}
      >
        <Text size="text3" align="left">
          origin
        </Text>
        <Text type="title" align="left">
          {props.transaction.origin}
        </Text>
      </div>

      <div className="dual-item">
        <Text size="text3" align="left">
          amount
        </Text>
        <Text type="title" align="left">
          {truncateNumber(
            formatUnits(
              props.transaction.amount,
              props.transaction.token.decimals
            )
          )}
          {" " + props.transaction.token.symbol}
        </Text>
      </div>
      {props.transaction.timeLeft != "0" && (
        <div className="dual-item">
          <Text size="text3" align="left">
            time left
          </Text>
          <Text type="title" align="left" size="text2">
            {convertSecondsToString(props.transaction.timeLeft)}
          </Text>
        </div>
      )}
      {props.transaction.timeLeft == "0" && (
        <div className="dual-item">
          <PrimaryButton
            style={{
              maxWidth: "7rem",
            }}
            height="normal"
            disabled={props.transaction.timeLeft !== "0"}
            weight="bold"
            filled
            onClick={() => setModalOpen(true)}
          >
            complete
          </PrimaryButton>
        </div>
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
  background-color: #010101;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;

  .dual-item {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .dual-item:last-child {
    max-width: 6rem;
  }
`;
export default MiniConvert;
