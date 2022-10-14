import styled from "@emotion/styled";
import { CantoMainnet } from "cantoui";
import { useNetworkInfo } from "global/stores/networkInfo";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import BridgeIn from "./BridgeIn";
import BridgeOut from "./BridgeOut";
import {
  BaseToken,
  UserConvertToken,
  UserNativeTokens,
} from "./config/interfaces";
import { useEthGravityTokens } from "./hooks/useEthGravityTokens";
import { SelectedTokens, useTokenStore } from "./stores/cosmosTokens";
import { getNativeCantoBalance } from "./utils/nativeBalances";
import { useCantoERC20Balances } from "./hooks/useERC20Balances";
import { convertCoinTokens } from "./config/gravityBridgeTokens";
import { ETHGravityTokens } from "./config/gravityBridgeTokens";
import { BigNumber } from "ethers";
import TransactionsTab from "./TransactionsTab";

const BridgingPage = () => {
  const tokenStore = useTokenStore();
  const networkInfo = useNetworkInfo();
  const [selectedTab, setSelectedTab] = useState(0);

  //set the convert erc20 tokens
  const { userTokens: userConvertERC20Tokens } = useCantoERC20Balances(
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
    setUserBridgeOutTokens(convertNativeWithBalance);
  }

  useEffect(() => {
    getAllBalances();
  }, []);

  function reSelectTokens(
    selectedToken: SelectedTokens,
    tokenList?: BaseToken[]
  ) {
    tokenStore.setSelectedToken(
      tokenList?.find(
        (token) =>
          token.address === tokenStore.selectedTokens[selectedToken].address
      ) ?? tokenStore.selectedTokens[selectedToken],
      selectedToken
    );
  }
  //Useffect for calling data per block
  useEffect(() => {
    const interval = setInterval(async () => {
      await getAllBalances();
      //reselecting the tokens so it is the most updated version
      reSelectTokens(SelectedTokens.ETHTOKEN, userEthGTokens);
      reSelectTokens(SelectedTokens.CONVERTIN, userConvertTokens);
      reSelectTokens(SelectedTokens.CONVERTOUT, userConvertTokens);
      reSelectTokens(SelectedTokens.BRIDGEOUT, userBridgeOutTokens);
    }, 6000);
    return () => clearInterval(interval);
  }, [userEthGTokens, userBridgeOutTokens, userConvertTokens]);

  return (
    <Styled>
      <Tabs className="tabs">
        <TabList className="tablist">
          <Tab
            className="tab"
            // resetting the selected token when a new tab is selected
            onClick={() => {
              setSelectedTab(0);
            }}
          >
            bridge In
          </Tab>
          <Tab
            className="tab"
            // resetting the selected token when a new tab is selected
            onClick={() => {
              setSelectedTab(1);
            }}
          >
            bridge Out
          </Tab>
          <Tab
            className="tab"
            // resetting the selected token when a new tab is selected
            onClick={() => {
              setSelectedTab(2);
            }}
          >
            transactions
          </Tab>
        </TabList>
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
          <TransactionsTab />
        </TabPanel>
      </Tabs>
    </Styled>
  );
};

const Styled = styled.div`
  min-height: 80vh;
  max-width: 1205px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .tabs {
    width: 100%;
    display: flex;
    min-height: 75vh;
    flex-direction: column;
    justify-content: start;
  }
  .tab {
    height: 80px;

    color: var(--primary-color);
    outline: none;
    width: 174px;
    border-radius: 0%;
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.8rem 0;
    cursor: pointer;
    font-size: 16px;
    &:hover {
      border: none;
      background-color: #06fc9a4c;
      border-bottom: 4px solid var(--primary-color);
    }
  }
  .tablist {
    display: flex;
    justify-content: center;
  }
  .react-tabs__tab--selected {
    border: none;
    border-bottom: 4px solid var(--primary-color);
    background-color: #06fc991a;
  }
  .react-tabs__tab--disabled {
  }
  .react-tabs__tab-panel {
    max-width: 1205px;
    width: 100vw;
  }

  .react-tabs__tab-panel--selected {
    border-top: 1px solid var(--primary-color);
    display: flex;
    justify-content: center;
    background-color: black;

    & > * {
      width: 600px;
    }
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
      /* & > * {
        width: 600px;
      } */
    }
  }
`;

export default BridgingPage;
