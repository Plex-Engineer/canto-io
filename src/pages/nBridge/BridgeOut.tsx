import { CantoMainnet, PrimaryButton, Text } from "cantoui";
import { useEffect, useState } from "react";
import { useBridgeStore } from "./stores/gravityStore";
import styled from "@emotion/styled";
import { TokenWallet } from "./components/TokenSelect";
import bridgeIcon from "assets/bridge.svg";
import { useEthers } from "@usedapp/core";
import { BigNumber } from "ethers";
import { chain, fee, memo } from "./config/networks";
import { txIBCTransfer } from "./utils/IBC/IBCTransfer";
import { toastBridge } from "./utils/bridgeConfirmations";
import { ConvertTransferBox } from "./components/convertTransferBox";
import { useNetworkInfo } from "global/stores/networkInfo";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import cantoIcon from "assets/logo.svg";
import SwitchBridging from "./components/SwitchBridging";
import { UserNativeGTokens } from "pages/bridge/config/interfaces";
import { emptySelectedToken } from "./config/interfaces";
import { useTokenStore } from "./stores/cosmosTokens";
import { GeneralTransferBox } from "./components/generalTransferBox";
import { formatUnits } from "ethers/lib/utils";
import { getBridgeOutButtonText } from "./utils/reactiveButtonText";
import { convertStringToBigNumber } from "./utils/stringToBigNumber";

interface BridgeOutProps {
  userCantoNativeGTokens: UserNativeGTokens[];
}
const BridgeOut = ({ userCantoNativeGTokens }: BridgeOutProps) => {
  const networkInfo = useNetworkInfo();
  const tokenStore = useTokenStore();
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
    convertStringToBigNumber(amount, tokenStore.selectedToken.data.decimals),
    tokenStore.selectedToken,
    tokenStore.selectedToken.nativeBalanceOf,
    userGravityAddress
  );

  //Useffect for calling data per block
  useEffect(() => {
    const interval = setInterval(async () => {
      //check if bridging
      if (
        inBridgeTransaction &&
        !tokenStore.selectedToken.nativeBalanceOf.eq(prevBridgeBalance)
      ) {
        setBridgeConfirmation(
          "you have successfully bridged " +
            tokenStore.selectedToken.data.symbol +
            " from canto to gravity bridge"
        );
        setInBridgeTransaction(false);
        toastBridge(true);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [userCantoNativeGTokens]);

  return (
    <Container>
      <Text type="title" color="primary">
        send funds from canto
      </Text>

      <Text type="text" color="primary" style={{ width: "70%" }}>
        you must bridge your assets from the canto EVM to the canto (bridge) to
        bridge out{" "}
        <a
          href="https://docs.canto.io/user-guides/converting-assets"
          style={{
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          read more
        </a>
        .
      </Text>

      <SwitchBridging
        left={{
          icon: cantoIcon,
          name: "canto (EVM)",
        }}
        right={{
          icon: "https://raw.githubusercontent.com/Gravity-Bridge/Gravity-Docs/main/assets/Graviton-Grey.svg",
          name: "gravity Bridge",
          height: 30,
        }}
      />

      {bridgeStore.transactionType == "Bridge" && (
        <ConvertTransferBox
          tokenSelector={
            <TokenWallet
              tokens={userCantoNativeGTokens}
              onSelect={(value) => {
                tokenStore.setSelectedToken(value ?? emptySelectedToken);
                setInBridgeTransaction(false);
              }}
            />
          }
          cantoToEVM={false}
          cantoAddress={networkInfo.cantoAddress}
          ETHAddress={networkInfo.account ?? ""}
          chainId={Number(networkInfo.chainId)}
          amount={amount}
          max={tokenStore.selectedToken.balanceOf}
          onChange={(amount: string) => setAmount(amount)}
          onSwitch={() => {
            activateBrowserWallet();
            addNetwork();
          }}
        />
      )}

      {/* <Text type="text" color="white" style={{ width: "70%" }}>
        it could take several minutes for your bridged assets to arrive on the
        gravity bridge network. for more detail, read{" "}
        <a
          href="https://docs.canto.io/user-guides/bridging-assets"
          style={{
            color: "white",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          here
        </a>
        .
      </Text> */}
      {bridgeStore.transactionType == "Convert" && (
        <GeneralTransferBox
          tokenSelector={
            <TokenWallet
              tokens={userCantoNativeGTokens}
              onSelect={(value) => {
                tokenStore.setSelectedToken(value ?? emptySelectedToken);
                setInBridgeTransaction(false);
              }}
            />
          }
          needAddressBox={true}
          onAddressChange={(value) => {
            setUserGravityAddress(value);
          }}
          from={{
            address: networkInfo.cantoAddress,
            name: "canto (bridge)",
            icon: bridgeIcon,
          }}
          to={{
            address: userGravityAddress,
            name: "gravity bridge",
            icon: "https://raw.githubusercontent.com/Gravity-Bridge/Gravity-Docs/main/assets/Graviton-Grey.svg",
          }}
          networkName="canto"
          onSwitch={() => {
            activateBrowserWallet();
            addNetwork();
          }}
          connected={CantoMainnet.chainId == Number(networkInfo.chainId)}
          onChange={(amount) => {
            setAmount(amount);
          }}
          max={formatUnits(
            tokenStore.selectedToken.nativeBalanceOf,
            tokenStore.selectedToken.data.decimals
          )}
          amount={amount}
          button={
            <PrimaryButton
              disabled={disabled}
              onClick={async () => {
                setInBridgeTransaction(true);
                setBridgeConfirmation(
                  "waiting for the metamask transaction to be signed..."
                );
                setPrevBridgeBalance(tokenStore.selectedToken.nativeBalanceOf);
                await txIBCTransfer(
                  userGravityAddress,
                  "channel-0",
                  convertStringToBigNumber(
                    amount,
                    tokenStore.selectedToken.data.decimals
                  ).toString(),
                  tokenStore.selectedToken.data.nativeName,
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
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
`;
export default BridgeOut;
