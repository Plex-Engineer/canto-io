import Popup from "reactjs-popup";
import styled from "styled-components";
import WalletModal from "./walletModal";
import close from "assets/close.svg";
import CollatModal from "./enableCollateral";
import SupplyModal from "./supplyModal";
import BorrowModal from ".//borrowModal";
import { Mixpanel } from "mixpanel";
import RewardsModal from "./rewardsModal";
import useModalStore, { ModalType } from "pages/lending/stores/useModals";
const StyledPopup = styled(Popup)`
  // use your custom style for ".popup-overlay"
  &-overlay {
    background-color: #1f4a2c6e;
    backdrop-filter: blur(2px);
    z-index: 10;
  }
  // use your custom style for ".popup-content"
  &-content {
    /* height: 400px; */
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
  }
`;

interface Props {
  isOpen: boolean;
}

const ModalManager = ({ isOpen }: Props) => {
  const modalStore = useModalStore();

  if (modalStore.currentModal !== ModalType.NONE && modalStore.activeToken) {
    Mixpanel.events.lendingMarketActions.modalInteraction(
      modalStore.activeToken.wallet ?? "",
      modalStore.currentModal.toString(),
      modalStore.activeToken.data.symbol,
      true
    );
  }
  return (
    <StyledPopup
      open={isOpen}
      onClose={() => {
        modalStore.close();
        Mixpanel.events.lendingMarketActions.modalInteraction(
          "addd",
          modalStore.currentModal.toString(),
          "name",
          false
        );
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
          zIndex: "3",
        }}
        alt="close"
        onClick={modalStore.close}
      />
      {modalStore.currentModal === ModalType.WALLET_CONNECTION && (
        <WalletModal onClose={modalStore.close} />
      )}
      {modalStore.currentModal === ModalType.LENDING && (
        <SupplyModal onClose={modalStore.close} />
      )}

      {modalStore.currentModal === ModalType.BORROW && (
        <BorrowModal onClose={modalStore.close} />
      )}

      {modalStore.currentModal === ModalType.COLLATERAL && (
        <CollatModal onClose={modalStore.close} />
      )}

      {modalStore.currentModal === ModalType.DECOLLATERAL && (
        <CollatModal onClose={modalStore.close} decollateralize />
      )}
      {modalStore.currentModal === ModalType.BALANCE && (
        <RewardsModal
          // passin LMBalance to this
          rewardsObj={modalStore.rewards}
          onClose={modalStore.close}
        />
      )}
    </StyledPopup>
  );
};

export { ModalManager, ModalType };
