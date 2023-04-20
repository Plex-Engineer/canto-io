import styled from "@emotion/styled";
import { formatUnits } from "ethers/lib/utils";
import { CantoTransactionType } from "global/config/transactionTypes";
import { PrimaryButton, Text } from "global/packages/src";
import Modal from "global/packages/src/components/molecules/Modal";
import { CantoMainnet } from "global/providers";
import { getShortTxStatusFromState, truncateNumber } from "global/utils/utils";
import { useEffect, useState } from "react";
import { ALL_BRIDGE_OUT_NETWORKS } from "../config/bridgeOutNetworks";
import { NativeTransaction } from "../config/interfaces";
import { BridgeTransaction } from "../hooks/useBridgingTransactions";
import {
  convertSecondsToString,
  formatAddress,
  toastBridgeTx,
} from "../utils/utils";
import ConfirmationModal from "./modals/confirmationModal";

interface Props {
  transaction: NativeTransaction;
  txFactory: () => BridgeTransaction;
  cantoAddress: string;
  ethAddress: string;
  recover: boolean;
}
const MiniTransaction = (props: Props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const txStats = props.txFactory();
  const isIBCTransfer = txStats.txType == CantoTransactionType.IBC_OUT;
  //just for ibc out
  const tokenNetworks = props.transaction.token.supportedOutChannels ?? [0];
  const [selectedNetwork, setSelectedNetwork] = useState<
    keyof typeof ALL_BRIDGE_OUT_NETWORKS
  >(tokenNetworks ? tokenNetworks[0] : 0);

  useEffect(() => {
    toastBridgeTx(txStats.state, txStats.txName);
  }, [txStats.state]);

  return (
    <Styled>
      <Modal
        title="confirmation"
        open={isModalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <ConfirmationModal
          amount={props.transaction.amount}
          token={props.transaction.token}
          tx={txStats}
          from={{
            chain: "canto bridge",
            address: props.cantoAddress,
            chainId: CantoMainnet.chainId,
          }}
          to={{
            chain: isIBCTransfer
              ? ALL_BRIDGE_OUT_NETWORKS[selectedNetwork].name
              : "canto",
            address: isIBCTransfer ? "" : props.ethAddress,
          }}
          ibcTo={ALL_BRIDGE_OUT_NETWORKS[selectedNetwork]}
          onClose={() => {
            setModalOpen(false);
          }}
          extraDetails={
            isIBCTransfer ? (
              <>
                {`by completing bridge out, you are transferring your assets from your canto native address (${formatAddress(
                  props.cantoAddress,
                  6
                )}) to your address on the ${
                  ALL_BRIDGE_OUT_NETWORKS[selectedNetwork].name
                } network. `}
                Read more about this{" "}
                <a
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    window.open(
                      "https://docs.canto.io/user-guides/bridging-assets/from-canto",
                      "_blank"
                    )
                  }
                  style={{
                    color: "var(--primary-color)",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  here.
                </a>{" "}
              </>
            ) : (
              <>
                {`by completing bridge in, you are transferring your assets from your canto native address (${formatAddress(
                  props.cantoAddress,
                  6
                )}) to your canto EVM address (${formatAddress(
                  props.ethAddress,
                  6
                )}). `}
                Read more about this{" "}
                <a
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    window.open(
                      "https://docs.canto.io/user-guides/converting-assets",
                      "_blank"
                    )
                  }
                  style={{
                    color: "var(--primary-color)",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  here.
                </a>{" "}
              </>
            )
          }
        />
      </Modal>

      <div
        className="dual-item"
        style={{
          width: "120%",
        }}
      >
        <Text size="text3" align="left">
          {props.recover ? "denom" : isIBCTransfer ? "destination" : "origin"}
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
      {isIBCTransfer &&
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
                          ALL_BRIDGE_OUT_NETWORKS[
                            network as keyof typeof ALL_BRIDGE_OUT_NETWORKS
                          ].icon
                        }
                        alt=""
                      />
                      <p>
                        {
                          ALL_BRIDGE_OUT_NETWORKS[
                            network as keyof typeof ALL_BRIDGE_OUT_NETWORKS
                          ].name
                        }
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
            onClick={() => {
              if (txStats.state == "Exception" || txStats.state == "Fail")
                txStats.resetState();
              setModalOpen(true);
            }}
          >
            {getShortTxStatusFromState(txStats.state)}
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
    scrollbar-color: var(--primary-color);
    scroll-behavior: smooth;
    /* width */
    padding: 8px;
    max-height: 100px;
    overflow-y: scroll;
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
