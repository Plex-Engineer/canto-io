import { LMBalance, LMToken, LMTokenDetails } from "../config/interfaces";
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
  activeToken: LMToken | null;
  setActiveToken: (token: LMToken | null) => void;
  tokens: LMToken[] | undefined;
  setTokens: (tokens: LMToken[] | undefined) => void;
  balance: LMBalance | undefined;
  setBalance: (balance: LMBalance | undefined) => void;
  stats: LMTokenDetails | undefined;
  setStats: (stats: LMTokenDetails | undefined) => void;
}
const useModalStore = create<ModalState>((set, get) => ({
  currentModal: ModalType.NONE,
  open: (modal) => set({ currentModal: modal }),
  close: () => set({ currentModal: ModalType.NONE }),
  isOpen: (modal) => modal === get().currentModal,
  redirect: (modal) => {
    set({ currentModal: modal });
  },
  activeToken: null,
  setActiveToken: (token) => set({ activeToken: token }),
  tokens: undefined,
  setTokens: (tokens) => set({ tokens }),
  balance: undefined,
  setBalance: (balance) => set({ balance }),
  stats: undefined,
  setStats: (stats) => set({ stats }),
}));

export default useModalStore;
