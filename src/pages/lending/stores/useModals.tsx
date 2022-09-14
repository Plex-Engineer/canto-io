import { UserLMTokenDetails, EmptyActiveLMToken } from "../config/interfaces";
import create from "zustand";

export enum ModalType {
  WALLET_CONNECTION,
  LENDING,
  BORROW,
  DEX,
  COLLATERAL,
  DECOLLATERAL,
  BALANCE,
  NONE,
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
  open: (modal) => set({ currentModal: modal }),
  close: () => set({ currentModal: ModalType.NONE }),
  isOpen: (modal) => modal === get().currentModal,
  redirect: (modal) => {
    set({ currentModal: modal });
  },
  activeToken: EmptyActiveLMToken,
  setActiveToken: (token) => set({ activeToken: token }),
}));

export default useModalStore;
