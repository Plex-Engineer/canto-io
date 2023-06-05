import styled from "@emotion/styled";
import loadingGif from "assets/loading.gif";
import completeIcon from "assets/complete.svg";
import warningIcon from "assets/warning.svg";
import close from "assets/icons/close.svg";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { Mixpanel } from "mixpanel";
import { useTransactionStore } from "global/stores/transactionStore";

interface LoadingProps {
  onClose: () => void;
}
const OngoingTxModal = (props: LoadingProps) => {
  const transactionStore = useTransactionStore();

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
      <Text type="title" size="title3" className="title">
        {transactionStore.txListTitle}
      </Text>
      <div className="scroll-view">
        {transactionStore.transactions.map((tx) => {
          return (
            <div key={tx.details.txId} className="tx">
              <img
                className="tx-icon"
                src={
                  tx.details.status == "Success"
                    ? completeIcon
                    : tx.details.status == "Fail" ||
                      tx.details.status == "Exception"
                    ? warningIcon
                    : loadingGif
                }
              />
              <Text
                size="text3"
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
                  onClick={() =>
                    transactionStore.performTxList(tx.details.txId)
                  }
                >
                  RETRY
                </PrimaryButton>
              )}
            </div>
          );
        })}
      </div>
    </Styled>
  ) : null;
};

const Styled = styled.div`
  position: absolute;
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
  }

  .tx {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #333;
    background-color: #111;
    border-radius: 4px;
    padding: 1rem;
    gap: 1rem;
  }
`;
export default OngoingTxModal;
