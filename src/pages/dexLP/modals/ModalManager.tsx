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
    &::-webkit-scrollbar {
      width: 4px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: #151515;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      box-shadow: inset 2 2 5px var(--primary-color);
      background: #111111;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #07e48c;
    }

    & {
      overflow-y: auto;
    }
    &:hover::-webkit-scrollbar-thumb {
      background: #353535;
    }

    @media (max-width: 1000px) {
      width: 100%;
    }
  }
`;

interface Props {
  onClose: () => void;
  data?: any;
  chainId?: number;
  account?: string;
}

const ModalManager = (props: Props) => {
  const modalType = useModals((state) => state.modalType);
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
        onClick={props.onClose}
      />

      {modalType === ModalType.ENABLE && (
        <EnableModal
          onClose={props.onClose}
          value={props.data}
          chainId={props.chainId}
          account={props.account}
        />
      )}
      {modalType === ModalType.ADD && (
        <AddModal
          onClose={props.onClose}
          value={props.data}
          chainId={props.chainId}
          account={props.account}
        />
      )}
      {modalType === ModalType.REMOVE && (
        <RemoveModal
          onClose={props.onClose}
          value={props.data}
          chainId={props.chainId}
          account={props.account}
        />
      )}
      {modalType === ModalType.ADD_OR_REMOVE && (
        <AddRemoveModal
          onClose={props.onClose}
          value={props.data}
          chainId={props.chainId}
          account={props.account}
        />
      )}
      {modalType === ModalType.REMOVE_CONFIRM && (
        <RemoveLiquidityConfirmation
          onClose={props.onClose}
          value={props.data}
          chainId={props.chainId}
          account={props.account}
        />
      )}
      {modalType === ModalType.ADD_CONFIRM && (
        <AddLiquidityConfirmation
          onClose={props.onClose}
          value={props.data}
          chainId={props.chainId}
          account={props.account}
        />
      )}
    </StyledPopup>
  );
};

export { ModalManager };
