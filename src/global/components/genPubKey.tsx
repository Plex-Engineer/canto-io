import { CantoMainnet } from "cantoui";
import { useState } from "react";
import { useNetworkInfo } from "global/stores/networkInfo";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import { generatePubKey } from "global/utils/cantoTransactions/publicKey";

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
    </p>
  );
};
