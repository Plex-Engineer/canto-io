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
    border: 1px solid var(--primary-color);
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
  return (
    <StyledPopup
      open={modalType != ModalType.NONE}
      onClose={() => {
        props.onClose();
        //   Mixpanel.events.lendingMarketActions.modalInteraction(
        //     "addd",
        //     props.modalType.toString(),
        //     "name",
        //     false
        //   );
      }}
      lockScroll
      modal
      position="center center"
      nested
    >
      <div role="button" tabIndex={0} onClick={props.onClose}>
        <img
          src={close}
          style={{
            position: "absolute",
            top: ".5rem",
            right: ".5rem",
            width: "40px",
            cursor: "pointer",
            zIndex: "6",
          }}
          alt="close"
        />
      </div>

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
    </StyledPopup>
  );
};

export { ModalManager };
