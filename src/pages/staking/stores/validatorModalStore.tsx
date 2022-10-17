import create from "zustand";
import {
  EmptyActiveValidator,
  MasterValidatorProps,
} from "../config/interfaces";

export enum ValidatorModalType {
  STAKE,
  NONE,
}
interface ModalState {
  currentModal: ValidatorModalType;
  open: (modal: ValidatorModalType) => void;
  close: () => void;
  activeValidator: MasterValidatorProps;
  setActiveValidator: (validator: MasterValidatorProps) => void;
}
const useValidatorModalStore = create<ModalState>((set) => ({
  currentModal: ValidatorModalType.NONE,
  open: (modal) => set({ currentModal: modal }),
  close: () => set({ currentModal: ValidatorModalType.NONE }),
  activeValidator: EmptyActiveValidator,
  setActiveValidator: (validator: MasterValidatorProps) =>
    set({ activeValidator: validator }),
}));

export default useValidatorModalStore;
