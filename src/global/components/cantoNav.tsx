import { useEtherBalance, useEthers } from "@usedapp/core";
import { useEffect, useState } from "react";
import { useNetworkInfo } from "global/stores/networkInfo";
import logo from "./../../assets/logo.svg";
import { useLocation } from "react-router-dom";
import { getBaseTokenName } from "global/utils/walletConnect/getTokenSymbol";
import { useAlert, NavBar } from "../packages/src";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { showAlerts } from "global/utils/alerts";
import { pageList, PageObject } from "global/config/pageList";
import { Mixpanel } from "mixpanel";
import { CantoMainnet } from "global/config/networks";
import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk/dist/src/sdk";

export async function setSafeConnector(){
  const sdk = new SafeAppsSDK();
  const safe = await sdk.safe.getInfo();
  if(!safe)return false
  return true
} 
export const CantoNav = () => {
  const networkInfo = useNetworkInfo();
  const alert = useAlert();
  const { activateBrowserWallet, account, chainId, active } = useEthers();
  const balance = useEtherBalance(account);
  const cantoBalance = useEtherBalance(account, {
    chainId: CantoMainnet.chainId,
  });
  const location = useLocation();
  const [tokenName, setTokenName] = useState("");
  const [inSafe, setInSafe]= useState(false); 
  async function grabTokenName() {
    setTokenName(await getBaseTokenName(chainId?.toString() ?? ""));
  }
  useEffect(() => {
    grabTokenName();
  }, [chainId]);

  function recursiveGetTitle(
    location: string,
    subpage: number,
    pageList: PageObject[]
  ): string {
    const currentSubPage = location.split("/");
    const currentPage = pageList.find(
      (page) => page.link.split("/")[subpage] == currentSubPage[subpage]
    );
    if (currentPage) {
      if (
        currentSubPage.length > subpage + 1 &&
        currentPage?.subpages?.length
      ) {
        //more pages to check
        return recursiveGetTitle(location, subpage + 1, currentPage.subpages);
      }
      return currentPage.pageTitleFunction
        ? currentPage.pageTitleFunction(location)
        : currentPage.pageTitle;
    }
    return "";
  }

  useEffect(() => {
    networkInfo.setChainId(chainId?.toString());
    if (account) {
      networkInfo.setAccount(account);
      networkInfo.setBalance(balance ?? BigNumber.from(0));
      //mixpanel id
      Mixpanel.people.registerWallet(account);
      Mixpanel.identify(account);
      Mixpanel.people.set({ name: account });
    }
    if (account == null) {
      networkInfo.setAccount("");
    }
  }, [account, chainId, balance, active]);

  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });
  }
  useEffect(() => {
    Mixpanel.events.pageOpened(
      recursiveGetTitle(location.pathname, 1, pageList) != ""
        ? recursiveGetTitle(location.pathname, 1, pageList)
        : "landing page"
    );
  }, [location.pathname, networkInfo.account]);

  useEffect(() => {
    showAlerts(
      alert.show,
      alert.close,
      Number(networkInfo.chainId),
      networkInfo.hasPubKey,
      account,
      cantoBalance ?? BigNumber.from(0),
      location.pathname,
      pageList
    );
  }, [
    networkInfo.account,
    networkInfo.chainId,
    networkInfo.hasPubKey,
    location,
    cantoBalance,
  ]);
  setSafeConnector().then((value)=>{
    setInSafe(value);
  })
  return (
    <NavBar
      onClick={() => {
         inSafe ? activateBrowserWallet({ type: "safe" }) : activateBrowserWallet({ type: "metamask" })     
      }}
      chainId={Number(networkInfo.chainId)}
      account={networkInfo.account ?? ""}
      isConnected={networkInfo.account != ""}
      balance={formatEther(networkInfo.balance)}
      currency={tokenName}
      logo={logo}
      pageList={pageList}
      currentPage={recursiveGetTitle(location.pathname, 1, pageList)}
    />
  );
};
