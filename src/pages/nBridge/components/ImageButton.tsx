import { useEthers } from "@usedapp/core";
import { useNetworkInfo } from "global/stores/networkInfo";
import {
  addEthMainToWallet,
  addNetwork,
} from "global/utils/walletConnect/addCantoToWallet";

interface IWallet {
  image?: string;
  name: string;
  networkSwitch: number;
}

export const ImageButton = ({ image, name, networkSwitch }: IWallet) => {
  const { activateBrowserWallet } = useEthers();
  const networkInfo = useNetworkInfo();

  return (
    <div
      role="button"
      tabIndex={0}
      className="image-button button"
      onClick={async () => {
        //1 for ethereum mainnet, 15 for gravity bridge testnet
        activateBrowserWallet();
        networkSwitch == 1 ? addEthMainToWallet() : addNetwork();
      }}
      style={{
        backgroundColor: "#1C1C1C",
        padding: "1rem 1.4rem",
        marginTop: "1rem",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        width: "20rem",
        cursor: "pointer",
      }}
    >
      {image ? <img src={image} alt={name} height={24} width={24} /> : null}
      <span
        style={{
          flex: "2",
          textAlign: "center",
        }}
      >
        {networkInfo.account
          ? Number(networkInfo.chainId) != networkSwitch
            ? "switch network"
            : networkInfo.account.substring(0, 10) +
              "..." +
              networkInfo.account.substring(
                networkInfo.account.length - 10,
                networkInfo.account.length
              )
          : "connect"}
      </span>
    </div>
  );
};
