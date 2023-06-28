import create from "zustand";
import {
  EmptyActiveValidator,
  MasterValidatorProps,
} from "../config/interfaces";

export enum ValidatorModalType {
  STAKE,
  CLAIM_REWARDS,
  NONE,
}
interface ModalState {
  currentModal: ValidatorModalType;
  open: (modal: ValidatorModalType) => void;
  //transaction reset to none since will not automatically update
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
