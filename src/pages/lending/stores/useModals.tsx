import {
  UserLMPosition,
  UserLMRewards,
  EmptyUserRewards,
  UserLMTokenDetails,
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
  activeToken: UserLMTokenDetails | undefined;
  setActiveToken: (token: UserLMTokenDetails) => void;
  rewards: UserLMRewards;
  setRewards: (rewards: UserLMRewards) => void;
  stats: UserLMPosition | undefined;
  setStats: (stats: UserLMPosition) => void;
}
const useModalStore = create<ModalState>((set, get) => ({
  currentModal: ModalType.NONE,
  open: (modal) => set({ currentModal: modal }),
  close: () => set({ currentModal: ModalType.NONE }),
  isOpen: (modal) => modal === get().currentModal,
  redirect: (modal) => {
    set({ currentModal: modal });
  },
  activeToken: undefined,
  setActiveToken: (token) => set({ activeToken: token }),
  rewards: EmptyUserRewards,
  setRewards: (rewards) => set({ rewards }),
  stats: undefined,
  setStats: (stats) => set({ stats }),
}));

export default useModalStore;
