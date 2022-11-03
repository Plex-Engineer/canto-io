import { useState } from "react";
import { useNetworkInfo } from "global/stores/networkInfo";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import { generatePubKey } from "global/utils/cantoTransactions/publicKey";
import { CantoMainnet } from "global/config/networks";

export const GenPubKey = () => {
  const [pubKeySuccess, setPubKeySuccess] = useState("");
  const networkInfo = useNetworkInfo();

  return (
    <p
      style={{
        color: "#b73d3d",
        fontWeight: "bold",
        textShadow: "0px 0px black",
      }}
    >
      please{" "}
      <a
        role="button"
        tabIndex={0}
        style={{ color: "red", textDecoration: "underline", cursor: "pointer" }}
        onClick={() => {
          if (Number(networkInfo.chainId) != CantoMainnet.chainId) {
            addNetwork();
            setPubKeySuccess("switch to canto network");
          } else {
            generatePubKey(networkInfo.account, setPubKeySuccess);
          }
        }}
      >
        generate a public key
      </a>{" "}
      before bridging assets
      <div>{pubKeySuccess}</div>
      <div>
        *in order to generate a public key, you must have at least 0.5 CANTO or
        0.01 ETH on mainnet*
      </div>
    </p>
  );
};
