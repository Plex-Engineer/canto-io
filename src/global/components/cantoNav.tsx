import { useEthers } from "@usedapp/core";
import { NavBar, useAlert } from "cantoui";
import { getAccountBalance, getChainIdandAccount } from "global/utils/walletConnect/addCantoToWallet";
import { useEffect } from "react";
import { useNetworkInfo } from "stores/networkInfo";
import { addNetwork } from "utils/addCantoToWallet";
import logo from "./../../assets/logo.svg"

export const CantoNav = () => {
  const netWorkInfo = useNetworkInfo();
  const { activateBrowserWallet, account, switchNetwork } = useEthers();
  const alert = useAlert();

  async function setChainInfo() {
    const [chainId, account] = await getChainIdandAccount();
    netWorkInfo.setChainId(chainId);
    netWorkInfo.setAccount(account);
  }

  useEffect(() => {
    setChainInfo();
   //@ts-ignore
}, [window.ethereum?.networkVersion]);

  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });

  //   //@ts-ignore
  //   window.ethereum.on("networkChanged", () => {
  //     window.location.reload();
  //   });
  }

  async function getBalance() {
    if (netWorkInfo.account != undefined) {
      netWorkInfo.setBalance(await getAccountBalance(netWorkInfo.account))
    }
  }
  useEffect(() => {
    if (!netWorkInfo.isConnected) {
      alert.show("Failure", <p>this network is not supported on gravity bridge, please <a onClick={addNetwork} style={{cursor: "pointer", textDecoration: "underline"}}>switch networks</a></p>)
    } else {
      alert.close();
    }
    getBalance();
  },[netWorkInfo.account, netWorkInfo.chainId])

  return (
    <NavBar
      title="bridge"
      onClick={() => {
        activateBrowserWallet();
        switchNetwork(1);
      }}
      chainId={Number(netWorkInfo.chainId)}
      account={netWorkInfo.account ?? ""}
      isConnected={netWorkInfo.isConnected && account ? true : false}
      balance={netWorkInfo.balance}
      currency={netWorkInfo.chainId == "1" ? "ETH" : "CANTO"}
      logo={logo}
      currentPage="bridge"
    />
  );
};