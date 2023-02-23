import styled from "@emotion/styled";
import Popup from "reactjs-popup";
import useModals, { ModalType } from "../hooks/useModals";
import close from "assets/close.svg";
import AddModal from "./addModal";
import RemoveModal from "./removeModal";
import AddRemoveModal from "./addRemove";
import { RemoveLiquidityConfirmation } from "./removeConfirmation";
import { AddLiquidityConfirmation } from "./addConfirmation";
import EnableModal from "./enableModal";
import { useEffect } from "react";
import { Mixpanel } from "mixpanel";
import Modal from "global/packages/src/components/molecules/Modal";

const StyledPopup = styled(Popup)`
  // use your custom style for ".popup-overlay"

  &-overlay {
    background-color: #17271c6d;
    backdrop-filter: blur(2px);
    z-index: 10;
  }
  // use your custom style for ".popup-content"
  &-content {
    position: relative;
    overflow-y: hidden;
    overflow-x: hidden;
    background-color: black;
    scroll-behavior: smooth;
    /* width */

    @media (max-width: 1000px) {
      width: 100%;
    }
  }
`;

interface Props {
  onClose: () => void;
  chainId?: number;
  account?: string;
}

const ModalManager = (props: Props) => {
  const [modalType, activePair] = useModals((state) => [
    state.modalType,
    state.activePair,
  ]);

  function getTitle(modalType: ModalType): string | undefined {
    switch (modalType) {
      case ModalType.ENABLE:
        return "";
      case ModalType.ADD:
        return "Add Liquidity";
      case ModalType.REMOVE:
        return "Remove Liquidity";
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
