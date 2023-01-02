import { UserLMTokenDetails, EmptyActiveLMToken } from "../config/interfaces";
import create from "zustand";
import { Mixpanel } from "mixpanel";

export enum ModalType {
  WALLET_CONNECTION = "WALLET_CONNECTION",
  LENDING = "SUPPLY",
  BORROW = "BORROW",
  DEX = "DEX",
  COLLATERAL = "COLLATERAL",
  DECOLLATERAL = "DECOLLATERAL",
  BALANCE = "REWARDS",
  NONE = "NONE",
}

interface ModalState {
  currentModal: ModalType;
  open: (modal: ModalType) => void;
  close: () => void;
  isOpen: (modal: ModalType) => boolean;
  redirect: (modal: ModalType) => void;
  activeToken: UserLMTokenDetails;
  setActiveToken: (token: UserLMTokenDetails) => void;
}
const useModalStore = create<ModalState>((set, get) => ({
  currentModal: ModalType.NONE,
  open: (modal) => {
    set({ currentModal: modal });
    const activeToken = get().activeToken;
    Mixpanel.events.lendingMarketActions.modalInteraction(
      modal,
      activeToken.data.symbol,
      true
    );
  },
  close: () => {
    const activeToken = get().activeToken;
    Mixpanel.events.lendingMarketActions.modalInteraction(
      get().currentModal,
      activeToken.data.symbol,
      false
    );
    set({ currentModal: ModalType.NONE });
  },
  isOpen: (modal) => modal === get().currentModal,
  redirect: (modal) => {
    set({ currentModal: modal });
  },
  activeToken: EmptyActiveLMToken,
  setActiveToken: (token) => set({ activeToken: token }),
}));

export default useModalStore;
