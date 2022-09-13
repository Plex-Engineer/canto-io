import create from "zustand";
import { devtools } from "zustand/middleware";

export enum ModalType {
  NONE,
  WALLET,
  TOKENS,
}

interface ModalProps {
  loading: boolean;
  setLoading: (val: boolean) => void;
  modalType: ModalType;
  setModalType: (modalType: ModalType) => void;
}

const useGlobalModals = create<ModalProps>()(
  devtools((set) => ({
    loading: false,
    setLoading: (value) => set({ loading: value }),

    modalType: ModalType.NONE,
    prevModalType: ModalType.NONE,
    setModalType: (modalType) => {
      set({
        modalType: modalType,
      });
    },
  }))
);

export default useGlobalModals;
