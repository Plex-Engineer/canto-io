import styled from "@emotion/styled";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import BridgeIn from "./BridgeIn";
import BridgeOut from "./BridgeOut";
import walletIcon from "assets/wallet.svg";
import Transactions from "./Transactions";
import { useEthers } from "@usedapp/core";
import NotConnected from "global/packages/src/components/molecules/NotConnected";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import { useBridgeTransactionPageStore } from "./stores/transactionPageStore";
import HelmetSEO from "global/components/seo";
import useBridgeTxStore from "./stores/transactionStore";
import { StyledPopup } from "global/components/Styled";
import GlobalLoadingModal from "global/components/modals/loadingModal";
import { CantoTransactionType } from "global/config/transactionTypes";
import { useCustomBridgeInfo } from "./hooks/useCustomBridgeInfo";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setSafeConnector } from "global/components/cantoNav";

const BridgingPage = () => {
  //all stores needed
  const [inSafe, setInSafe]= useState(false);
  const bridgeTxStore = useBridgeTxStore();
  const navigate = useNavigate();
  const transactionStore = useBridgeTransactionPageStore();
  const { activateBrowserWallet } = useEthers();
  const {
    account,
    hasPubKey,
    userConvertTokens,
    userBridgeInTokens,
    userBridgeOutTokens,
    gravityAddress,
    selectedTokens,
    setSelectedToken,
    bridgeInUserStatus,
  } = useCustomBridgeInfo();
  setSafeConnector().then((value)=>{
    setInSafe(value);
  })
  const notConnectedTabs = () => {
    const tabs = [];
    for (let i = 0; i < 3; i++) {
      tabs.push(
        <TabPanel key={i}>
          <NotConnected
            title="Wallet is not connected"
            subtext="to use bridge you need to connect a wallet through metamask"
            buttonText="connect wallet"
            bgFilled
            onClick={() => {
              inSafe? activateBrowserWallet({ type: "safe" }) : activateBrowserWallet({ type: "metamask" })
              addNetwork();
            }}
            icon={walletIcon}
          />
        </TabPanel>
      );
    }
    return tabs;
  };

  useEffect(() => {
    if (!hasPubKey) {
      navigate("/bridge/walkthrough");
    }
  }, [hasPubKey]);

  return (
    <>
      <HelmetSEO
        title="Canto - Bridging"
        description="A test message written for Bridging in and out"
        link="bridge"
      />
      <StyledPopup
        open={!!bridgeTxStore.transactionStatus}
        onClose={() => bridgeTxStore.setTransactionStatus(undefined)}
        lockScroll
        modal
        position="center center"
      >
        <BridgeModalContainer>
          <GlobalLoadingModal
            transactionType={CantoTransactionType.BRIDGE}
            status={bridgeTxStore.transactionStatus?.status ?? "Fail"}
            onClose={() => bridgeTxStore.setTransactionStatus(undefined)}
            tokenName="bridge"
            customMessage={bridgeTxStore.transactionStatus?.message}
          />
        </BridgeModalContainer>
      </StyledPopup>
      <Styled>
        <Tabs className="tabs">
          <TabList className="tablist">
            <Tab
              className="tab"
              // resetting the selected token when a new tab is selected
            >
              bridge in
            </Tab>
            <Tab
              className="tab"
              // resetting the selected token when a new tab is selected
            >
              bridge out
            </Tab>
            <Tab className="tab">
              transactions{" "}
              <StyledNotification
                notifications={transactionStore.newTransactions}
              >
                <div className="text">{transactionStore.newTransactions}</div>
              </StyledNotification>
            </Tab>
          </TabList>
          {!account && <>{notConnectedTabs().map((tab) => tab)}</>}
          {account && (
            <>
              <TabPanel>
                <BridgeIn
                  userEthTokens={userBridgeInTokens}
                  gravityAddress={gravityAddress}
                  userConvertCoinNativeTokens={userConvertTokens}
                  selectedTokens={selectedTokens}
                  setToken={setSelectedToken}
                  bridgeInUserStatus={bridgeInUserStatus}
                />
              </TabPanel>
              <TabPanel>
                <BridgeOut
                  userCantoNativeGTokens={userBridgeOutTokens}
                  userConvertERC20Tokens={userConvertTokens}
                  selectedTokens={selectedTokens}
                  setToken={setSelectedToken}
                />
              </TabPanel>
              <TabPanel>
                <Transactions />
              </TabPanel>
            </>
          )}
        </Tabs>
      </Styled>
    </>
  );
};

interface Props {
  notifications: number;
}
const StyledNotification = styled.div<Props>`
  display: ${(props) => (props.notifications > 0 ? "flex" : "none")};
  flex-direction: column;
  align-items: flex-start;
  padding: 0px 4px;
  gap: 9px;
  margin-bottom: 12px;
  width: 15px;
  height: 14px;
  left: 143px;
  top: 20px;

  background: #06fc99;
  border-radius: 39px;
  .text {
    width: 7px;
    height: 14px;

    font-family: "IBM Plex Mono";
    font-style: normal;
    font-weight: 600;
    font-size: 10.8889px;
    line-height: 130%;
    /* or 14px */

    letter-spacing: -0.01em;

    /* black */

    color: #000000;

    /* Inside auto layout */

    flex: none;
    order: 0;
    flex-grow: 0;
  }
`;
const Styled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: calc(100vh - 10.65rem);
  max-width: 1200px;
  margin: 0 auto;

  .tabs {
    width: 100%;
    display: flex;
    min-height: 75vh;
    flex-direction: column;
    justify-content: start;
  }
  .tab {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 80px;
    color: var(--primary-color);
    outline: none;
    width: 174px;
    border-radius: 0%;
    border: 1px solid transparent;
    padding: 1.8rem 0;
    cursor: pointer;
    font-size: 16px;

    &:hover {
      border: none;
      background-color: #06fc9a4c;
      border-bottom: 4px solid var(--primary-color);
      border-top: 4px solid transparent;
    }
  }
  .tablist {
    display: flex;
    justify-content: center;
  }
  .react-tabs__tab--selected {
    border: none;
    border-bottom: 4px solid var(--primary-color);
    border-top: 4px solid transparent;

    background-color: #06fc991a;
  }
  .react-tabs__tab--disabled {
  }
  .react-tabs__tab-panel {
    max-width: 1200px;
    width: 100vw;

    flex-grow: 1;
  }

  .react-tabs__tab-panel--selected {
    border-top: 1px solid var(--primary-color);
    display: flex;
    justify-content: center;
    background-color: black;
    min-height: 47rem;
  }

  @media (max-width: 1000px) {
    width: 100%;
    .tablist {
      width: 100vw;
    }
    .tab {
      width: 9rem;
      padding: 1.8rem 0;
    }

    .react-tabs__tab-panel--selected {
      width: 100%;
    }
  }
`;
const BridgeModalContainer = styled.div`
  background-color: #040404;
  height: 70vh;
  max-height: 90vh;
  padding-bottom: 40px;
  width: 33rem;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  align-items: center;

  @media (max-width: 1000px) {
    width: 100%;
  }
`;

export default BridgingPage;
