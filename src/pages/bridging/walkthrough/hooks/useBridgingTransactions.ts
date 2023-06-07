import { TransactionState, useContractFunction } from "@usedapp/core";
import { BigNumber, Contract, ethers, utils } from "ethers";
import { ERC20Abi, gravityBridgeAbi, wethAbi } from "global/config/abi";
import { convertFee, ibcFee } from "global/config/cosmosConstants";
import { CantoMainnet, ETHMainnet } from "global/config/networks";
import { useEffect, useState } from "react";
import {
  txConvertCoin,
  txConvertERC20,
} from "../../utils/convertCoin/convertTransactions";
import { checkCosmosTxConfirmation } from "global/utils/cantoTransactions/transactionChecks";
import { txIBCTransfer } from "../../utils/IBC/IBCTransfer";
import { ADDRESSES } from "global/config/addresses";
import { BridgeOutNetworkInfo } from "../config/interfaces";
import { CANTO_IBC_NETWORK } from "../config/bridgeOutNetworks";
import { CantoTransactionType } from "global/config/interfaces/transactionTypes";

const chain = {
  chainId: 7700,
  cosmosChainId: "canto_7700-1",
};
export interface BridgeTransaction {
  state: TransactionState;
  send: (...args: any[]) => Promise<unknown>;
  resetState: () => void;
  txName: string;
  txType: CantoTransactionType;
}
export interface BridgingTransactionsSelector {
  bridgeIn: {
    approveToken: (tokenAddress: string) => BridgeTransaction;
    sendToCosmos: (
      gravityAddress: string,
      tokenAddress: string,
      cantoAddress: string
    ) => BridgeTransaction;
    sendToCosmosWithWrap: (
      account: string | undefined,
      gravityAddress: string,
      wethAddress: string,
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
      txType: CantoTransactionType.ENABLE,
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
      txName: "bridge to canto",
      txType: CantoTransactionType.CONVERT_TO_EVM,
    };
  }
  function useSendToCosmosWithWrap(
    account: string | undefined,
    gravityAddress: string,
    wethAddress: string,
    cantoAddress: string
  ) {
    const gBridgeInterface = new utils.Interface(gravityBridgeAbi);
    const gBridgeContract = new Contract(gravityAddress, gBridgeInterface);
    const wethInterface = new utils.Interface(wethAbi);
    const wethContract = new Contract(
      wethAddress,
      wethInterface,
      new ethers.providers.JsonRpcProvider(ETHMainnet.rpcUrl)
    );
    const [amount, setAmount] = useState<string>("0");
    const {
      state: cosmosState,
      send: cosmosSend,
      resetState: comsosResetState,
    } = useContractFunction(gBridgeContract, "sendToCosmos", {
      transactionName: "sending to cosmos",
    });
    const {
      state: wrapState,
      send: wrapSend,
      resetState: wrapResetState,
    } = useContractFunction(wethContract, "deposit", {
      transactionName: "wrapping weth",
    });
    useEffect(() => {
      if (
        wrapState.status === "Success" &&
        CANTO_IBC_NETWORK.checkAddress(cantoAddress)
      ) {
        cosmosSend(wethAddress, cantoAddress, amount);
      }
    }, [wrapState.status]);
    return {
      state:
        cosmosState.status === "None" ? wrapState.status : cosmosState.status,
      send: async (amount: string) => {
        setAmount(amount);
        const wethBalance = await wethContract.balanceOf(account);
        if (wethBalance.lt(amount)) {
          wrapSend({ value: BigNumber.from(amount).sub(wethBalance) });
        } else {
          if (CANTO_IBC_NETWORK.checkAddress(cantoAddress)) {
            cosmosSend(wethAddress, cantoAddress, amount);
          }
        }
      },
      resetState: () => {
        comsosResetState();
        wrapResetState();
      },
      txName: "bridge weth to canto",
      txType:
        cosmosState.status === "None"
          ? CantoTransactionType.WRAP
          : CantoTransactionType.BORROW,
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
              ""
            )
          : await txConvertERC20(
              tokenName,
              amount,
              cantoAddress,
              CantoMainnet.cosmosAPIEndpoint,
              convertFee,
              chain,
              ""
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

    return {
      state: convertState,
      send,
      resetState,
      txName: convertIn ? "complete bridge in" : "bridge out",
      txType: convertIn
        ? CantoTransactionType.CONVERT_TO_EVM
        : CantoTransactionType.CONVERT_TO_NATIVE,
    };
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
          bridgeOutNetwork.cantoChannel,
          amount,
          tokenDenom,
          CantoMainnet.cosmosAPIEndpoint,
          bridgeOutNetwork.restEndpoint,
          bridgeOutNetwork.latestBlockEndpoint,
          ibcFee,
          chain,
          ""
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
    return {
      state: ibcState,
      send,
      resetState,
      txName: "complete bridge out",
      txType: CantoTransactionType.IBC_OUT,
    };
  }

  return {
    bridgeIn: {
      approveToken: useApprove,
      sendToCosmos: useSendToCosmos,
      sendToCosmosWithWrap: useSendToCosmosWithWrap,
    },
    convertCoin: {
      convertTx: useConvertCoin,
    },
    bridgeOut: {
      ibcOut: useIBCTransfer,
    },
  };
}
