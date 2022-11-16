import styled from "@emotion/styled";
import { CantoMainnet } from "global/config/networks";
import { useNetworkInfo } from "global/stores/networkInfo";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import BridgeIn from "./BridgeIn";
import BridgeOut from "./BridgeOut";
import walletIcon from "assets/wallet.svg";
import { UserConvertToken, UserNativeTokens } from "./config/interfaces";
import { useEthGravityTokens } from "./hooks/useEthGravityTokens";
import { SelectedTokens, useTokenStore } from "./stores/tokenStore";
import { getNativeCantoBalance } from "./utils/nativeBalances";
import { useCantoERC20Balances } from "./hooks/useERC20Balances";
import {
  allBridgeOutNetworks,
  BridgeOutNetworks,
  convertCoinTokens,
} from "./config/gravityBridgeTokens";
import { ETHGravityTokens } from "./config/gravityBridgeTokens";
import { BigNumber } from "ethers";
import Transactions from "./Transactions";
import { useEthers } from "@usedapp/core";
import NotConnected from "global/packages/src/components/molecules/NotConnected";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import {
  getBridgeInEventsWithStatus,
  getBridgeOutTransactions,
} from "./utils/utils";
import { useBridgeTransactionStore } from "./stores/transactionStore";
import HelmetSEO from "global/components/seo";

const BridgingPage = () => {
  const tokenStore = useTokenStore();
  const transactionStore = useBridgeTransactionStore();
  const networkInfo = useNetworkInfo();
  const { account, activateBrowserWallet } = useEthers();

  //setting the bridging transactions into local storage
  async function setBridgingTransactions() {
    if (networkInfo.account && networkInfo.cantoAddress) {
      const [completedBridgeIn, pendingBridgeIn] =
        await getBridgeInEventsWithStatus(networkInfo.account);
      const bridgeOutTransactions = await getBridgeOutTransactions(
        networkInfo.cantoAddress
      );
      transactionStore.setTransactions(
        networkInfo.account,
        pendingBridgeIn,
        completedBridgeIn,
        bridgeOutTransactions
      );
    }
  }
  //set the convert erc20 tokens
  const { userTokens: userConvertERC20Tokens, fail: cantoERC20Fail } =
    useCantoERC20Balances(
      networkInfo.account,
      convertCoinTokens,
      CantoMainnet.chainId
    );
  const [userConvertTokens, setUserConvertTokens] = useState<
    UserConvertToken[]
  >([]);
  //set the gravity token info from ethMainnet
  const { userEthGTokens, gravityAddress } = useEthGravityTokens(
    networkInfo.account,
    ETHGravityTokens
  );
  const [userBridgeOutTokens, setUserBridgeOutTokens] = useState<
    UserNativeTokens[]
  >([]);

  async function getAllBalances() {
    const convertNativeWithBalance = await getNativeCantoBalance(
      CantoMainnet.cosmosAPIEndpoint,
      networkInfo.cantoAddress,
      convertCoinTokens
    );
    const bridgeOutTokens = await getNativeCantoBalance(
      CantoMainnet.cosmosAPIEndpoint,
      networkInfo.cantoAddress,
      allBridgeOutNetworks[tokenStore.bridgeOutNetwork].tokens
    );
    if (!cantoERC20Fail) {
      setUserConvertTokens(
        userConvertERC20Tokens.map((token) => {
          return {
            ...token,
            nativeBalance:
              convertNativeWithBalance.find(
                (nativeToken) => nativeToken.nativeName === token.nativeName
              )?.nativeBalance ?? BigNumber.from(0),
          };
        })
      );
    }
    setUserBridgeOutTokens(bridgeOutTokens);
  }

  useEffect(() => {
    if (networkInfo.account && networkInfo.cantoAddress) {
      getAllBalances();
      setBridgingTransactions();
      transactionStore.checkAccount(networkInfo.account);
      tokenStore.checkTimeAndResetTokens();
    }
  }, [networkInfo.account, networkInfo.cantoAddress, cantoERC20Fail]);

  //Useffect for calling data per block
  useEffect(() => {
    if (networkInfo.account && networkInfo.cantoAddress) {
      const interval = setInterval(async () => {
        await setBridgingTransactions();
        await getAllBalances();
        //reselecting the tokens so it is the most updated version
        tokenStore.resetSelectedToken(SelectedTokens.ETHTOKEN, userEthGTokens);
        tokenStore.resetSelectedToken(
          SelectedTokens.CONVERTIN,
          userConvertTokens
        );
        tokenStore.resetSelectedToken(
          SelectedTokens.CONVERTOUT,
          userConvertTokens
        );
        tokenStore.resetSelectedToken(
          SelectedTokens.BRIDGEOUT,
          userBridgeOutTokens
        );
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [userEthGTokens, userBridgeOutTokens, userConvertTokens]);

  const notConnectedTabs = () => {
    const tabs = [];
    for (let i = 0; i < 3; i++) {
      tabs.push(
        <TabPanel key={i}>
          <NotConnected
            title="Wallet is not connected"
            subtext="to use bridge you need to connect a wallet through metamask"
            buttonText="connnect wallet"
            bgFilled
            onClick={() => {
              activateBrowserWallet();
              addNetwork();
            }}
            icon={walletIcon}
          />
        </TabPanel>
      );
    }
    return tabs;
  };

  return (
    <>
      <HelmetSEO
        title="Canto - Bridging"
        description="A test message written for Bridging in and out"
        link="bridge"
      />
      <Styled>
        <Tabs className="tabs">
          <TabList className="tablist">
            <Tab
              className="tab"
              // resetting the selected token when a new tab is selected
            >
              bridge In
            </Tab>
            <Tab
              className="tab"
              // resetting the selected token when a new tab is selected
            >
              bridge Out
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
                  userEthTokens={userEthGTokens}
                  gravityAddress={gravityAddress}
                  userConvertCoinNativeTokens={userConvertTokens}
                />
              </TabPanel>
              <TabPanel>
                <BridgeOut
                  userCantoNativeGTokens={userBridgeOutTokens}
                  userConvertERC20Tokens={userConvertTokens}
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

export default BridgingPage;
