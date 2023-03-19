import { CantoMainnet } from "global/config/networks";
import { useBridgeStore } from "./stores/gravityStore";
import { TokenWallet } from "./components/TokenSelect";
import { useEthers } from "@usedapp/core";
import { chain, ibcFee, memo } from "global/config/cosmosConstants";
import { txIBCTransfer } from "./utils/IBC/IBCTransfer";
import { ConvertTransferBox } from "./components/convertTransferBox";
import { useNetworkInfo } from "global/stores/networkInfo";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import cantoIcon from "assets/icons/canto-evm.svg";
import SwitchBridging from "./components/SwitchBridging";
import bridgeIcon from "assets/icons/canto-bridge.svg";
import {
  BaseToken,
  BridgeTransactionType,
  EmptySelectedConvertToken,
  EmptySelectedNativeToken,
  UserConvertToken,
  UserNativeTokens,
} from "./config/interfaces";
import { SelectedTokens, TokenStore } from "./stores/tokenStore";
import { GeneralTransferBox } from "./components/generalTransferBox";
import { formatUnits } from "ethers/lib/utils";
import { convertStringToBigNumber } from "./utils/stringToBigNumber";
import FadeIn from "react-fade-in";
import { PrimaryButton } from "global/packages/src";
import { Text } from "global/packages/src/components/atoms/Text";
import { BridgeStyled } from "./BridgeIn";
import { Mixpanel } from "mixpanel";
import { CantoTransactionType } from "global/config/transactionTypes";
import {
  BridgeChecklistBox,
  ClosedCheckbox,
} from "./components/BridgeChecklistBox";
import useBridgeTxStore from "./stores/transactionStore";
import { performBridgeCosmosTxAndSetStatus } from "./utils/bridgeCosmosTxUtils";
import { useCustomCantoToCosmosInfo } from "./hooks/customBridgeOutInfo";
import { BridgeOutChecklistFunctionTracker } from "./config/transactionChecklist";
import { useCustomConvertInfo } from "./hooks/customConvertInfo";
import { useBridgeOutChecklistSetter } from "./hooks/useBridgeOutChecklistSetter";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { setSafeConnector } from "global/components/cantoNav";

