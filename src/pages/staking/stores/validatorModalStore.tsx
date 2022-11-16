import create from "zustand";
import {
  EmptyActiveValidator,
  MasterValidatorProps,
} from "../config/interfaces";

export enum ValidatorModalType {
  REDELEGATE,
  DELEGATE,
  UNDELEGATE,
  STAKE,
  NONE,
}
interface ModalState {
  currentModal: ValidatorModalType;
  open: (modal: ValidatorModalType) => void;
  //transaction reset to none since will not automatically update
  close: (transactionResetter?: () => void) => void;
  activeValidator: MasterValidatorProps;
  setActiveValidator: (validator: MasterValidatorProps) => void;
}
const useValidatorModalStore = create<ModalState>((set) => ({
  currentModal: ValidatorModalType.NONE,
  open: (modal) => set({ currentModal: modal }),
  close: (transactionResetter?: () => void) => {
    set({ currentModal: ValidatorModalType.NONE });
    if (transactionResetter) {
      transactionResetter();
    }
  },
  activeValidator: EmptyActiveValidator,
  setActiveValidator: (validator: MasterValidatorProps) =>
    set({ activeValidator: validator }),
}));

export default useValidatorModalStore;
