import { BigNumber } from "ethers";
import { GenPubKey } from "global/components/genPubKey";
import { PageObject } from "global/config/pageList";
import { ReactNode } from "react";
import { addNetwork } from "./walletConnect/addCantoToWallet";

export function showAlerts(
  openAlert: (
    type: "Failure" | "Warning" | "Success",
    child: ReactNode
  ) => void,
  closeAlert: () => void,
  chainId: number | undefined,
  hasPubKey: boolean,
  account: string | undefined,
  balance: BigNumber,
  currentPath: string,
  pageList: PageObject[]
) {
  const currentPageObj = pageList.find((page) => page.link === currentPath);
  if (!currentPageObj) {
    return;
  } else if (!account) {
    openAlert("Warning", <p> please connect your wallet to use canto</p>);
    return;
  } else if (!hasPubKey) {
    openAlert("Failure", <GenPubKey />);
    return;
  } else if (
    chainId == undefined ||
    !currentPageObj.networks.includes(chainId)
  ) {
    openAlert(
      "Failure",
      <p>
        this network is not supported on the {currentPageObj.pageTitle}, please{" "}
        <p
          role="button"
          tabIndex={0}
          onClick={addNetwork}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          switch networks
        </p>
      </p>
    );
    return;
  } else if (currentPageObj.balanceLimits && !balance.isZero()) {
    for (const limit of currentPageObj.balanceLimits) {
      if (balance.lt(limit.minBalance)) {
        openAlert("Warning", <p>{limit.warningMessage}</p>);
        return;
      }
    }
  }
  closeAlert();
}
