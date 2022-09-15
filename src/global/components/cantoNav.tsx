import { useEthers } from "@usedapp/core";
import { getAccountBalance } from "global/utils/walletConnect/addCantoToWallet";
import { useEffect, useState } from "react";
import { useNetworkInfo } from "global/stores/networkInfo";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import logo from "./../../assets/logo.svg";
import { useLocation } from "react-router-dom";
import { getBaseTokenName } from "global/utils/walletConnect/getTokenSymbol";
import { useAlert, NavBar } from "../packages/src";
import { GenPubKey } from "./genPubKey";

export const CantoNav = () => {
  const netWorkInfo = useNetworkInfo();
  const alert = useAlert();
  const { activateBrowserWallet, account, chainId } = useEthers();
  const location = useLocation();
  const [tokenName, setTokenName] = useState("");

  async function grabTokenName() {
    setTokenName(await getBaseTokenName(chainId?.toString() ?? ""));
  }
  useEffect(() => {
    grabTokenName();
  }, [chainId]);

  function getTitle(location: string) {
    if (location == "lp") {
      return "lp interface";
    }
    return location;
  }

  useEffect(() => {
    netWorkInfo.setChainId(chainId?.toString());
    account ? netWorkInfo.setAccount(account) : {};
  }, [account, chainId]);

  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });
  }

  async function getBalance() {
    if (netWorkInfo.account != undefined) {
      netWorkInfo.setBalance(await getAccountBalance(netWorkInfo.account));
    }
  }
  useEffect(() => {
    getBalance();
  }, [netWorkInfo.account, netWorkInfo.chainId]);

  useEffect(() => {
    if (!netWorkInfo.hasPubKey) {
      alert.show("Failure", <GenPubKey />);
    } else if (!netWorkInfo.account) {
      alert.show("Warning", <p> please connect your wallet to use canto</p>);
    } else {
      alert.close();
    }
    getBalance();
  }, [netWorkInfo.account, netWorkInfo.chainId, netWorkInfo.hasPubKey]);

  const pageList = [
    {
      name: "bridge",
      link: "/bridge",
    },
    {
      name: "governance",
      link: "/governance",
    },
    {
      name: "lending",
      link: "/lending",
    },
    {
      name: "lp interface",
      link: "/lp",
    },
    {
      name: "staking",
      link: "/staking",
    },
  ];

  return (
    <NavBar
      onClick={() => {
        activateBrowserWallet();
        addNetwork();
      }}
      chainId={Number(netWorkInfo.chainId)}
      account={netWorkInfo.account ?? ""}
      isConnected={!!netWorkInfo.account}
      balance={netWorkInfo.balance}
      currency={tokenName}
      logo={logo}
      pageList={pageList}
      currentPage={getTitle(location.pathname.slice(1))}
    />
  );
};
