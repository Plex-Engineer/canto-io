import create from "zustand";

interface StakingStake {
  inAllValidators: boolean;
  setInAllValidators: (inAllValidators: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  validatorSort: number;
  setValidatorSort: (option: number) => void;
}

const useStakingStore = create<StakingStake>((set) => ({
  inAllValidators: false,
  setInAllValidators: (inAllValidators) => set({ inAllValidators }),
  searchQuery: "",
  setSearchQuery: (message) => {
    set({ searchQuery: message });
  },
  validatorSort: 1,
  setValidatorSort: (option: number) =>
    set({
      validatorSort: option,
    }),
}));

export default useStakingStore;
