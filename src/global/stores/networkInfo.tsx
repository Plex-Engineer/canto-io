import { BigNumber, Contract, ContractInterface } from "ethers";
import { checkPubKey } from "global/utils/cantoTransactions/publicKey";
import { getCantoAddressFromMetaMask } from "global/utils/walletConnect/addCantoToWallet";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { JsonRpcSigner } from "@ethersproject/providers";

export interface NetworkProps {
  chainId: string | undefined;
  setChainId: (chainId: string | undefined) => void;
  account: string | undefined;
  setAccount: (account: string | undefined) => void;
  signer: JsonRpcSigner | undefined;
  setSigner: (signer: JsonRpcSigner) => void;
  cantoAddress: string;
  hasPubKey: boolean;
  balance: BigNumber;
  setBalance: (balance: BigNumber) => void;
  createContractWithSigner: (
    address: string,
    abi: ContractInterface
  ) => Contract;
}

export const useNetworkInfo = create<NetworkProps>()(
  devtools((set, get) => ({
    chainId: undefined,
    setChainId: (chainId) => set({ chainId: chainId }),
    account: undefined,
    signer: undefined,
    setSigner: (signer) => set({ signer: signer }),
    cantoAddress: "",
    hasPubKey: true,
    setAccount: async (account) => {
      if (account) {
        set({ account: account });
        const cantoAddress = await getCantoAddressFromMetaMask(
          account,
          Number(get().chainId)
        );
        const hasPubKey = await checkPubKey(
          cantoAddress,
          Number(get().chainId)
        );
        set({ cantoAddress: cantoAddress });
        set({ hasPubKey: hasPubKey });
      }
    },
    balance: BigNumber.from(0),
    setBalance: (balance) => set({ balance: balance }),
    createContractWithSigner: (address, abi) =>
      new Contract(address, abi, get().signer),
  }))
);
