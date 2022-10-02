import { CantoMainnet, PrimaryButton } from "cantoui";
import cantoIcon from "assets/logo.svg";
import { chain, fee, memo } from "../config/networks";
import { BigNumber } from "ethers";
import { useState } from "react";
import {
  txConvertCoin,
  txConvertERC20,
} from "../utils/convertCoin/convertTransactions";
import { toastBridge } from "../utils/bridgeConfirmations";
import bridgeIcon from "assets/bridge.svg";
import { useTokenStore } from "../stores/cosmosTokens";
import { emptySelectedToken } from "../config/interfaces";
import { getConvertButtonText } from "../utils/reactiveButtonText";
import { convertStringToBigNumber } from "../utils/stringToBigNumber";
import { formatUnits } from "ethers/lib/utils";
import { GeneralTransferBox } from "./generalTransferBox";

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
}
export const ConvertTransferBox = (props: ConvertTransferBoxProps) => {
  const activeToken = useTokenStore().selectedToken;
  //convert states to update the user
  const [convertConfirmation, setConvertConfirmation] =
    useState("select a token");
  const [inConvertTransaction, setInConvertTransaction] =
    useState<boolean>(false);
  //used to check if convert coin ws successful
  const [prevConvertBalance, setPrevConvertBalance] = useState(
    BigNumber.from(0)
  );
  const [currentToken, setCurrentToken] = useState(emptySelectedToken);

  const maxAmount = props.cantoToEVM
    ? activeToken.nativeBalanceOf
    : activeToken.balanceOf;

  const [buttonText, disabled] = getConvertButtonText(
    convertStringToBigNumber(props.amount, activeToken.data.decimals),
    activeToken,
    props.max,
    props.cantoToEVM
  );

  if (inConvertTransaction) {
    if (currentToken.data.address == activeToken.data.address) {
      if (!activeToken.nativeBalanceOf.eq(prevConvertBalance)) {
        const msg = props.cantoToEVM
          ? " from canto to evm"
          : " from evm to canto";
        setConvertConfirmation(
          "you have successfully bridged " + activeToken.data.symbol + msg
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
      max={formatUnits(maxAmount, activeToken.data.decimals)}
      amount={props.amount}
      button={
        <PrimaryButton
          disabled={disabled}
          onClick={async () => {
            setInConvertTransaction(true);
            setConvertConfirmation(
              "waiting for the metamask transaction to be signed..."
            );
            setPrevConvertBalance(activeToken.nativeBalanceOf);
            setCurrentToken(activeToken);
            if (props.cantoToEVM) {
              await txConvertCoin(
                props.cantoAddress,
                activeToken.data.nativeName,
                convertStringToBigNumber(
                  props.amount,
                  activeToken.data.decimals
                ).toString(),
                CantoMainnet.cosmosAPIEndpoint,
                fee,
                chain,
                memo
              );
            } else {
              await txConvertERC20(
                activeToken.data.address,
                convertStringToBigNumber(
                  props.amount,
                  activeToken.data.decimals
                ).toString(),
                props.cantoAddress,
                CantoMainnet.cosmosAPIEndpoint,
                fee,
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
