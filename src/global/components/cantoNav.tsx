import { useEtherBalance, useEthers, useSigner } from "@usedapp/core";
import { useEffect } from "react";
import { useNetworkInfo } from "global/stores/networkInfo";
import logo from "assets/logo.svg";
import { useLocation } from "react-router-dom";
import { useAlert, NavBar } from "../packages/src";
import { BigNumber } from "ethers";
import { formatEther, parseUnits } from "ethers/lib/utils";
import { ShowAlerts } from "global/utils/alerts";
import { pageList, PageObject } from "global/config/pageList";
import { Mixpanel } from "mixpanel";
import {
  getCantoNetwork,
  getSupportedNetwork,
} from "global/utils/getAddressUtils";

export const CantoNav = () => {
  const networkInfo = useNetworkInfo();
  const alert = useAlert();
  const { activateBrowserWallet, account, chainId, active } = useEthers();
  const balance = useEtherBalance(account);
  const cantoBalance = useEtherBalance(account, {
    chainId: getCantoNetwork(Number(networkInfo.chainId)).chainId,
  });
  const ethBalance = useEtherBalance(networkInfo.account, { chainId: 1 });
  const signer = useSigner();

  const canPubKey =
    (ethBalance?.gte(parseUnits("0.01")) ||
      networkInfo.balance?.gte(parseUnits("0.5"))) ??
    false;

  const location = useLocation();
  const currentNetwork = getSupportedNetwork(Number(networkInfo.chainId));

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
    if (account && signer) {
      networkInfo.setAccount(account);
      networkInfo.setBalance(balance ?? BigNumber.from(0));
      networkInfo.setSigner(signer);
      //mixpanel id
      Mixpanel.people.registerWallet(account);
      Mixpanel.identify(account);
      Mixpanel.people.set({ name: account });
    }
    if (account == null) {
      networkInfo.setAccount("");
    }
  }, [account, chainId, balance, active, signer]);

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
    ShowAlerts(
      alert.show,
      alert.close,
      Number(networkInfo.chainId),
      networkInfo.hasPubKey,
      canPubKey,
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
  return (
    <NavBar
      onClick={() => {
        activateBrowserWallet({ type: "metamask" });
      }}
      chainId={Number(networkInfo.chainId)}
      account={networkInfo.account ?? ""}
      isConnected={networkInfo.account != ""}
      balance={formatEther(networkInfo.balance)}
      currency={currentNetwork.nativeCurrency?.symbol ?? ""}
      siteLogo={logo}
      pageList={pageList}
      currentPage={recursiveGetTitle(location.pathname, 1, pageList)}
      currencyIcon={currentNetwork.icon}
    />
  );
};
