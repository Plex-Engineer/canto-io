import styled from "@emotion/styled";
import loadingGif from "assets/loading.gif";
import completeIcon from "assets/complete.svg";
import warningIcon from "assets/warning.svg";
import close from "assets/icons/close.svg";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { Mixpanel } from "mixpanel";
import { useTransactionStore } from "global/stores/transactionStore";
import { useNetworkInfo } from "global/stores/networkInfo";
import { useEthers } from "@usedapp/core";
import OutsideAlerter from "./modalUtils";
import { GenPubKeyWalkthrough } from "pages/bridging/walkthrough/components/pages/genPubKey";
import { useEffect, useState } from "react";
interface LoadingProps {
  onClose: () => void;
}
const OngoingTxModal = (props: LoadingProps) => {
  const transactionStore = useTransactionStore();
  const { switchNetwork } = useEthers();
  const chainId = useNetworkInfo((state) => state.chainId);
  //only if we need pub key
  const [pubKeySuccess, setPubKeySuccess] = useState("None");
  useEffect(() => {
    //check if the error was pub key
    if (
      transactionStore.status.error == "public key" &&
      pubKeySuccess == "Success"
    ) {
      transactionStore.performTxList();
    }
  }, [pubKeySuccess]);

  //   useEffect(() => {
  //     if (props.status == "PendingSignature" && !txLogged) {
  //       setTxLogged(true);
  //       Mixpanel.events.transactions.transactionStarted(
  //         props.transactionType,
  //         props.mixPanelEventInfo
  //       );
  //     }
  //     if (props.status == "Success" && !txConfirmed) {
  //       setTxConfirmed(true);
  //       Mixpanel.events.transactions.transactionSuccess(
  //         props.transactionType,
  //         props.txHash,
  //         props.mixPanelEventInfo
  //       );
  //     }
  //     if (
  //       (props.status == "Fail" || props.status == "Exception") &&
  //       !txConfirmed
  //     ) {
  //       setTxConfirmed(true);
  //       Mixpanel.events.transactions.transactionFailed(
  //         props.transactionType,
  //         props.txHash,
  //         currentStatus,
  //         props.mixPanelEventInfo
  //       );
  //     }
  //   }, [props.status]);

  return transactionStore.modalOpen ? (
    <OutsideAlerter
      onClickOutside={() => {
        transactionStore.setModalOpen(false);
        props.onClose();
      }}
    >
      <Styled>
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            transactionStore.setModalOpen(false);
            props.onClose();
          }}
        >
          <img
            src={close}
            style={{
              position: "absolute",
              top: "1.4rem",
              right: "1.4rem",
              width: "30px",
              cursor: "pointer",
            }}
          />
        </div>
        {transactionStore.status?.error && (
          <div className="network-change">
            {transactionStore.status?.error == "public key" ? (
              <GenPubKeyWalkthrough
                pubKeySuccess={pubKeySuccess}
                setPubKeySuccess={setPubKeySuccess}
              />
            ) : (
              <Text type="title">{transactionStore.status?.error}</Text>
            )}
          </div>
        )}
        {chainId != transactionStore.txListProps?.chainId &&
          !transactionStore.status?.error &&
          transactionStore.txListProps?.chainId && (
            <div className="network-change">
              <Text type="title">Oops, you seem to be on a wrong network.</Text>
              <PrimaryButton
                onClick={() => {
                  switchNetwork(transactionStore.txListProps?.chainId ?? 1);
                }}
              >
                Switch Network
              </PrimaryButton>
            </div>
          )}
        {transactionStore.status.loading && (
          <div className="network-change">
            <Text type="title">loading</Text>
          </div>
        )}
        {chainId == transactionStore.txListProps?.chainId &&
          !transactionStore.status?.error &&
          !transactionStore.status.loading && (
            <>
              <Text type="title" size="title3" className="title">
                {transactionStore.txListProps?.title}
              </Text>
              <div className="scroll-view">
                {transactionStore.transactions.map((tx, idx) => {
                  return (
                    <div
                      key={tx.details.txId}
                      className={
                        tx.details.status == "Success"
                          ? "tx-item tx-item-complete"
                          : "tx-item "
                      }
                    >
                      <div className="tx-icon">
                        {tx.details.status == "None" ? (
                          <Text size="text1" type="title">
                            {idx + 1}
                          </Text>
                        ) : (
                          <img
                            src={
                              tx.details.status == "Success"
                                ? completeIcon
                                : tx.details.status == "Fail" ||
                                  tx.details.status == "Exception"
                                ? warningIcon
                                : loadingGif
                            }
                          />
                        )}
                      </div>
                      <Text
                        size="text3"
                        bold
                        style={{
                          flexGrow: 2,
                        }}
                      >
                        {tx.details.currentMessage}
                      </Text>
                      {tx.details.blockExplorerLink ? (
                        <OutlinedButton
                          height="small"
                          onClick={() => {
                            Mixpanel.events.loadingModal.blockExplorerOpened(
                              tx.details.hash
                            );
                            window.open(tx.details.blockExplorerLink, "_blank");
                          }}
                        >
                          <Text size="text3">view</Text>
                        </OutlinedButton>
                      ) : null}
                      {tx.details.status === "Fail" && (
                        <PrimaryButton
                          weight="bold"
                          onClick={() =>
                            transactionStore.performTxList(tx.details.txId)
                          }
                        >
                          retry
                        </PrimaryButton>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
      </Styled>
    </OutsideAlerter>
  ) : null;
};

const Styled = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  background-color: black;
  height: 100%;
  width: 100%;
  z-index: 10;
  flex-direction: column;
  align-items: center;
  padding: 0 2rem;

  .tx-icon {
    height: 50px;
    width: 50px;
    border: 1px solid #333;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      height: 50px;
      width: 50px;
      border: 1px solid #333;
      border-radius: 4px;
    }
  }

  .title {
    margin: 1.3rem;
  }

  .scroll-view {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 4rem;
    gap: 2rem;
    width: 100%;
  }

  .tx-item {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #333;
    background-color: #111;
    border-radius: 4px;
    padding: 1rem;
    gap: 1rem;
  }

  .tx-item-complete {
    opacity: 0.7;
    background-color: black;
  }

  .network-change {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    height: 100%;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
  }
`;
export default OngoingTxModal;
