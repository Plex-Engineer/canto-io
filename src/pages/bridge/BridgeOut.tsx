import { CantoMainnet } from "global/config/networks";
import { useEffect, useState } from "react";
import { useBridgeStore } from "./stores/gravityStore";
import { TokenWallet } from "./components/TokenSelect";
import { useEthers } from "@usedapp/core";
import { BigNumber } from "ethers";
import { chain, fee, memo } from "./config/networks";
import { txIBCTransfer } from "./utils/IBC/IBCTransfer";
import { toastBridge } from "./utils/bridgeConfirmations";
import { ConvertTransferBox } from "./components/convertTransferBox";
import { useNetworkInfo } from "global/stores/networkInfo";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import cantoIcon from "assets/icons/canto-evm.svg";
import SwitchBridging from "./components/SwitchBridging";
import bridgeIcon from "assets/icons/canto-bridge.svg";

import {
  EmptySelectedConvertToken,
  EmptySelectedNativeToken,
  UserConvertToken,
  UserNativeTokens,
} from "./config/interfaces";
import { SelectedTokens, useTokenStore } from "./stores/tokenStore";
import { GeneralTransferBox } from "./components/generalTransferBox";
import { formatUnits } from "ethers/lib/utils";
import { convertStringToBigNumber } from "./utils/stringToBigNumber";
import { getBridgeOutButtonText } from "./utils/reactiveButtonText";
import FadeIn from "react-fade-in";
import { PrimaryButton } from "global/packages/src";
import { Text } from "global/packages/src/components/atoms/Text";
import { BridgeStyled } from "./BridgeIn";
import { allBridgeOutNetworks } from "./config/gravityBridgeTokens";
import { Mixpanel } from "mixpanel";
import { CantoTransactionType } from "global/config/transactionTypes";

