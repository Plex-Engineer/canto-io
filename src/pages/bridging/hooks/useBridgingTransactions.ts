import { TransactionState, useContractFunction } from "@usedapp/core";
import { Contract, ethers, utils } from "ethers";
import { ERC20Abi, gravityBridgeAbi } from "global/config/abi";
import { chain, convertFee, ibcFee, memo } from "global/config/cosmosConstants";
import { CantoMainnet } from "global/config/networks";
import { useState } from "react";
import {
  txConvertCoin,
  txConvertERC20,
} from "../utils/convertCoin/convertTransactions";
import { checkCosmosTxConfirmation } from "global/utils/cantoTransactions/checkCosmosConfirmation";
import { txIBCTransfer } from "../utils/IBC/IBCTransfer";
import { ADDRESSES } from "global/config/addresses";
import { BridgeOutNetworkInfo } from "../config/interfaces";
import { CANTO_IBC_NETWORK } from "../config/bridgeOutNetworks";

export interface BridgeTransaction {
  state: TransactionState;
  send: (...args: any[]) => Promise<unknown>;
  resetState: () => void;
  txName: string;
}
interface BridgingTransactionsSelector {
  bridgeIn: {
    approveToken: (tokenAddress: string) => BridgeTransaction;
    sendToCosmos: (
      gravityAddress: string,
      tokenAddress: string,
      cantoAddress: string
    ) => BridgeTransaction;
  };
  convertCoin: {
    convertTx: (
      tokenName: string,
      cantoAddress: string,
      convertIn: boolean
    ) => BridgeTransaction;
  };
  bridgeOut: {
    ibcOut: (tokenDenom: string) => BridgeTransaction;
  };
}

export function useBridgingTransactions(): BridgingTransactionsSelector {
  function useApprove(tokenAddress: string) {
    const erc20Interface = new utils.Interface(ERC20Abi);
    const contract = new Contract(tokenAddress, erc20Interface);
    const { state, send, resetState } = useContractFunction(
      contract,
      "approve",
      {
        transactionName: "enable token",
      }
    );
    return {
      state: state.status,
      send: async (amount: string) => {
        send(ADDRESSES.ETHMainnet.GravityBridge, ethers.constants.MaxUint256);
      },
      resetState,
      txName: "approve token",
    };
  }
  function useSendToCosmos(
    gravityAddress: string,
    tokenAddress: string,
    cantoAddress: string
  ) {
    const gBridgeInterface = new utils.Interface(gravityBridgeAbi);
    const contract = new Contract(gravityAddress, gBridgeInterface);
    const { state, send, resetState } = useContractFunction(
      contract,
      "sendToCosmos",
      {
        transactionName: "sending to cosmos",
      }
    );
    return {
      state: state.status,
      send: async (amount: string) => {
        if (CANTO_IBC_NETWORK.checkAddress(cantoAddress)) {
          send(tokenAddress, cantoAddress, amount);
        }
      },
      resetState,
      txName: "send to canto",
    };
  }
  /**
   * @notice If convertIn, tokenName must be its IBC denom
   * @notice If convertOut, tokenName must be its EVM address
   */
  function useConvertCoin(
    tokenName: string,
    cantoAddress: string,
    convertIn: boolean
  ) {
    const [convertState, setConvertState] = useState<TransactionState>("None");
    const send = async (amount: string) => {
      setConvertState("PendingSignature");
      try {
        const tx = convertIn
          ? await txConvertCoin(
              cantoAddress,
              tokenName,
              amount,
              CantoMainnet.cosmosAPIEndpoint,
              convertFee,
              chain,
              memo
            )
          : await txConvertERC20(
              tokenName,
              amount,
              cantoAddress,
              CantoMainnet.cosmosAPIEndpoint,
              convertFee,
              chain,
              memo
            );
        setConvertState("Mining");
        const confirmed = await checkCosmosTxConfirmation(
          tx.tx_response.txhash
        );
        setConvertState(confirmed ? "Success" : "Fail");
      } catch {
        setConvertState("Exception");
      }
    };
    const resetState = () => setConvertState("None");

    return { state: convertState, send, resetState, txName: "convert" };
  }
  function useIBCTransfer(tokenDenom: string) {
    const [ibcState, setIbcState] = useState<TransactionState>("None");
    const send = async (
      amount: string,
      cosmosAddress: string,
      bridgeOutNetwork: BridgeOutNetworkInfo
    ) => {
      //check to make sure the address not null
      if (!bridgeOutNetwork.checkAddress(cosmosAddress)) {
        setIbcState("Exception");
        return;
      }
      setIbcState("PendingSignature");
      try {
        const tx = await txIBCTransfer(
          cosmosAddress,
          bridgeOutNetwork.channel,
          amount,
          tokenDenom,
          CantoMainnet.cosmosAPIEndpoint,
          bridgeOutNetwork.endpoint,
          bridgeOutNetwork.latestBlockEndpoint,
          ibcFee,
          chain,
          memo
        );
        setIbcState("Mining");
        const confirmed = await checkCosmosTxConfirmation(
          tx.tx_response.txhash
        );
        setIbcState(confirmed ? "Success" : "Fail");
      } catch {
        setIbcState("Exception");
      }
    };
    const resetState = () => setIbcState("None");
    return { state: ibcState, send, resetState, txName: "ibc transfer" };
  }

  return {
    bridgeIn: {
      approveToken: useApprove,
      sendToCosmos: useSendToCosmos,
    },
    convertCoin: {
      convertTx: useConvertCoin,
    },
    bridgeOut: {
      ibcOut: useIBCTransfer,
    },
  };
}
