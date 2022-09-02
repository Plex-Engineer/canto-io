import Popup from "reactjs-popup";
import styled from "styled-components";
import WalletModal from "./walletModal";
import close from "assets/close.svg";
import CollatModal from "./enableCollateral";
import SupplyModal from "./supplyModal";
import BorrowModal from ".//borrowModal";
import { Mixpanel } from "mixpanel";
import { useToken } from "../../providers/activeTokenContext";
import BalanceModal from "./balanceModal";
//enum for modal types and states such a wallet connection, lending and dex
enum ModalType {
  WALLET_CONNECTION,
  LENDING,
  BORROW,
  DEX,
  COLLATERAL,
  DECOLLATERAL,
  BALANCE,
}
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

  @media (max-width: 1000px) {
    &-content {
      width: 100vw;
    }
  }
`;

interface Props {
  modalType: ModalType;
  isOpen: boolean;
  onClose: () => void;
  data?: any;
}

const ModalManager = (props: Props) => {
  const tokenState = useToken();
  if (props.isOpen && tokenState[0]) {
    Mixpanel.events.lendingMarketActions.modalInteraction(
      tokenState[0].token.wallet,
      props.modalType.toString(),
      tokenState[0].token.data.symbol,
      true
    );
  }
  return (
    <StyledPopup
      open={props.isOpen}
      onClose={() => {
        props.onClose();
        Mixpanel.events.lendingMarketActions.modalInteraction(
          "addd",
          props.modalType.toString(),
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
        onClick={props.onClose}
      />
      {/* <img className="close" src={close} alt="" /> */}
      {props.modalType === ModalType.WALLET_CONNECTION && (
        <WalletModal onClose={props.onClose} />
      )}
      {props.modalType === ModalType.LENDING && (
        <SupplyModal onClose={props.onClose} />
      )}

      {props.modalType === ModalType.BORROW && (
        <BorrowModal onClose={props.onClose} />
      )}

      {props.modalType === ModalType.COLLATERAL && (
        <CollatModal onClose={props.onClose} />
      )}

      {props.modalType === ModalType.DECOLLATERAL && (
        <CollatModal onClose={props.onClose} decollateralize />
      )}
      {props.modalType === ModalType.BALANCE && (
        <BalanceModal value={props.data} onClose={props.onClose} />
      )}
    </StyledPopup>
  );
};

export { ModalManager, ModalType };