interface BridgeOutProps {
  userConvertERC20Tokens: UserConvertToken[];
  userCantoNativeGTokens: UserNativeTokens[];
}
const BridgeOut = ({
  userCantoNativeGTokens,
  userConvertERC20Tokens,
}: BridgeOutProps) => {
  const networkInfo = useNetworkInfo();
  const tokenStore = useTokenStore();
  const selectedBridgeOutNetwork =
    allBridgeOutNetworks[tokenStore.bridgeOutNetwork];
  const selectedConvertToken =
    tokenStore.selectedTokens[SelectedTokens.CONVERTOUT];
  const selectedNativeToken =
    tokenStore.selectedTokens[SelectedTokens.BRIDGEOUT];

  const bridgeStore = useBridgeStore();
  const { activateBrowserWallet } = useEthers();

  //BRIDGE OUT STATES
  const [userCosmosAddress, setUserCosmosAddress] = useState("");
  //bridging to gravity bridge status
  const [bridgeConfirmation, setBridgeConfirmation] =
    useState("select a token");
  const [inBridgeTransaction, setInBridgeTransaction] =
    useState<boolean>(false);
  const [prevBridgeBalance, setPrevBridgeBalance] = useState(BigNumber.from(0));
  const [amount, setAmount] = useState("");

  const [buttonText, disabled] = getBridgeOutButtonText(
    convertStringToBigNumber(amount, selectedNativeToken.decimals),
    selectedNativeToken,
    selectedNativeToken.nativeBalance,
    selectedBridgeOutNetwork.checkAddress(userCosmosAddress)
  );

  //Useffect for calling data per block
  useEffect(() => {
    const interval = setInterval(async () => {
      //check if bridging
      if (
        inBridgeTransaction &&
        !selectedNativeToken.nativeBalance.eq(prevBridgeBalance)
      ) {
        setBridgeConfirmation(
          "you have successfully bridged " +
            selectedNativeToken.symbol +
            " from canto to gravity bridge"
        );
        setInBridgeTransaction(false);
        toastBridge(true);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [userCantoNativeGTokens]);

  return (
    <FadeIn wrapperTag={BridgeStyled}>
      <div className="title">
        <Text
          type="title"
          size="title2"
          color="primary"
          style={{
            fontFamily: "Silkscreen",
            lineHeight: "3rem",
          }}
        >
          send funds from canto
        </Text>

        <Text
          type="text"
          color="primary"
          style={{
            margin: "0 1rem",
            fontSize: "14px",
            lineHeight: "20.3px",
          }}
        >
          you must bridge your assets from the canto EVM to <br /> the canto
          (bridge) to bridge out{" "}
          <a
            role="button"
            tabIndex={0}
            onClick={() =>
              window.open(
                "https://docs.canto.io/user-guides/converting-assets",
                "_blank"
              )
            }
            style={{
              color: "var(--primary-color)",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            read here
          </a>
          .
        </Text>
      </div>

      <SwitchBridging
        left={{
          icon: cantoIcon,
          name: "EVM",
        }}
        right={{
          icon: selectedBridgeOutNetwork.icon,
          name: selectedBridgeOutNetwork.name,
          height: 48,
          selectable: true,
        }}
      />

      {bridgeStore.transactionType == "Bridge" && (
        <ConvertTransferBox
          tokenSelector={
            <TokenWallet
              tokens={userConvertERC20Tokens}
              balance="erc20Balance"
              activeToken={selectedConvertToken}
              onSelect={(value) => {
                tokenStore.setSelectedToken(
                  value ?? EmptySelectedConvertToken,
                  SelectedTokens.CONVERTOUT
                );
                setInBridgeTransaction(false);
              }}
            />
          }
          activeToken={selectedConvertToken}
          cantoToEVM={false}
          cantoAddress={networkInfo.cantoAddress}
          ETHAddress={networkInfo.account ?? ""}
          chainId={Number(networkInfo.chainId)}
          amount={amount}
          max={selectedConvertToken.erc20Balance}
          onChange={(amount: string) => setAmount(amount)}
          onSwitch={() => {
            activateBrowserWallet();
            addNetwork();
          }}
        />
      )}

      {bridgeStore.transactionType == "Convert" && (
        <GeneralTransferBox
          tokenSelector={
            <TokenWallet
              tokens={userCantoNativeGTokens}
              balance="nativeBalance"
              activeToken={selectedNativeToken}
              onSelect={(value) => {
                tokenStore.setSelectedToken(
                  value ?? EmptySelectedNativeToken,
                  SelectedTokens.BRIDGEOUT
                );
                setInBridgeTransaction(false);
              }}
            />
          }
          needAddressBox={true}
          onAddressChange={(value: string) => {
            setUserCosmosAddress(value);
          }}
          AddressBoxPlaceholder={`${selectedBridgeOutNetwork.name} address (${selectedBridgeOutNetwork.addressBeginning}...)`}
          from={{
            address: networkInfo.cantoAddress,
            name: "canto (bridge)",
            icon: bridgeIcon,
          }}
          to={{
            address: userCosmosAddress,
            name: selectedBridgeOutNetwork.name,
            icon: selectedBridgeOutNetwork.icon,
          }}
          networkName="canto"
          onSwitch={() => {
            activateBrowserWallet();
            addNetwork();
          }}
          connected={CantoMainnet.chainId == Number(networkInfo.chainId)}
          onChange={(amount: string) => {
            setAmount(amount);
          }}
          max={formatUnits(
            selectedNativeToken.nativeBalance,
            selectedNativeToken.decimals
          )}
          amount={amount}
          button={
            <PrimaryButton
              height="big"
              weight="bold"
              disabled={disabled}
              onClick={async () => {
                Mixpanel.events.transactionStarted(
                  CantoTransactionType.BRIDGE_OUT,
                  networkInfo.account,
                  {
                    tokenName: selectedNativeToken.symbol,
                    amount: amount,
                    bridgeOutNetwork: selectedBridgeOutNetwork.name,
                  }
                );
                setInBridgeTransaction(true);
                setBridgeConfirmation(
                  "waiting for the metamask transaction to be signed..."
                );
                setPrevBridgeBalance(selectedNativeToken.nativeBalance);
                await txIBCTransfer(
                  userCosmosAddress,
                  selectedBridgeOutNetwork.channel,
                  convertStringToBigNumber(
                    amount,
                    selectedNativeToken.decimals
                  ).toString(),
                  selectedNativeToken.nativeName,
                  CantoMainnet.cosmosAPIEndpoint,
                  selectedBridgeOutNetwork.endpoint,
                  fee,
                  chain,
                  memo
                );
                setBridgeConfirmation(
                  "waiting for the transaction to be verified..."
                );
              }}
            >
              {inBridgeTransaction ? bridgeConfirmation : buttonText}
            </PrimaryButton>
          }
        />
      )}
    </FadeIn>
  );
};

export default BridgeOut;
