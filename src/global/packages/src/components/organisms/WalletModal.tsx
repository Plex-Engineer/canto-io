import styled from "@emotion/styled";
import { useEthers } from "@usedapp/core";
import { useNetworkInfo } from "global/stores/networkInfo";
import CopyToClipboard from "react-copy-to-clipboard";
import { OutlinedButton } from "../atoms/Button";
import CopyIcon from "assets/copy.svg";
import { Text } from "../atoms/Text";
import { formatBigNumber } from "../../utils/formatNumbers";
import cantoIMG from "assets/logo.svg";
import ethIMG from "assets/icons/ETH.svg";
import { formatEther } from "ethers/lib/utils";
import { CantoMainnet } from "global/providers";
import { Mixpanel } from "mixpanel";
import { toastHandler } from "global/utils/toastHandler";
import { ETHMainnet } from "global/config/networks";

const WalletModal = () => {
  const { deactivate } = useEthers();
  const networkInfo = useNetworkInfo();
  const account = networkInfo.account ?? "0";

  return (
    <Styled>
      <div className="address">
        <CopyToClipboard
          text={account}
          onCopy={() => toastHandler("copied address", true, "0", 300)}
        >
          <Text
            type="text"
            color="primary"
            align="right"
            style={{ cursor: "pointer" }}
          >
            {account
              ? account.slice(0, 6) + "..." + account.slice(-4)
              : "retrieving wallet"}{" "}
            <img
              src={CopyIcon}
              style={{
                height: "22px",
                marginLeft: "-6px",
                position: "relative",
                top: "5px",
              }}
            />
          </Text>
        </CopyToClipboard>
      </div>

      <div className="row">
        <Text type="text">
          {networkInfo.chainId == ETHMainnet.chainId.toString()
            ? "eth "
            : "canto "}{" "}
          balance
        </Text>
        <div className="balance">
          <Text type="text">
            <span className="center">
              {networkInfo.chainId == ETHMainnet.chainId.toString() && (
                <img src={ethIMG} height={14} />
              )}
              {networkInfo.chainId == CantoMainnet.chainId.toString() && (
                <img src={cantoIMG} height={14} />
              )}
              {formatBigNumber(formatEther(networkInfo.balance))}
            </span>
          </Text>
        </div>
      </div>
      <div
        style={{
          margin: "12px 0",
          borderTop: "1px solid #d9d9d92b",
          width: "90%",
        }}
      ></div>
      <div className="row">
        {/* <Text type="text">support</Text> */}
        <div className="balance">
          <a href="https://docs.canto.io/" target="_blank" rel="noreferrer">
            help center
          </a>
        </div>
      </div>

      <OutlinedButton
        style={{
          marginTop: "32px",
        }}
        height="small"
        onClick={() => {
          Mixpanel.events.connections.walletConnect(false);
          deactivate();
          window.location.reload();
        }}
      >
        disconnect
      </OutlinedButton>
    </Styled>
  );
};

const Styled = styled.div`
  width: 287px;
  background-color: #d9d9d933;
  border-radius: 4px;
  backdrop-filter: blur(35px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: fadein 0.2s;
  position: fixed;
  top: 4.75rem;
  right: 1rem;
  padding: 24px 16px;
  @keyframes fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  a {
    text-decoration: underline;
    font-weight: 400;
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.4rem;
  }
  .address {
    margin-bottom: 24px;
  }
  .address p {
    font-family: "Silkscreen";
  }

  .row {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  button {
    width: 100%;
  }
`;

export default WalletModal;
