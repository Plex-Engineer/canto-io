import create from "zustand";
import { devtools } from "zustand/middleware";
import emptyToken from "assets/empty.svg";
import { ChainId, TransactionState, TransactionStatus } from "@usedapp/core";
import { providers } from "ethers";
import { GTokens } from "../hooks/useGravityTokens";
import { NativeGTokens } from "../hooks/useCosmosTokens";

// interface TxStatus {
//   state: TransactionStatus;
//   send: (...args: any[]) => Promise<providers.TransactionReceipt | undefined>;
//   resetState: () => void;
// }
export const selectedEmptyToken = {
  data: {
    isERC20: false,
    isLP: false,
    symbol: "select token",
    address: "0x0412C7c846bb6b7DC462CF6B453f76D8440b2609",
    cTokenAddress: "",
    decimals: 0,
    icon: emptyToken,
    name: "select token",
    nativeName: "none",
  },
  wallet: "",
  allowance: -1,
  balanceOf: -1,
  nativeBalanceOf: "-1",
};

interface BridgeStore {
  network: {
    chainID: ChainId | undefined;
    setChainID: (value: ChainId) => void;
  };
  tokens: GTokens[];
  setTokens: (tokens: GTokens[]) => void;
  transactionType: "Bridge" | "Convert";
  setTransactionType: (value: "Bridge" | "Convert") => void;
  amount: string;
  setAmount: (value: string) => void;
  selectedToken: NativeGTokens;
  setSelectedToken: (token: NativeGTokens) => void;
  approveStatus: TransactionState;
  setApproveStatus: (tx: TransactionState) => void;
  cosmosStatus: TransactionState;
  setCosmosStatus: (tx: TransactionState) => void;
}
export const useBridgeStore = create<BridgeStore>()(
  devtools((set, get) => ({
    network: {
      chainID: undefined,
      setChainID: (val) =>
        set({
          network: {
            chainID: val,
            setChainID: get().network.setChainID,
          },
        }),
    },
    tokens: [],
    setTokens: (tokens: GTokens[]) => set({ tokens: tokens }),
    transactionType: "Bridge",
    setTransactionType: (value) =>
      set({
        transactionType: value,
      }),
    amount: "",
    setAmount: (value) => set({ amount: value }),
    selectedToken: selectedEmptyToken,
    setSelectedToken: (token: NativeGTokens) => {
      set({
        selectedToken: token,
      });
    },
    approveStatus: "None",
    setApproveStatus: (tx) =>
      set({
        approveStatus: tx,
      }),
    cosmosStatus: "None",
    setCosmosStatus: (tx) =>
      set({
        cosmosStatus: tx,
      }),
  }))
);
