import { useState } from "react";
import { useNetworkInfo } from "global/stores/networkInfo";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import { generatePubKey } from "global/utils/cantoTransactions/publicKey";
import { CantoMainnet } from "global/config/networks";
import { useNavigate } from "react-router-dom";

export const GenPubKey = () => {
  const [pubKeySuccess, setPubKeySuccess] = useState("");
  const networkInfo = useNetworkInfo();
  const navigate = useNavigate();

  return (
    <p
      role="button"
      tabIndex={0}
      onClick={() => {
        navigate("/bridge/walkthrough");
        // if (Number(networkInfo.chainId) != CantoMainnet.chainId) {
        //   addNetwork();
        //   setPubKeySuccess("switch to canto network");
        // } else {
        //   generatePubKey(networkInfo.account, setPubKeySuccess);
        // }
      }}
      style={{
        color: "#b73d3d",
        fontWeight: "bold",
        textShadow: "0px 0px black",
        lineHeight: "220%",
        cursor: "pointer",
      }}
    >
      please{" "}
      <span
        style={{
          cursor: "pointer",
          border: "1px solid",
          padding: "6px 1rem",
          borderRadius: "4px",
        }}
      >
        generate a public key
      </span>{" "}
      before bridging assets
    </p>
  );
};
