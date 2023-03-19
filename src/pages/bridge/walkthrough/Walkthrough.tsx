import styled from "@emotion/styled";
import { useState } from "react";
import { useBridgeWalkthroughStore } from "./store/bridgeWalkthroughStore";
import { BridgeOutManager } from "./managers/BridgeOutManager";
import IntroPage from "./pages/intro";
import { useCustomWalkthrough } from "./store/customUseWalkthrough";
import { BridgeInManager } from "./managers/BridgeInManager";
import { BridgeInStep, BridgeOutStep } from "./walkthroughTracker";
import { GenPubKeyWalkthrough } from "./pages/genPubKey";
import NoFunds from "./pages/noFunds";
import LoadingWalkthrough from "./pages/LoadingWalkthrough";
import { useEthers } from "@usedapp/core";
import NotConnected from "global/packages/src/components/molecules/NotConnected";
import walletIcon from "assets/wallet.svg";
import warningIcon from "assets/warning.svg";
import { useNavigate } from "react-router-dom";
import BalanceTableModal from "./components/BalanceTableModal";
import { setSafeConnector } from "global/components/cantoNav";

const Walkthrough = () => {
  const walkthrough = useBridgeWalkthroughStore();
  const { active: isConnected, activateBrowserWallet } = useEthers();
  const [inSafe, setInSafe]= useState(false);
  const navigate = useNavigate();
  const {
    canSkip,
    notEnoughCantoBalance,
    canContinue,
    canGoBack,
    chainId,
    cantoAddress,
    gravityAddress,
    tokens,
    bridgeInTx,
    bridgeOutNetworks,
    amount,
    setAmount,
    cosmosTxStatus,
    setCosmosTxStatus,
    canBridgeIn,
    canBridgeOut,
    needPubKey,
    canPubKey,
    pubKey,
    userCosmosSend,
  } = useCustomWalkthrough();
  const [finishedBridgeSelection, setFinishedBridgeSelection] = useState(false);
  function restartWalkthrough() {
    setFinishedBridgeSelection(false);
    walkthrough.resetState(true);
    walkthrough.resetState(false);
  }

  if (needPubKey) {
    if (!canPubKey) {
      return (
        <Styled>
          <NotConnected
            title="No Public Key"
            subtext="It seems like you don't have a public key on this account. In order to generate a public key, you must have at least 0.5 CANTO or 0.01 ETH on mainnet"
            buttonText="Home"
            onClick={() => {
              navigate("/");
            }}
            icon={warningIcon}
          />
        </Styled>
      );
    }
    return (
      <GenPubKeyWalkthrough txGenPubKey={pubKey.tx} txStatus={pubKey.status} />
    );
  }

  const hasFunds = canBridgeIn || canBridgeOut;

  setSafeConnector().then((value)=>{
    setInSafe(value);
  })
  if (!isConnected) {
    return (
      <Styled>
        <NotConnected
          buttonText="connect wallet"
          title="Wallet is not connected"
          subtext="to use the bridge guide you need to connect a wallet through metamask"
          icon={walletIcon}
          onClick={()=>{inSafe? activateBrowserWallet({ type: "safe" }) : activateBrowserWallet({ type: "metamask" })}}
        />
      </Styled>
    );
  }
  return (
    <Styled>
      <BalanceTableModal
        ethTokens={tokens.allUserTokens.bridgeInTokens}
        convertTokens={tokens.allUserTokens.convertTokens}
      />
      <LoadingWalkthrough delay={2500} />
      {!hasFunds && <NoFunds />}
      {!finishedBridgeSelection && hasFunds && (
        <IntroPage
          setBridgeType={walkthrough.setBridgeType}
          currentBridgeType={walkthrough.currentBridgeType}
          canSkip={canSkip}
          currentSkipDecision={walkthrough.userSkip}
          setSkipDecision={walkthrough.setUserSkip}
          onNext={() => {
            if (walkthrough.userSkip) {
              if (walkthrough.currentBridgeType === "IN") {
                walkthrough.setBridgeInStep(BridgeInStep.SWITCH_TO_CANTO);
              } else {
                walkthrough.setBridgeOutStep(BridgeOutStep.SWITCH_TO_CANTO_2);
              }
            }
            setFinishedBridgeSelection(true);
          }}
          canBridgeIn={canBridgeIn}
          canBridgeOut={canBridgeOut}
          ethTokens={tokens.allUserTokens.bridgeInTokens}
          convertTokens={tokens.allUserTokens.convertTokens}
        />
      )}
      {finishedBridgeSelection &&
        hasFunds &&
        walkthrough.currentBridgeType == "IN" && (
          <BridgeInManager
            chainId={chainId}
            notEnoughCantoBalance={notEnoughCantoBalance}
            cantoAddress={cantoAddress}
            currentStep={walkthrough.bridgeInStep}
            onPrev={() => {
              if (walkthrough.bridgeInStep === 0) {
                setFinishedBridgeSelection(false);
              } else {
                walkthrough.previousStep(true);
              }
            }}
            onNext={() => walkthrough.nextStep(true)}
            canContinue={canContinue}
            canGoBack={canGoBack}
            currentBridgeInToken={tokens.selectedTokens.bridgeInToken}
            bridgeInTokens={tokens.allUserTokens.bridgeInTokens}
            setToken={tokens.setTokens}
            amount={amount}
            setAmount={setAmount}
            sendApprove={bridgeInTx.approve.tx}
            stateApprove={bridgeInTx.approve.state}
            gravityAddress={gravityAddress}
            sendCosmos={bridgeInTx.sendCosmos.tx}
            stateCosmos={bridgeInTx.sendCosmos.state}
            convertTokens={tokens.allUserTokens.convertTokens}
            currentConvertToken={tokens.selectedTokens.convertInToken}
            cosmosTxStatus={cosmosTxStatus}
            setCosmosTxStatus={setCosmosTxStatus}
            restartWalkthrough={restartWalkthrough}
          />
        )}

      {finishedBridgeSelection &&
        hasFunds &&
        walkthrough.currentBridgeType == "OUT" && (
          <BridgeOutManager
            chainId={chainId}
            notEnoughCantoBalance={notEnoughCantoBalance}
            cantoAddress={cantoAddress}
            currentStep={walkthrough.bridgeOutStep}
            onPrev={() => {
              if (walkthrough.bridgeOutStep === 0) {
                setFinishedBridgeSelection(false);
              } else {
                walkthrough.previousStep(false);
              }
            }}
            onNext={() => walkthrough.nextStep(false)}
            canContinue={canContinue}
            canGoBack={canGoBack}
            convertTokens={tokens.allUserTokens.convertTokens}
            currentConvertToken={tokens.selectedTokens.convertOutToken}
            bridgeOutTokens={tokens.allUserTokens.bridgeOutTokens}
            currentBridgeOutToken={tokens.selectedTokens.bridgeOutToken}
            bridgeOutNetworks={bridgeOutNetworks.allNetworks}
            currentBridgeOutNetwork={bridgeOutNetworks.selectedNetwork}
            setBridgeOutNetwork={bridgeOutNetworks.setNetwork}
            setToken={tokens.setTokens}
            amount={amount}
            setAmount={setAmount}
            cosmosTxStatus={cosmosTxStatus}
            setCosmosTxStatus={setCosmosTxStatus}
            restartWalkthrough={restartWalkthrough}
            userCosmosSend={userCosmosSend}
          />
        )}
    </Styled>
  );
};

const Styled = styled.div`
  background-color: black;
  height: 100%;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
`;

export default Walkthrough;
