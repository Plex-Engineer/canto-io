import styled from "@emotion/styled";
import { PrimaryButton, Text } from "global/packages/src";
import ethIcon from "assets/icons/ETH.svg";
import bridgeIcon from "assets/icons/canto-bridge.svg";
import arrow from "../../../assets/next.svg";
import CopyToClipboard from "react-copy-to-clipboard";
import { toastHandler } from "global/utils/toastHandler";
import CopyIcon from "../../../assets/copy.svg";
import ImageButton from "global/components/ImageButton";
import LoadingBlip from "./LoadingBlip";
import { CInput } from "global/packages/src/components/atoms/Input";

interface Props {
  connected: boolean;
  //   tokenSelector: React.ReactNode;
  //   networkName: string;
  //   button: React.ReactNode;
  //   max: string;
  //   amount: string;
  from: {
    name: string;
    address?: string;
    icon?: string;
  };
  to: {
    name: string;
    address?: string;
    icon?: string;
  };
  //   onSwitch: () => void;
  //   onChange: (s: string) => void;
  //   //if we need to send to specific address
  //   needAddressBox: boolean;
  //   onAddressChange?: (s: string) => void;
  //   AddressBoxPlaceholder?: string;
}
const EvmToBridge = (props: Props) => {
  function copyAddress() {
    toastHandler("copied address", true, "0", 300);
  }

  return (
    <Styled>
      <Text type="title" size="title2">
        Send funds to canto
      </Text>

      <div className="icons-indicator">
        <div className="center">
          <img
            src={ethIcon}
            alt="ethereum"
            height={42}
            style={{ marginBottom: "10px" }}
          />
          <Text type="title">Ethereum</Text>
        </div>
        <div className="loading">
          <LoadingBlip active />
        </div>
        <div className="center">
          <img
            src={bridgeIcon}
            alt={"canto (Bridge)"}
            height={42}
            style={{ marginBottom: "10px" }}
          />
          <Text type="title">Bridge</Text>
        </div>
      </div>
      <div className="token-box">
        <div className="token-select"></div>
        <div className="balance">
          <Text
            style={{
              color: "#848484",
            }}
            align="right"
          >
            balance : 3.4 ETH
          </Text>
        </div>
      </div>
      <div className="amount-box">
        <div className="amount">
          <Text
            style={{
              color: "#848484",
              padding: "1rem",
              width: "150px",
            }}
            align="right"
          >
            amount :
          </Text>
          <CInput
            style={{
              backgroundColor: "transparent",
              width: "100%",
              height: "54px",
            }}
            placeholder="0.00"
          ></CInput>
        </div>
        <PrimaryButton height="big" weight="bold" padding="lg">
          bridge
        </PrimaryButton>
      </div>
      <div className="address-nodes">
        {props.connected && (
          <div className="row">
            <CopyToClipboard
              text={props.from.address ?? ""}
              onCopy={copyAddress}
            >
              <Text
                type="text"
                color="primary"
                align="left"
                size="text3"
                style={{ cursor: "pointer" }}
              >
                {props.from.address
                  ? props.from.address.slice(0, 5) +
                    "..." +
                    props.from.address.slice(-4)
                  : "retrieving wallet"}
                <img
                  src={CopyIcon}
                  style={{
                    height: "22px",
                    position: "relative",
                    top: "5px",
                    left: "4px",
                  }}
                />
              </Text>
            </CopyToClipboard>
            <img
              style={{
                flex: "0",
              }}
              src={arrow}
              alt="right arrow"
              height={12}
            />
            <CopyToClipboard text={props.to.address ?? ""} onCopy={copyAddress}>
              <Text
                type="text"
                color="primary"
                align="right"
                size="text3"
                style={{ cursor: "pointer" }}
              >
                {props.to.address
                  ? props.to.address.slice(0, 5) +
                    "..." +
                    props.to.address.slice(-4)
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
        )}
      </div>
    </Styled>
  );
};

const Styled = styled.div`
  background: #090909;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  width: 600px;
  padding: 1rem 2rem;

  .icons-indicator {
    height: 120px;
    width: 100%;
    border: 1px solid #252525;
    border-radius: 4px;
    margin: 1rem 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .token-select {
    background-color: #252525;
    width: 100%;
    height: 100%;
  }

  .balance {
    width: 70%;
  }
  .token-box {
    height: 60px;
    width: 100%;
    border: 1px solid #252525;
    border-radius: 4px;
    margin: 1rem 0;
    display: flex;
    padding: 0 1rem;
    justify-content: space-between;
    align-items: center;
  }
  .amount-box {
    display: flex;
    gap: 18px;
  }
  .amount {
    height: 56px;
    width: 100%;
    background: #060606;
    border: 1px solid #2e2d2d;
    border-radius: 4px;
    display: flex;
    align-items: center;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > * {
      flex: 1;
      flex-basis: 0;
    }
  }

  .address-nodes {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 1.2rem;
    margin-bottom: 0.4rem;
  }
`;

export default EvmToBridge;
