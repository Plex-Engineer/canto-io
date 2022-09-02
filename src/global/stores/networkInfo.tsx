import { checkPubKey } from "global/utils/cantoTransactions/publicKey";
import { getCantoAddressFromMetaMask } from "global/utils/walletConnect/addCantoToWallet";
import create from "zustand";
import { devtools } from "zustand/middleware";

interface NetworkProps {
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
    chainId: undefined,
    setChainId: (chainId) => set({ chainId: chainId }),
    account: undefined,
    cantoAddress: "",
    hasPubKey: true,
    setAccount: async (account) => {
      if (account) {
        set({ account: account });
        const cantoAddress = await getCantoAddressFromMetaMask(account);
        const hasPubKey = await checkPubKey(cantoAddress);
        set({ cantoAddress: cantoAddress });
        set({ hasPubKey: hasPubKey });
      }
    },
    balance: "0",
    setBalance: (balance) => set({ balance: balance }),
  }))
);
