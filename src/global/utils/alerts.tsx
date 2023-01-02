import { BigNumber } from "ethers";
import { GenPubKey } from "global/components/genPubKey";
import { PageObject } from "global/config/pageList";
import { ReactNode } from "react";
import { addNetwork } from "./walletConnect/addCantoToWallet";

export function showAlerts(
  openAlert: (
    type: "Failure" | "Warning" | "Success",
    child: ReactNode,
    floating?: boolean,
    closeAfter?: number
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
  } else if (!account && !currentPageObj.walletNotRequired) {
    openAlert("Warning", <p> please connect your wallet to use canto</p>);
    return;
  } else if (!hasPubKey) {
    openAlert("Failure", <GenPubKey />);
    return;
  } else if (
    (chainId == undefined || !currentPageObj.networks.includes(chainId)) &&
    !currentPageObj.walletNotRequired
  ) {
    openAlert(
      "Failure",
      <p>
        this network is not supported on the {currentPageObj.pageTitle}, please{" "}
        <span
          role="button"
          tabIndex={0}
          onClick={addNetwork}
          style={{
            cursor: "pointer",
            border: "1px solid",
            padding: "6px 1rem",
            borderRadius: "4px",
          }}
        >
          switch networks
        </span>
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
