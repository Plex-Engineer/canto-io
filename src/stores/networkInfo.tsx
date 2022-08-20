import { CantoMainnet } from "cantoui";
import { GravityTestnet, ETHMainnet } from "config/networks";
import { checkPubKey, getCantoAddressFromMetaMask } from "utils/nodeTransactions";
import create from "zustand";
import { devtools } from "zustand/middleware";

interface NetworkProps {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  chainId: string | undefined;
  setChainId: (chainId: string | undefined) => void;
  account: string | undefined;
  setAccount: (account: string | undefined) => void;
  cantoAddress: string;
  hasPubKey: boolean;
  balance: string;
  setBalance: (balance: string) => void;
}

export const useNetworkInfo = create<NetworkProps>()(
  devtools((set) => ({
    isConnected: true,
    setIsConnected: (connected) => set({ isConnected: connected }),
    chainId: undefined,
    setChainId: (chainId) => {
      set({ chainId: chainId });
      if (
        Number(chainId) == GravityTestnet.chainId ||
        Number(chainId) == ETHMainnet.chainId ||
        Number(chainId) == CantoMainnet.chainId
      ) {
        set({ isConnected: true });
      } else {
        set({ isConnected: false });
      }
    },
    account: undefined,
    cantoAddress : "",
    hasPubKey: true,
    setAccount: async (account) => {
    set({ account: account });
    let cantoAddress = await getCantoAddressFromMetaMask(account);
    let hasPubKey = await checkPubKey(cantoAddress);
    set({cantoAddress : cantoAddress});
    set({hasPubKey : hasPubKey});
    },
    balance: "0",
    setBalance: (balance) => set({ balance: balance }),
  }))
);
