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
            top: "0.5rem",
            right: "0.5rem",
            width: "40px",
            cursor: "pointer",
          }}
        />
      </div>
      {transactionStore.transactions.map((tx) => {
        return (
          <div key={tx.details.txId}>
            <img
              src={
                tx.details.status == "Success"
                  ? completeIcon
                  : tx.details.status == "Fail" ||
                    tx.details.status == "Exception"
                  ? warningIcon
                  : loadingGif
              }
              style={{
                marginBottom: "1rem",
              }}
              height={80}
              width={80}
            />
            <Text size="text1" type="text">
              {tx.details.currentMessage}
            </Text>
            <br />
            {tx.details.blockExplorerLink ? (
              <OutlinedButton
                className="btn"
                onClick={() => {
                  Mixpanel.events.loadingModal.blockExplorerOpened(
                    tx.details.hash
                  );
                  window.open(tx.details.blockExplorerLink, "_blank");
                }}
              >
                open in block explorer
              </OutlinedButton>
            ) : null}
            {tx.details.status === "Fail" && (
              <PrimaryButton
                onClick={() => transactionStore.performTxList(tx.details.txId)}
              >
                RETRY
              </PrimaryButton>
            )}
          </div>
        );
      })}
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
  justify-content: center;
  align-items: center;
  padding: 0 2rem;
  .btn {
    margin-top: 2rem;
  }
`;
export default OngoingTxModal;
