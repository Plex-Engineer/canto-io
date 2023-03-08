import styled from "@emotion/styled";
import { PrimaryButton, Text } from "global/packages/src";
import bridgeIcon from "assets/icons/canto-bridge.svg";
import arrow from "../../../assets/next.svg";
import CopyToClipboard from "react-copy-to-clipboard";
import { toastHandler } from "global/utils/toastHandler";
import CopyIcon from "../../../assets/copy.svg";

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

      <div className="icons-indicator"></div>
      <div className="token-box"></div>
      <div className="amount-box">
        <div className="amount"></div>
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
  }

  .token-box {
    height: 60px;
    width: 100%;
    border: 1px solid #252525;
    border-radius: 4px;
    margin: 1rem 0;
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
