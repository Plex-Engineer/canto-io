import styled from "@emotion/styled";
import loadingGif from "assets/loading.gif";
import completeIcon from "assets/complete.svg";
import warningIcon from "assets/warning.svg";
import close from "assets/icons/close.svg";
import { OutlinedButton, Text } from "global/packages/src";
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
      {transactionStore.transactions.map((transaction) => {
        return (
          <div key={transaction.txId}>
            <img
              src={
                transaction.status == "Success"
                  ? completeIcon
                  : transaction.status == "Fail" ||
                    transaction.status == "Exception"
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
              {transaction.currentMessage}
            </Text>
            <br />
            {transaction.blockExplorerLink ? (
              <OutlinedButton
                className="btn"
                onClick={() => {
                  Mixpanel.events.loadingModal.blockExplorerOpened(
                    transaction.hash
                  );
                  window.open(transaction.blockExplorerLink, "_blank");
                }}
              >
                open in block explorer
              </OutlinedButton>
            ) : null}
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
