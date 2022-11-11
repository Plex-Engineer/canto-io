import Popup from "reactjs-popup";
import styled from "@emotion/styled";
import WalletModal from "./walletModal";
import close from "assets/close.svg";
import CollatModal from "./enableCollateral";
import SupplyModal from "./supplyModal";
import BorrowModal from ".//borrowModal";
import { Mixpanel } from "mixpanel";
import RewardsModal from "./rewardsModal";
import useModalStore, { ModalType } from "pages/lending/stores/useModals";
import { UserLMPosition, UserLMRewards } from "pages/lending/config/interfaces";
const StyledPopup = styled(Popup)`
  // use your custom style for ".popup-overlay"
  &-overlay {
    background-color: #1f4a2c6e;
    backdrop-filter: blur(2px);
    z-index: 10;
    animation: fadein 0.2s;
    @keyframes fadein {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }
  }
  // use your custom style for ".popup-content"
  &-content {
    position: relative;
    overflow-y: hidden;
    overflow-x: hidden;
    background-color: black;
    scroll-behavior: smooth;
    border-radius: 4px;
    animation: fadein 0.5s 1;
    @keyframes fadein {
      0% {
        opacity: 0;
        transform: translateY(10px);
      }
      50% {
        opacity: 1;
      }
      100% {
        transform: translateY(0px);
      }
    }
    /* width */
  }

  & {
    overflow-y: auto;
  }
`;

interface Props {
  isOpen: boolean;
  position: UserLMPosition;
  rewards: UserLMRewards;
}

const ModalManager = ({ isOpen, position, rewards }: Props) => {
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
      <div role="button" tabIndex={0} onClick={modalStore.close}>
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
        />
      </div>
      {modalStore.currentModal === ModalType.WALLET_CONNECTION && (
        <WalletModal onClose={modalStore.close} />
      )}
      {modalStore.currentModal === ModalType.LENDING && (
        <SupplyModal onClose={modalStore.close} position={position} />
      )}

      {modalStore.currentModal === ModalType.BORROW && (
        <BorrowModal onClose={modalStore.close} position={position} />
      )}

      {modalStore.currentModal === ModalType.COLLATERAL && (
        <CollatModal
          onClose={modalStore.close}
          position={position}
          decollateralize={false}
        />
      )}

      {modalStore.currentModal === ModalType.DECOLLATERAL && (
        <CollatModal
          onClose={modalStore.close}
          decollateralize={true}
          position={position}
        />
      )}
      {modalStore.currentModal === ModalType.BALANCE && (
        <RewardsModal
          // passin LMBalance to this
          rewardsObj={rewards}
          onClose={modalStore.close}
        />
      )}
    </StyledPopup>
  );
};

export { ModalManager, ModalType };
