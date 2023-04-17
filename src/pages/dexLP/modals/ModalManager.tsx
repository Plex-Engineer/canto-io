import useModals, { ModalType } from "../hooks/useModals";
import AddModal from "./addModal";
import RemoveModal from "./removeModal";
import AddRemoveModal from "./addRemove";
import { RemoveLiquidityConfirmation } from "./removeConfirmation";
import { AddLiquidityConfirmation } from "./addConfirmation";
import EnableModal from "./enableModal";
import { useEffect } from "react";
import { Mixpanel } from "mixpanel";
import Modal from "global/packages/src/components/molecules/Modal";

interface Props {
  onClose: () => void;
  chainId?: number;
  account?: string;
}

const ModalManager = (props: Props) => {
  const [modalType, activePair, setModalType] = useModals((state) => [
    state.modalType,
    state.activePair,
    state.setModalType,
  ]);

  function getTitle(modalType: ModalType): string | undefined {
    switch (modalType) {
      case ModalType.ENABLE:
        return "";
      case ModalType.ADD:
        return "Add Liquidity";
      case ModalType.REMOVE:
        return "Remove Liquidity";
      case ModalType.ADD_OR_REMOVE:
        return "Liquidity";
      case ModalType.REMOVE_CONFIRM:
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
      title={getTitle(modalType)}
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
      {modalType === ModalType.ENABLE && (
        <EnableModal
          onClose={props.onClose}
          activePair={activePair}
          chainId={props.chainId}
          account={props.account}
          setModal={setModalType}
        />
      )}
      {modalType === ModalType.ADD && (
        <AddModal
          onClose={props.onClose}
          activePair={activePair}
          chainId={props.chainId}
          account={props.account}
        />
      )}
      {modalType === ModalType.REMOVE && (
        <RemoveModal
          onClose={props.onClose}
          activePair={activePair}
          chainId={props.chainId}
          account={props.account}
        />
      )}
      {modalType === ModalType.ADD_OR_REMOVE && (
        <AddRemoveModal
          onClose={props.onClose}
          activePair={activePair}
          chainId={props.chainId}
          account={props.account}
        />
      )}
      {modalType === ModalType.REMOVE_CONFIRM && (
        <RemoveLiquidityConfirmation
          onClose={props.onClose}
          activePair={activePair}
          chainId={props.chainId}
          account={props.account}
        />
      )}
      {modalType === ModalType.ADD_CONFIRM && (
        <AddLiquidityConfirmation
          onClose={props.onClose}
          activePair={activePair}
          chainId={props.chainId}
          account={props.account}
        />
      )}
    </Modal>
  );
};

export { ModalManager };
