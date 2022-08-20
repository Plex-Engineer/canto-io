import { CantoMainnet } from "cantoui";
import { useState } from "react"
import { useNetworkInfo } from "stores/networkInfo";
import { addNetwork } from "utils/addCantoToWallet";
import { generatePubKey } from "utils/nodeTransactions";

export const GenPubKey = () => {
    
    const [pubKeySuccess, setPubKeySuccess] = useState("");
    const networkInfo = useNetworkInfo();
    
    return (
        <p
        hidden={networkInfo.hasPubKey}
        style={{
          color: "#b73d3d",
          fontWeight: "bold",
          textShadow: "0px 0px black",
        }}
      >
        please{" "}
        <a
          style={{ color: "red", textDecoration: "underline", cursor: "pointer"}}
          onClick={() => {
            if (Number(networkInfo.chainId) != CantoMainnet.chainId) {
                addNetwork();
                setPubKeySuccess("switch to canto network")
            } else {
                generatePubKey(networkInfo.account, setPubKeySuccess)}
            }

          } 
        >
          generate a public key
        </a>{" "}
        before bridging assets
        <div>{pubKeySuccess}</div>
      </p>
    )
}