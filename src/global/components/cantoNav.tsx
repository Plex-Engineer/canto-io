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
import { pageList } from "global/config/pageList";

export const CantoNav = () => {
  const netWorkInfo = useNetworkInfo();
  const alert = useAlert();
  const { activateBrowserWallet, account, chainId, active } = useEthers();
  const balance = useEtherBalance(account);
  const location = useLocation();
  const [tokenName, setTokenName] = useState("");
  async function grabTokenName() {
    setTokenName(await getBaseTokenName(chainId?.toString() ?? ""));
  }
  useEffect(() => {
    grabTokenName();
  }, [chainId]);

  function getTitle(location: string) {
    return pageList.find((page) => page.link === location)?.pageTitle ?? "";
  }

  useEffect(() => {
    netWorkInfo.setChainId(chainId?.toString());
    if (account) {
      netWorkInfo.setAccount(account);
      netWorkInfo.setBalance(balance ?? BigNumber.from(0));
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
    showAlerts(
      alert.show,
      alert.close,
      Number(netWorkInfo.chainId),
      netWorkInfo.hasPubKey,
      account,
      netWorkInfo.balance,
      location.pathname,
      pageList
    );
  }, [
    netWorkInfo.account,
    netWorkInfo.chainId,
    netWorkInfo.hasPubKey,
    netWorkInfo.balance,
    location,
  ]);
  return (
    <NavBar
      onClick={() => {
        activateBrowserWallet();
      }}
      chainId={Number(netWorkInfo.chainId)}
      account={netWorkInfo.account ?? ""}
      isConnected={!!netWorkInfo.account}
      balance={formatEther(netWorkInfo.balance)}
      currency={tokenName}
      logo={logo}
      pageList={pageList}
      currentPage={getTitle(location.pathname)}
    />
  );
};
