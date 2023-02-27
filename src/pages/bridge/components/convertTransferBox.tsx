import { CantoMainnet } from "global/config/networks";
import {
  txConvertCoin,
  txConvertERC20,
} from "../utils/convertCoin/convertTransactions";
import { BridgeTransactionType, UserConvertToken } from "../config/interfaces";
import { convertStringToBigNumber } from "../utils/stringToBigNumber";
import { formatUnits } from "ethers/lib/utils";
import { GeneralTransferBox } from "./generalTransferBox";
import { PrimaryButton } from "global/packages/src";
import bridgeIcon from "assets/icons/canto-bridge.svg";
import cantoIcon from "assets/icons/canto-evm.svg";
import { Mixpanel } from "mixpanel";
import { CantoTransactionType } from "global/config/transactionTypes";
import { chain, convertFee, memo } from "global/config/cosmosConstants";
import {
  BridgeInStatus,
  BridgeOutStatus,
  useTransactionChecklistStore,
} from "../stores/transactionChecklistStore";
import { performBridgeCosmosTxAndSetStatus } from "../utils/bridgeCosmosTxUtils";
import useBridgeTxStore from "../stores/transactionStore";
import { useEffect } from "react";

interface ConvertTransferBoxProps {
  cantoToEVM: boolean;
  cantoAddress: string;
  ETHAddress: string;
  chainId: number;
  tokenSelector: React.ReactNode;
  amount: string;
  onChange: (value: string) => void;
  onSwitch: () => void;
  activeToken: UserConvertToken;
  convertButtonText: string;
  convertDisabled: boolean;
}
export const ConvertTransferBox = (props: ConvertTransferBoxProps) => {
  const checklistStore = useTransactionChecklistStore();
  const bridgeTxStore = useBridgeTxStore();

  const maxAmount = props.cantoToEVM
    ? props.activeToken.nativeBalance
    : props.activeToken.erc20Balance;

  function updateChecklist() {
    //checklist must be on this step, so we can update the checklist here
    if (props.cantoToEVM) {
      checklistStore.updateCurrentBridgeInStatus(
        BridgeInStatus.COMPLETE,
        undefined
      );
    } else {
      checklistStore.updateCurrentBridgeOutStatus(
        BridgeOutStatus.SELECT_BRIDGE,
        undefined
      );
    }
  }
  useEffect(() => {
    if (bridgeTxStore.transactionStatus?.status === "Success") {
      updateChecklist();
    }
  }, [bridgeTxStore.transactionStatus?.status]);

  return (
    <GeneralTransferBox
      tokenSelector={props.tokenSelector}
      needAddressBox={false}
      from={{
        address: props.cantoToEVM ? props.cantoAddress : props.ETHAddress,
        name: props.cantoToEVM ? "canto (bridge)" : "canto (EVM)",
        icon: props.cantoToEVM ? bridgeIcon : cantoIcon,
      }}
      to={{
        address: !props.cantoToEVM ? props.cantoAddress : props.ETHAddress,
        name: !props.cantoToEVM ? "canto (bridge)" : "canto (EVM)",
        icon: !props.cantoToEVM ? bridgeIcon : cantoIcon,
      }}
      networkName="canto"
      onSwitch={props.onSwitch}
      connected={CantoMainnet.chainId == props.chainId}
      onChange={(amount: string) => {
        props.onChange(amount);
      }}
      max={formatUnits(maxAmount, props.activeToken.decimals)}
      amount={props.amount}
      button={
        <PrimaryButton
          disabled={props.convertDisabled}
          height="big"
          weight="bold"
          onClick={async () => {
            Mixpanel.events.transactions.transactionStarted(
              props.cantoToEVM
                ? CantoTransactionType.CONVERT_TO_EVM
                : CantoTransactionType.CONVERT_TO_COSMOS,
              { tokenName: props.activeToken.symbol, amount: props.amount }
            );
            await performBridgeCosmosTxAndSetStatus(
              async () =>
                props.cantoToEVM
                  ? await txConvertCoin(
                      props.cantoAddress,
                      props.activeToken.ibcDenom,
                      convertStringToBigNumber(
                        props.amount,
                        props.activeToken.decimals
                      ).toString(),
                      CantoMainnet.cosmosAPIEndpoint,
                      convertFee,
                      chain,
                      memo
                    )
                  : await txConvertERC20(
                      props.activeToken.address,
                      convertStringToBigNumber(
                        props.amount,
                        props.activeToken.decimals
                      ).toString(),
                      props.cantoAddress,
                      CantoMainnet.cosmosAPIEndpoint,
                      convertFee,
                      chain,
                      memo
                    ),
              props.cantoToEVM
                ? BridgeTransactionType.CONVERT_IN
                : BridgeTransactionType.CONVERT_OUT,
              bridgeTxStore.setTransactionStatus,
              props.activeToken.name,
              props.amount,
              props.cantoToEVM ? "canto bridge" : "canto EVM",
              props.cantoToEVM ? "canto EVM" : "canto bridge"
            );
          }}
        >
          {props.convertButtonText}
        </PrimaryButton>
      }
    />
  );
};
