import { useEthers } from "@usedapp/core";
import { NavBar } from "../packages/src";
import { getAccountBalance } from "global/utils/walletConnect/addCantoToWallet";
import { useEffect, useState } from "react";
import { useNetworkInfo } from "global/stores/networkInfo";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import logo from "./../../assets/logo.svg";
import { useLocation } from "react-router-dom";
import { getBaseTokenName } from "global/utils/walletConnect/getTokenSymbol";

export const CantoNav = () => {
  const netWorkInfo = useNetworkInfo();
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
      isConnected={netWorkInfo.account ? true : false}
      balance={netWorkInfo.balance}
      currency={tokenName}
      logo={logo}
      pageList={pageList}
      currentPage={getTitle(location.pathname.slice(1))}
    />
  );
};