interface BridgeOutProps {
  userConvertERC20Tokens: UserConvertToken[];
  userCantoNativeGTokens: UserNativeTokens[];
  selectedTokens: TokenStore["selectedTokens"];
  setToken: (token: BaseToken, selectedFrom: SelectedTokens) => void;
}
const BridgeOut = (props: BridgeOutProps) => {
  const { account, cantoAddress, chainId } = useNetworkInfo();
  const bridgeTxStore = useBridgeTxStore();
  const { transactionType: currentTxType } = useBridgeStore();
  const selectedConvertToken = props.selectedTokens[SelectedTokens.CONVERTOUT];
  const selectedNativeToken = props.selectedTokens[SelectedTokens.BRIDGEOUT];

  const {
    bridgeOutNetwork,
    amount: bridgeOutAmount,
    setAmount: setBridgeOutAmount,
    userCosmosAddress,
    setUserCosmosAddress,
    bridgeDisabled,
    bridgeButtonText,
  } = useCustomCantoToCosmosInfo(selectedNativeToken);

  const {
    amount: convertAmount,
    setAmount: setConvertAmount,
    convertButtonText,
    convertDisabled,
  } = useCustomConvertInfo(false, selectedConvertToken);

  const { activateBrowserWallet } = useEthers();
  const { addTx, removeTx, currentStep, totalTxs } =
    useBridgeOutChecklistSetter(
      currentTxType,
      Number(chainId),
      bridgeDisabled,
      convertDisabled
    );
  const navigate = useNavigate();
  const [inSafe, setInSafe]= useState(false);
  setSafeConnector().then((value)=>{
    setInSafe(value);
  })
  return (
    <FadeIn wrapperTag={BridgeStyled}>
      <ClosedCheckbox
        style={{ top: "0", marginTop: "8px" }}
        onClick={() => navigate("/bridge/walkthrough")}
      >
        <Text type="text" size="text2">
          Guide
        </Text>
      </ClosedCheckbox>
      <BridgeChecklistBox
        trackerList={BridgeOutChecklistFunctionTracker}
        totalTxs={totalTxs}
        currentStep={currentStep}
        addTx={addTx}
        removeTx={removeTx}
      />
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
          icon: bridgeOutNetwork.icon,
          name: bridgeOutNetwork.name,
          height: 48,
          selectable: true,
        }}
        bridgeIn={false}
      />

      {currentTxType == "Bridge" && (
        <ConvertTransferBox
          tokenSelector={
            <TokenWallet
              tokens={props.userConvertERC20Tokens}
              balance="erc20Balance"
              activeToken={selectedConvertToken}
              onSelect={(value) => {
                props.setToken(
                  value ?? EmptySelectedConvertToken,
                  SelectedTokens.CONVERTOUT
                );
              }}
            />
          }
          activeToken={selectedConvertToken}
          cantoToEVM={false}
          cantoAddress={cantoAddress}
          ETHAddress={account ?? ""}
          chainId={Number(chainId)}
          amount={convertAmount}
          onChange={(amount: string) => setConvertAmount(amount)}
          onSwitch={() => {
            inSafe? activateBrowserWallet({ type: "safe" }) : activateBrowserWallet({ type: "metamask" })
            addNetwork();
          }}
          convertButtonText={convertButtonText}
          convertDisabled={convertDisabled}
        />
      )}

      {currentTxType == "Convert" && (
        <GeneralTransferBox
          tokenSelector={
            <TokenWallet
              tokens={props.userCantoNativeGTokens}
              balance="nativeBalance"
              activeToken={selectedNativeToken}
              onSelect={(value) => {
                props.setToken(
                  value ?? EmptySelectedNativeToken,
                  SelectedTokens.BRIDGEOUT
                );
              }}
            />
          }
          needAddressBox={true}
          onAddressChange={(value: string) => {
            setUserCosmosAddress(value);
          }}
          AddressBoxPlaceholder={`${bridgeOutNetwork.name} address (${bridgeOutNetwork.addressBeginning}...)`}
          from={{
            address: cantoAddress,
            name: "canto (bridge)",
            icon: bridgeIcon,
          }}
          to={{
            address: userCosmosAddress,
            name: bridgeOutNetwork.name,
            icon: bridgeOutNetwork.icon,
          }}
          networkName="canto"
          onSwitch={() => {
            inSafe? activateBrowserWallet({ type: "safe" }) : activateBrowserWallet({ type: "metamask" })
            addNetwork();
          }}
          connected={CantoMainnet.chainId == Number(chainId)}
          onChange={(amount: string) => {
            setBridgeOutAmount(amount);
          }}
          max={formatUnits(
            selectedNativeToken.nativeBalance,
            selectedNativeToken.decimals
          )}
          amount={bridgeOutAmount}
          button={
            <PrimaryButton
              height="big"
              weight="bold"
              disabled={bridgeDisabled}
              onClick={async () => {
                Mixpanel.events.transactions.transactionStarted(
                  CantoTransactionType.BRIDGE_OUT,
                  {
                    tokenName: selectedNativeToken.symbol,
                    amount: bridgeOutAmount,
                    bridgeOutNetwork: bridgeOutNetwork.name,
                  }
                );
                performBridgeCosmosTxAndSetStatus(
                  async () =>
                    await txIBCTransfer(
                      userCosmosAddress,
                      bridgeOutNetwork.channel,
                      convertStringToBigNumber(
                        bridgeOutAmount,
                        selectedNativeToken.decimals
                      ).toString(),
                      selectedNativeToken.ibcDenom,
                      CantoMainnet.cosmosAPIEndpoint,
                      bridgeOutNetwork.endpoint,
                      bridgeOutNetwork.latestBlockEndpoint,
                      ibcFee,
                      chain,
                      memo,
                      bridgeOutNetwork.extraEndpoints
                    ),
                  BridgeTransactionType.BRIDGE_OUT,
                  bridgeTxStore.setTransactionStatus,
                  selectedNativeToken.name,
                  bridgeOutAmount,
                  "canto bridge",
                  bridgeOutNetwork.name
                );
              }}
            >
              {bridgeButtonText}
            </PrimaryButton>
          }
        />
      )}
    </FadeIn>
  );
};

export default BridgeOut;
