import styled from "@emotion/styled";
import { formatUnits } from "ethers/lib/utils";
import { PrimaryButton, Text } from "global/packages/src";
import Modal from "global/packages/src/components/molecules/Modal";
import { truncateNumber } from "global/utils/formattingNumbers";
import { useState } from "react";
import { BridgeNetworkPair, NativeTransaction } from "../config/interfaces";
import { convertSecondsToString, formatAddress } from "../utils/utils";
import ConfirmTxModal, {
  TokenWithIcon,
} from "global/components/modals/confirmTxModal";
import { getBridgeExtraDetails } from "./bridgeDetails";
import OngoingTxModal from "global/components/modals/ongoingTxModal";

interface Props {
  transaction: NativeTransaction;
  cantoAddress: string;
  ethAddress: string;
  recover: boolean;
  isIBCTransfer: boolean;
  correctChainId: number;
  tx?: (...args: any[]) => void;
  networkPair: BridgeNetworkPair;
}
const MiniTransaction = (props: Props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  //just for ibc out
  const tokenNetworks = props.transaction.token.supportedOutChannels ?? [0];
  const allNetworks = props.networkPair.receiving.bridgeOutNetworks;

  const [selectedNetwork, setSelectedNetwork] = useState<
    keyof typeof allNetworks
  >(tokenNetworks ? tokenNetworks[0] : 0);
  const [userInputAddress, setUserInputAddress] = useState("");

  return (
    <Styled>
      <Modal
        title="confirmation"
        open={isModalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <OngoingTxModal onClose={() => setModalOpen(false)} />
        <ConfirmTxModal
          networkId={props.correctChainId}
          title={"CONFIRMATION"}
          titleIcon={TokenWithIcon({
            icon: props.transaction.token.icon,
            name: props.transaction.token.symbol,
          })}
          confirmationValues={[
            { title: "from", value: formatAddress(props.cantoAddress, 6) },
            {
              title: "to",
              value: props.isIBCTransfer
                ? formatAddress(userInputAddress, 6)
                : formatAddress(props.ethAddress, 6),
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
          extraInputs={
            props.isIBCTransfer
              ? [
                  {
                    header: "address",
                    placeholder:
                      allNetworks[selectedNetwork].addressBeginning + "1...",
                    value: userInputAddress,
                    setValue: setUserInputAddress,
                  },
                ]
              : []
          }
          disableConfirm={
            props.isIBCTransfer &&
            !allNetworks[selectedNetwork].checkAddress(userInputAddress)
          }
          onConfirm={() => {
            props.isIBCTransfer
              ? props.tx?.(allNetworks[selectedNetwork], userInputAddress)
              : props.tx?.();
          }}
          extraDetails={getBridgeExtraDetails(
            !props.isIBCTransfer,
            true,
            formatAddress(props.cantoAddress, 6),
            !props.isIBCTransfer
              ? formatAddress(props.ethAddress, 6)
              : allNetworks[selectedNetwork].name
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
          {props.recover
            ? "denom"
            : props.isIBCTransfer
            ? "destination"
            : "origin"}
        </Text>
        <Text type="title" align="left">
          {props.recover
            ? props.transaction.token.name.slice(0, 7) + "..."
            : props.transaction.origin}
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
          {props.recover ? "" : " " + props.transaction.token.symbol}
        </Text>
      </div>
      {props.isIBCTransfer &&
        props.transaction.token.supportedOutChannels.length > 1 && (
          <ChooseNetwork>
            <div className="network-list">
              {props.transaction.token.supportedOutChannels.map(
                (key, network) => (
                  <div
                    role="button"
                    tabIndex={0}
                    key={key}
                    className="network-item"
                    onClick={() => {
                      setSelectedNetwork(network);
                    }}
                    style={{
                      background: selectedNetwork === network ? "#F2F2F2" : "",
                    }}
                  >
                    <span>
                      <img
                        src={
                          allNetworks[network as keyof typeof allNetworks].icon
                        }
                        alt=""
                      />
                      <p>
                        {allNetworks[network as keyof typeof allNetworks].name}
                      </p>
                    </span>
                  </div>
                )
              )}
            </div>
          </ChooseNetwork>
        )}
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
const ChooseNetwork = styled.div`
  .network-list {
    /* scrollbar-color: var(--primary-color); */
    scroll-behavior: smooth;
    /* width */
    padding: 8px;
    max-height: 100px;
    overflow-y: auto;
    .network-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 400;
      font-size: 18px;
      letter-spacing: -0.02em;
      height: 38px;
      padding: 0 14px;
      outline: none;
      cursor: pointer;
      img {
        margin: 6px;
        height: 18px;
        width: 18px;
      }
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }
    }
  }
  p {
    font-size: 16px;
    font-weight: 500;
    line-height: 21px;
    letter-spacing: -0.03em;
    color: var(--primary-color);
  }
  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

export default MiniTransaction;
