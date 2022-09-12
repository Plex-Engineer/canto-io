import {
  UserLMPosition,
  UserLMRewards,
  EmptyUserRewards,
  UserLMTokenDetails,
  EmptyUserPosition,
  EmptyActiveLMToken,
} from "../config/interfaces";
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
  rewards: UserLMRewards;
  setRewards: (rewards: UserLMRewards) => void;
  position: UserLMPosition;
  setPosition: (stats: UserLMPosition) => void;
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
  rewards: EmptyUserRewards,
  setRewards: (rewards) => set({ rewards }),
  position: EmptyUserPosition,
  setPosition: (stats) => set({ position: stats }),
}));

export default useModalStore;
