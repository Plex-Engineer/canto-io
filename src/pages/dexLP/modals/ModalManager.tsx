import useModals, { ModalType } from "../hooks/useModals";
import AddModal from "./addModal";
import RemoveModal from "./removeModal";
import AddRemoveModal from "./addRemove";
import { RemoveLiquidityConfirmation } from "./removeConfirmation";
import { AddLiquidityConfirmation } from "./addConfirmation";
import { useEffect } from "react";
import { Mixpanel } from "mixpanel";
import Modal from "global/packages/src/components/molecules/Modal";
import OngoingTxModal from "global/components/modals/ongoingTxModal";
import { TransactionStore } from "global/stores/transactionStore";

interface Props {
  onClose: () => void;
  txStore: TransactionStore;
  chainId?: number;
  account?: string;
}

const ModalManager = (props: Props) => {
  const [modalType, activePair, confirmValues, setModal, setConfirmation] =
    useModals((state) => [
      state.modalType,
      state.activePair,
      state.confirmationValues,
      state.setModalType,
      state.setConfirmationValues,
    ]);

  function getTitle(modalType: ModalType): string | undefined {
    switch (modalType) {
      case ModalType.ADD:
        return "Add Liquidity";
      case ModalType.REMOVE:
        return "Remove Liquidity";
      case ModalType.ADD_OR_REMOVE:
        return "Liquidity";
      default:
        return "Confirmation";
    }
  }
  useEffect(() => {
    if (modalType !== ModalType.NONE) {
      Mixpanel.events.lpInterfaceActions.modalInteraction(
        modalType,
        activePair.basePairInfo.token1.symbol +
          " / " +
          activePair.basePairInfo.token2.symbol,
        true
      );
    }
  }, [modalType]);

  return (
    <Modal
      open={modalType != ModalType.NONE}
      title={props.txStore.modalOpen ? "" : getTitle(modalType)}
      onClose={() => {
        Mixpanel.events.lpInterfaceActions.modalInteraction(
          modalType,
          activePair.basePairInfo.token1.symbol +
            " / " +
            activePair.basePairInfo.token2.symbol,
          false
        );
        props.onClose();
      }}
    >
      <OngoingTxModal onClose={props.onClose} />
      {modalType === ModalType.ADD && (
        <AddModal
          onClose={props.onClose}
          activePair={activePair}
          setModalType={setModal}
          setConfirmationValues={setConfirmation}
        />
      )}
      {modalType === ModalType.REMOVE && (
        <RemoveModal
          onClose={props.onClose}
          activePair={activePair}
          setModalType={setModal}
          setConfirmationValues={setConfirmation}
        />
      )}
      {modalType === ModalType.ADD_OR_REMOVE && (
        <AddRemoveModal
          onClose={props.onClose}
          activePair={activePair}
          setModalType={setModal}
        />
      )}
      {modalType === ModalType.REMOVE_CONFIRM && (
        <RemoveLiquidityConfirmation
          onClose={props.onClose}
          activePair={activePair}
          chainId={props.chainId}
          account={props.account}
          confirmValues={confirmValues}
          txStore={props.txStore}
        />
      )}
      {modalType === ModalType.ADD_CONFIRM && (
        <AddLiquidityConfirmation
          onClose={props.onClose}
          activePair={activePair}
          chainId={props.chainId}
          account={props.account}
          confirmValues={confirmValues}
          txStore={props.txStore}
        />
      )}
    </Modal>
  );
};

export { ModalManager };
