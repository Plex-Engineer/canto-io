import styled from "@emotion/styled";
import TokenModal from "pages/bridge/components/tokenModal";
import Popup from "reactjs-popup";
import useGlobalModals, { ModalType } from "../../stores/useModals";
import TokensModal from "./TokensModal";

const ModalManager = () => {
  const [modalType, setModalType] = useGlobalModals((state) => [
    state.modalType,
    state.setModalType,
  ]);
  return (
    <StyledPopup
      open={modalType != ModalType.NONE}
      onClose={() => {
        setModalType(ModalType.NONE);
      }}
      lockScroll
      modal
      position="center center"
      nested
    >
      {modalType === ModalType.TOKENS && <TokensModal />}
    </StyledPopup>
  );
};
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
export default ModalManager;
