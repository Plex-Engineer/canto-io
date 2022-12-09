import { CantoMainnet } from "global/config/networks";
import { BigNumber } from "ethers";
import { useState } from "react";
import {
  txConvertCoin,
  txConvertERC20,
} from "../utils/convertCoin/convertTransactions";
import { toastBridge } from "../utils/bridgeConfirmations";
import {
  EmptySelectedConvertToken,
  EmptySelectedNativeToken,
  UserConvertToken,
} from "../config/interfaces";
import { getConvertButtonText } from "../utils/reactiveButtonText";
import { convertStringToBigNumber } from "../utils/stringToBigNumber";
import { formatUnits } from "ethers/lib/utils";
import { GeneralTransferBox } from "./generalTransferBox";
import { PrimaryButton } from "global/packages/src";
import bridgeIcon from "assets/icons/canto-bridge.svg";
import cantoIcon from "assets/icons/canto-evm.svg";
import { Mixpanel } from "mixpanel";
import { CantoTransactionType } from "global/config/transactionTypes";
import { chain, convertFee, memo } from "global/config/cosmosConstants";

interface ConvertTransferBoxProps {
  cantoToEVM: boolean;
  cantoAddress: string;
  ETHAddress: string;
  chainId: number;
  tokenSelector: React.ReactNode;
  amount: string;
  onChange: (value: string) => void;
  max: BigNumber;
  onSwitch: () => void;
  activeToken: UserConvertToken;
}
export const ConvertTransferBox = (props: ConvertTransferBoxProps) => {
  //convert states to update the user
  const [convertConfirmation, setConvertConfirmation] =
    useState("select a token");
  const [inConvertTransaction, setInConvertTransaction] =
    useState<boolean>(false);
  //used to check if convert coin ws successful
  const [prevConvertBalance, setPrevConvertBalance] = useState(
    BigNumber.from(0)
  );
  const [currentToken, setCurrentToken] = useState(
    props.cantoToEVM ? EmptySelectedNativeToken : EmptySelectedConvertToken
  );

  const maxAmount = props.cantoToEVM
    ? props.activeToken.nativeBalance
    : props.activeToken.erc20Balance;

  const [buttonText, disabled] = getConvertButtonText(
    convertStringToBigNumber(props.amount, props.activeToken.decimals),
    props.activeToken,
    props.max,
    props.cantoToEVM
  );

  if (inConvertTransaction) {
    if (currentToken.address == props.activeToken.address) {
      if (!props.activeToken.nativeBalance.eq(prevConvertBalance)) {
        const msg = props.cantoToEVM
          ? " from canto to evm"
          : " from evm to canto";
        setConvertConfirmation(
          "you have successfully bridged " + props.activeToken.symbol + msg
        );
        setInConvertTransaction(false);
        toastBridge(true);
      }
    } else {
      setInConvertTransaction(false);
    }
  }

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
        setInConvertTransaction(false);
      }}
      max={formatUnits(maxAmount, props.activeToken.decimals)}
      amount={props.amount}
      button={
        <PrimaryButton
          disabled={disabled}
          height="big"
          weight="bold"
          onClick={async () => {
            Mixpanel.events.transactions.transactionStarted(
              props.cantoToEVM
                ? CantoTransactionType.CONVERT_TO_EVM
                : CantoTransactionType.CONVERT_TO_COSMOS,
              props.ETHAddress,
              { tokenName: props.activeToken.symbol, amount: props.amount }
            );
            setInConvertTransaction(true);
            setConvertConfirmation(
              "waiting for the metamask transaction to be signed..."
            );
            setPrevConvertBalance(props.activeToken.nativeBalance);
            setCurrentToken(props.activeToken);
            if (props.cantoToEVM) {
              await txConvertCoin(
                props.cantoAddress,
                props.activeToken.nativeName,
                convertStringToBigNumber(
                  props.amount,
                  props.activeToken.decimals
                ).toString(),
                CantoMainnet.cosmosAPIEndpoint,
                convertFee,
                chain,
                memo
              );
            } else {
              await txConvertERC20(
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
              );
            }
            setConvertConfirmation(
              "waiting for the transaction to be verified..."
            );
          }}
        >
          {inConvertTransaction ? convertConfirmation : buttonText}
        </PrimaryButton>
      }
    />
  );
};
