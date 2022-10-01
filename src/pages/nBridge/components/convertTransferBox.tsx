import { useEthers } from "@usedapp/core";
import { CantoMainnet, PrimaryButton } from "cantoui";
import cantoIcon from "assets/logo.svg";
import { chain, fee, memo } from "../config/networks";
import { ethers } from "ethers";
import { NativeGTokens } from "../hooks/useCosmosTokens";
import { useEffect, useState } from "react";
import { selectedEmptyToken } from "../stores/gravityStore";
import {
  txConvertCoin,
  txConvertERC20,
} from "../utils/convertCoin/convertTransactions";
import TransferBox from "./TransferBox";
import { toastBridge } from "../utils/bridgeConfirmations";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import bridgeIcon from "assets/bridge.svg";

interface ConvertTransferBoxProps {
  cantoToEVM: boolean;
  cantoAddress: string;
  ETHAddress: string;
  token: NativeGTokens;
  chainId: number;
  tokenSelector: React.ReactNode;
}
export const ConvertTransferBox = (props: ConvertTransferBoxProps) => {
  const { activateBrowserWallet, switchNetwork } = useEthers();
  //CONVERT STATES
  const [convertAmount, setConvertAmount] = useState("0");
  //convert states to update the user
  const [convertConfirmation, setConvertConfirmation] =
    useState("select a token");
  const [inConvertTransaction, setInConvertTransaction] =
    useState<boolean>(false);
  //used to check if convert coin ws successful
  const [prevConvertBalance, setPrevConvertBalance] = useState(0);

  const [convertDisabled, setConvertDisabled] = useState<boolean>(true);
  const [currentToken, setCurrentToken] = useState(selectedEmptyToken);

  const maxAmount = props.cantoToEVM
    ? props.token.nativeBalanceOf
    : props.token.balanceOf;

  if (inConvertTransaction) {
    if (currentToken.data.address == props.token.data.address) {
      if (Number(props.token.nativeBalanceOf) != prevConvertBalance) {
        const msg = props.cantoToEVM
          ? " from canto to evm"
          : " from evm to canto";
        setConvertConfirmation(
          "you have successfully bridged " + props.token.data.symbol + msg
        );
        setInConvertTransaction(false);
        toastBridge(true);
      }
    } else {
      setInConvertTransaction(false);
    }
  }
  function checkConvertConfirmation(amount: string) {
    if (props.token == selectedEmptyToken) {
      setConvertConfirmation("select a token");
      setConvertDisabled(true);
    } else if (Number(amount) <= 0) {
      setConvertConfirmation("enter amount");
      setConvertDisabled(true);
    } else if (Number(amount) > maxAmount) {
      setConvertConfirmation("insufficient funds");
      setConvertDisabled(true);
    } else {
      if (
        props.chainId != CantoMainnet.chainId ||
        !props.cantoAddress ||
        !props.ETHAddress
      ) {
        setConvertDisabled(true);
      } else {
        setConvertDisabled(false);
      }
      setConvertConfirmation(props.cantoToEVM ? "bridge in" : "bridge out");
    }
  }
  useEffect(() => {
    if (!inConvertTransaction) {
      checkConvertConfirmation(convertAmount);
    }
  }, [inConvertTransaction, props.token]);

  return (
    <TransferBox
      tokenSelector={props.tokenSelector}
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
      tokenIcon={props.token.data.icon}
      networkName="canto"
      onSwitch={() => {
        activateBrowserWallet();
        addNetwork();
        switchNetwork(7700);
      }}
      tokenSymbol={props.token.data.symbol}
      connected={CantoMainnet.chainId == props.chainId}
      onChange={(amount: string) => {
        setConvertAmount(amount);
        checkConvertConfirmation(amount);
      }}
      max={maxAmount.toString()}
      amount={convertAmount}
      button={
        <PrimaryButton
          disabled={convertDisabled}
          onClick={async () => {
            setConvertConfirmation(
              "waiting for the metamask transaction to be signed..."
            );
            if (props.cantoToEVM) {
              await txConvertCoin(
                props.cantoAddress,
                props.token.data.nativeName,
                ethers.utils
                  .parseUnits(convertAmount, props.token.data.decimals)
                  .toString(),
                CantoMainnet.cosmosAPIEndpoint,
                fee,
                chain,
                memo
              );
            } else {
              await txConvertERC20(
                props.token.data.address,
                ethers.utils
                  .parseUnits(convertAmount, props.token.data.decimals)
                  .toString(),
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
            setPrevConvertBalance(Number(props.token.nativeBalanceOf));
            setInConvertTransaction(true);
            setCurrentToken(props.token);
          }}
        >
          {convertConfirmation}
        </PrimaryButton>
      }
    />
  );
};
