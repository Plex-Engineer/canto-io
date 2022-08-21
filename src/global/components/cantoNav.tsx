import { useEthers } from "@usedapp/core";
import { NavBar } from "cantoui";
import { getAccountBalance, getChainIdandAccount } from "global/utils/walletConnect/addCantoToWallet";
import { useEffect } from "react";
import { useNetworkInfo } from "global/stores/networkInfo";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import logo from "./../../assets/logo.svg"

export const CantoNav = () => {
  const netWorkInfo = useNetworkInfo();
  const { activateBrowserWallet, account, chainId } = useEthers();


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
      netWorkInfo.setBalance(await getAccountBalance(netWorkInfo.account))
    }
  }
  useEffect(() => {
    getBalance();
  },[netWorkInfo.account, netWorkInfo.chainId])

  return (
    <NavBar
      title="bridge"
      onClick={() => {
        activateBrowserWallet();
        addNetwork();
      }}
      chainId={Number(netWorkInfo.chainId)}
      account={netWorkInfo.account ?? ""}
      isConnected={netWorkInfo.account ? true : false}
      balance={netWorkInfo.balance}
      currency={netWorkInfo.chainId == "1" ? "ETH" : "CANTO"}
      logo={logo}
      currentPage="bridge"
    />
  );
}