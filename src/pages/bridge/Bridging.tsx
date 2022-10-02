import styled from "@emotion/styled";
import { CantoMainnet } from "cantoui";
import { useNetworkInfo } from "global/stores/networkInfo";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import BridgeIn from "./BridgeIn";
import BridgeOut from "./BridgeOut";
import {
  emptySelectedToken,
  UserGravityTokens,
  UserNativeGTokens,
} from "./config/interfaces";
import { useCantoGravityTokens } from "./hooks/useCantoGravityTokens";
import { useEthGravityTokens } from "./hooks/useEthGravityTokens";
import { useTokenStore } from "./stores/cosmosTokens";
import { getNativeCantoBalance } from "./utils/nativeBalances";

const BridgingPage = () => {
  const tokenStore = useTokenStore();
  const networkInfo = useNetworkInfo();
  const [selectedTab, setSelectedTab] = useState(0);
  //set the gravity token info from ethMainnet
  const { userEthGTokens, gravityAddress } = useEthGravityTokens(
    networkInfo.account
  );
  //set the gravity token info from Canto Mainnet
  const { userGravityTokens: userCantoGTokens } = useCantoGravityTokens(
    networkInfo.account
  );

  //will contain the gravity tokens with the native canto balances
  const [userEthNativeGTokens, setUserEthNativeGTokens] = useState<
    UserNativeGTokens[]
  >([]);

  const [userCantoNativeGTokens, setUserCantoNativeGTokens] = useState<
    UserNativeGTokens[]
  >([]);

  async function getBalances(
    ethGravityTokens: UserGravityTokens[],
    cantoGravityTokens: UserGravityTokens[]
  ) {
    if (selectedTab === 0) {
      const EthTokensWithBalances: UserNativeGTokens[] =
        await getNativeCantoBalance(
          CantoMainnet.cosmosAPIEndpoint,
          networkInfo.cantoAddress,
          ethGravityTokens
        );
      setUserEthNativeGTokens(EthTokensWithBalances);
    } else {
      const CantoTokensWithBalances: UserNativeGTokens[] =
        await getNativeCantoBalance(
          CantoMainnet.cosmosAPIEndpoint,
          networkInfo.cantoAddress,
          cantoGravityTokens
        );
      setUserCantoNativeGTokens(CantoTokensWithBalances);
    }
  }
  useEffect(() => {
    if (userEthGTokens && userCantoGTokens) {
      getBalances(userEthGTokens, userCantoGTokens);
    }
  }, [userEthGTokens?.length, userCantoGTokens?.length]);
  //Useffect for calling data per block
  useEffect(() => {
    const interval = setInterval(async () => {
      await getBalances(userEthGTokens, userCantoGTokens);
      //reselecting the token so it is the most updated version
      if (selectedTab === 0) {
        tokenStore.setSelectedToken(
          userEthNativeGTokens?.find(
            (token) =>
              token.data.address == tokenStore.selectedToken.data.address
          ) ?? tokenStore.selectedToken
        );
      } else {
        tokenStore.setSelectedToken(
          userCantoNativeGTokens?.find(
            (token) =>
              token.data.address == tokenStore.selectedToken.data.address
          ) ?? tokenStore.selectedToken
        );
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [userEthGTokens, userCantoGTokens]);

  return (
    <Styled>
      <Tabs className="tabs">
        <TabList className="tablist">
          <Tab
            className="tab"
            // resetting the selected token when a new tab is selected
            onClick={() => {
              setSelectedTab(0);
              tokenStore.setSelectedToken(emptySelectedToken);
            }}
          >
            bridge In
          </Tab>
          <Tab
            className="tab"
            // resetting the selected token when a new tab is selected
            onClick={() => {
              setSelectedTab(1);
              tokenStore.setSelectedToken(emptySelectedToken);
            }}
          >
            bridge Out
          </Tab>
        </TabList>
        <TabPanel>
          <BridgeIn
            userEthNativeGTokens={userEthNativeGTokens}
            gravityAddress={gravityAddress}
          />
        </TabPanel>
        <TabPanel>
          <BridgeOut userCantoNativeGTokens={userCantoNativeGTokens} />
        </TabPanel>
      </Tabs>
    </Styled>
  );
};

const Styled = styled.div`
  background-color: black;
  min-height: 80vh;
  max-width: 1024px;

  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  .tabs {
    width: 100%;
  }
  .tab {
    background-color: var(--pitch-black-color);
    height: 50px;
    color: var(--primary-color);
    outline: none;
    width: 200px;
    border-radius: 0%;
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.4s;
    &:hover {
      background-color: #283b2d;
      border-bottom: 4px solid var(--primary-color);
    }
  }
  .tablist {
    display: flex;
    justify-content: center;
    background-color: var(--pitch-black-color);
  }
  .react-tabs__tab--selected {
    border-bottom: 4px solid var(--primary-color);
    border-top: none;
    background-color: #19251c;
  }
  .react-tabs__tab--disabled {
  }
`;

export default BridgingPage;
