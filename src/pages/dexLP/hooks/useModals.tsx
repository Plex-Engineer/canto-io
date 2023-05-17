import { TransactionState } from "@usedapp/core";
import { BigNumber } from "ethers";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { EmptySelectedLPToken, UserLPPairInfo } from "../config/interfaces";
export enum ModalType {
  NONE = "NONE",
  ADD = "ADD",
  ADD_CONFIRM = "ADD_CONFIRM",
  REMOVE = "REMOVE",
  REMOVE_CONFIRM = "REMOVE_CONFIRM",
  ADD_OR_REMOVE = "ADD_OR_REMOVE",
}

interface ModalProps {
  loading: boolean;
  setLoading: (val: boolean) => void;
  activePair: UserLPPairInfo;
  setActivePair: (pair: UserLPPairInfo) => void;
  status: TransactionState;
  setStatus: (status: TransactionState) => void;
  modalType: ModalType;
  prevModalType: ModalType;
  setModalType: (modalType: ModalType) => void;
  confirmationValues: {
    amount1: BigNumber;
    amount2: BigNumber;
    percentage: number;
    slippage: number;
    deadline: number;
  };
  setConfirmationValues: (value: {
    amount1: BigNumber;
    amount2: BigNumber;
    percentage: number;
    slippage: number;
    deadline: number;
  }) => void;
}

const useModals = create<ModalProps>()(
  devtools((set, get) => ({
    loading: false,
    setLoading: (value) => set({ loading: value }),
    status: "None",
    setStatus: (status) =>
      set({
        status,
      }),
    activePair: EmptySelectedLPToken,
    setActivePair: (pair) =>
      set({
        activePair: pair,
      }),
    modalType: ModalType.NONE,
    prevModalType: ModalType.NONE,
    setModalType: (modalType) => {
      if (modalType !== get().modalType) {
        set({
          prevModalType: get().modalType,
          modalType: modalType,
        });
      }
    },
    confirmationValues: {
      amount1: BigNumber.from(0),
      amount2: BigNumber.from(0),
      deadline: 0,
      slippage: 0,
      percentage: 0,
    },
    setConfirmationValues: (values) => set({ confirmationValues: values }),
  }))
);

export default useModals;
