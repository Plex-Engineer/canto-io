import { CantoMainnet } from "cantoui";
import { useEffect, useState } from "react";
import { useBridgeStore } from "./stores/gravityStore";
import styled from "@emotion/styled";
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
  const selectedConvertToken =
    tokenStore.selectedTokens[SelectedTokens.CONVERTOUT];
  const selectedNativeToken =
    tokenStore.selectedTokens[SelectedTokens.BRIDGEOUT];

  const bridgeStore = useBridgeStore();
  const { activateBrowserWallet } = useEthers();

  //BRIDGE OUT STATES
  const [userGravityAddress, setUserGravityAddress] = useState("");
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
    userGravityAddress
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
    <Styled as={FadeIn}>
      <div className="title">
        <Text
          size="title2"
          type="title"
          color="primary"
          style={{
            fontFamily: "Silkscreen",
            lineHeight: "3rem",
          }}
        >
          send funds from canto
        </Text>

        <Text type="text" size={"text3"} color="primary">
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
            read more here
          </a>
        </Text>
      </div>

      <SwitchBridging
        left={{
          icon: cantoIcon,
          name: "EVM",
        }}
        right={{
          icon: "https://raw.githubusercontent.com/Gravity-Bridge/Gravity-Docs/main/assets/Graviton-Grey.svg",
          name: "gravity Bridge",
          height: 48,
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
            setUserGravityAddress(value);
          }}
          from={{
            address: networkInfo.cantoAddress,
            name: "canto (bridge)",
            // icon: bridgeIcon,
          }}
          to={{
            address: userGravityAddress,
            name: "gravity bridge",
            // icon: "https://raw.githubusercontent.com/Gravity-Bridge/Gravity-Docs/main/assets/Graviton-Grey.svg",
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
                setInBridgeTransaction(true);
                setBridgeConfirmation(
                  "waiting for the metamask transaction to be signed..."
                );
                setPrevBridgeBalance(selectedNativeToken.nativeBalance);
                await txIBCTransfer(
                  userGravityAddress,
                  "channel-0",
                  convertStringToBigNumber(
                    amount,
                    selectedNativeToken.decimals
                  ).toString(),
                  selectedNativeToken.nativeName,
                  CantoMainnet.cosmosAPIEndpoint,
                  "https://gravitychain.io:1317",
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
    </Styled>
  );
};

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;
`;
export default BridgeOut;
