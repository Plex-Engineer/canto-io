import { useBridgeStore } from "./stores/gravityStore";
import styled from "@emotion/styled";
import { useEthers } from "@usedapp/core";
import { useNetworkInfo } from "global/stores/networkInfo";
import SwitchBridging from "./components/SwitchBridging";
import cantoIcon from "assets/icons/canto-evm.svg";
import ethIcon from "assets/icons/ETH.svg";
import { ReactiveButton } from "./components/ReactiveButton";
import { ConvertTransferBox } from "./components/convertTransferBox";
import { TokenWallet } from "./components/TokenSelect";
import {
  UserGravityBridgeTokens,
  EmptySelectedETHToken,
  EmptySelectedNativeToken,
  UserConvertToken,
  BaseToken,
} from "./config/interfaces";
import { SelectedTokens, TokenStore } from "./stores/tokenStore";
import { formatUnits } from "ethers/lib/utils";
import { GeneralTransferBox } from "./components/generalTransferBox";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import FadeIn from "react-fade-in";
import { Text } from "global/packages/src";
import bridgeIcon from "assets/icons/canto-bridge.svg";
import {
  BridgeChecklistBox,
  ClosedCheckbox,
} from "./components/BridgeChecklistBox";
import { BridgeInChecklistFunctionTracker } from "./config/transactionChecklist";
import { useBridgeEthToCantoInfo } from "./hooks/customBridgeInInfo";
import { useCustomConvertInfo } from "./hooks/customConvertInfo";
import { useBridgeInChecklistSetter } from "./hooks/useBridgeInChecklistSetter";
import { useNavigate } from "react-router-dom";
import { ReactNode, useState } from "react";
import { setSafeConnector } from "global/components/cantoNav";

interface BridgeInProps {
  userEthTokens: UserGravityBridgeTokens[];
  gravityAddress: string | undefined;
  userConvertCoinNativeTokens: UserConvertToken[];
  selectedTokens: TokenStore["selectedTokens"];
  setToken: (token: BaseToken, selectedFrom: SelectedTokens) => void;
  bridgeInUserStatus: ReactNode;
}
const BridgeIn = (props: BridgeInProps) => {
  const { account, cantoAddress, chainId } = useNetworkInfo();
  const { switchNetwork, activateBrowserWallet } = useEthers();
  const selectedETHToken = props.selectedTokens[SelectedTokens.ETHTOKEN];
  const selectedConvertToken = props.selectedTokens[SelectedTokens.CONVERTIN];
  const { transactionType: currentTxType } = useBridgeStore();

  const {
    amount: ethToGBridgeAmount,
    setAmount: setEthToGBridgeAmount,
    bridgeButtonText,
    bridgeDisabled,
    sendEthToGBridge,
    stateApprove,
    stateCosmos,
    resetApprove,
    resetCosmos,
  } = useBridgeEthToCantoInfo(
    selectedETHToken,
    props.setToken,
    props.gravityAddress
  );

  const {
    amount: convertAmount,
    setAmount: setConvertAmount,
    convertButtonText,
    convertDisabled,
  } = useCustomConvertInfo(true, selectedConvertToken);

  const { addTx, removeTx, currentStep, totalTxs } = useBridgeInChecklistSetter(
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
      <div className="title">
        <ClosedCheckbox
          style={{ top: "0", marginTop: "8px" }}
          onClick={() => navigate("/bridge/walkthrough")}
        >
          <Text type="text" size="text2">
            Guide
          </Text>
        </ClosedCheckbox>
        <BridgeChecklistBox
          trackerList={BridgeInChecklistFunctionTracker}
          totalTxs={totalTxs}
          currentStep={currentStep}
          addTx={addTx}
          removeTx={removeTx}
        />
        {/* <Text
          type="title"
          size="title2"
          color="primary"
          style={{
            fontFamily: "Silkscreen",
            lineHeight: "3rem",
          }}
        >
          send funds to canto
        </Text> */}
        <div>
          <Text type="title" size="title3">
            {props.bridgeInUserStatus}
          </Text>
        </div>

        {/* 
        <Text
          type="text"
          color="primary"
          style={{
            margin: "0 1rem",
            fontSize: "14px",
            lineHeight: "20.3px",
          }}
        >
          funds are transferred in two steps through our canto bridge. for more
          details{" "}
          <a
            role="button"
            tabIndex={0}
            onClick={() =>
              window.open(
                "https://docs.canto.io/user-guides/bridging-assets/ethereum",
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
        </Text> */}
      </div>
      <SwitchBridging
        left={{
          icon: ethIcon,
          name: "Ethereum",
        }}
        right={{
          icon: cantoIcon,
          name: "EVM",
        }}
        bridgeIn={true}
      />

      {currentTxType == "Bridge" && (
        <GeneralTransferBox
          tokenSelector={
            <TokenWallet
              tokens={props.userEthTokens}
              balance={"balanceOf"}
              activeToken={selectedETHToken}
              onSelect={(value) => {
                props.setToken(
                  value ?? EmptySelectedETHToken,
                  SelectedTokens.ETHTOKEN
                );
                resetCosmos();
                resetApprove();
              }}
            />
          }
          needAddressBox={false}
          from={{
            address: account,
            name: "ethereum",
            icon: ethIcon,
          }}
          to={{
            address: cantoAddress,
            name: "canto (bridge)",
            icon: bridgeIcon,
          }}
          networkName="ethereum"
          onSwitch={() => {
            inSafe? activateBrowserWallet({ type: "safe" }) : activateBrowserWallet({ type: "metamask" })
            switchNetwork(1);
          }}
          connected={1 == Number(chainId)}
          onChange={(amount: string) => setEthToGBridgeAmount(amount)}
          max={formatUnits(
            selectedETHToken.balanceOf,
            selectedETHToken.decimals
          )}
          amount={ethToGBridgeAmount}
          button={
            <ReactiveButton
              destination={cantoAddress}
              account={account}
              gravityAddress={props.gravityAddress}
              onClick={() => sendEthToGBridge(ethToGBridgeAmount)}
              approveStatus={stateApprove}
              cosmosStatus={stateCosmos}
              buttonText={bridgeButtonText}
              buttonDisabled={bridgeDisabled}
            />
          }
        />
      )}

      {currentTxType == "Convert" && (
        <ConvertTransferBox
          tokenSelector={
            <TokenWallet
              tokens={props.userConvertCoinNativeTokens}
              balance="nativeBalance"
              activeToken={selectedConvertToken}
              onSelect={(value) => {
                props.setToken(
                  value ?? EmptySelectedNativeToken,
                  SelectedTokens.CONVERTIN
                );
                resetCosmos();
                resetApprove();
              }}
            />
          }
          activeToken={selectedConvertToken}
          cantoToEVM={true}
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
    </FadeIn>
  );
};

export const BridgeStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding: 60px 0;
  flex-grow: 1;
  width: 100%;
  position: relative;
  @media (max-width: 1000px) {
    br {
      display: none;
    }
  }
`;
export default BridgeIn;
