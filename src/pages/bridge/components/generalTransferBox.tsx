import styled from "@emotion/styled";
import { HighlightButton, Text } from "cantoui";
import FadeIn from "react-fade-in";
import { toast } from "react-toastify";
import arrow from "../../../assets/next.svg";
import CopyIcon from "../../../assets/copy.svg";
import { truncateNumber } from "global/utils/utils";
import { OutlinedButton } from "global/packages/src";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface Props {
  connected: boolean;
  tokenSelector: React.ReactNode;
  networkName: string;
  button: React.ReactNode;
  max: string;
  amount: string;
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
  onSwitch: () => void;
  onChange: (s: string) => void;
  //if we need to send to specific address
  needAddressBox: boolean;
  onAddressChange?: (s: string) => void;
}
function copyAddress(value: string | undefined) {
  navigator.clipboard.writeText(value ?? "").then(() => {
    toast("copied address", {
      autoClose: 300,
    });
  });
}
export const GeneralTransferBox = (props: Props) => {
  return (
    <FadeIn>
      <TransferBoxStyled disabled={!props.connected}>
        <div className="overlay">
          <OutlinedButton
            className="switchd"
            id="network-switch"
            onClick={props.onSwitch}
          >
            {!props.connected
              ? "switch to " + props.networkName
              : "connected to " + props.networkName}
          </OutlinedButton>
        </div>
        <div className="amount">
          {props.tokenSelector}

          <div className="amount-input">
            <Text type="text" align="left" color="primary">
              amount :
            </Text>
            <input
              autoComplete="off"
              type="number"
              name="amount-bridge"
              id="amount-bridge"
              placeholder="0.00"
              value={props.amount}
              onChange={(e) => props.onChange(e.target.value)}
            />
            {Number(props.max) < 0 ? (
              ""
            ) : (
              <div className="max">
                balance {truncateNumber(props.max)}{" "}
                <span
                  tabIndex={0}
                  role="button"
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => props.onChange(props.max)}
                >
                  max
                </span>
              </div>
            )}
          </div>
        </div>
        {props.connected && <div className="row">{props.button}</div>}

        {props.connected && (
          <div className="row">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              {props.from.icon && (
                <img src={props.from.icon ?? ""} height={26} />
              )}
              <Text type="text" color="primary" align="left">
                {props.from.name}
              </Text>
            </div>
            <img
              style={{
                flex: "0",
              }}
              src={arrow}
              alt="right arrow"
              height={16}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <img src={props.to.icon ?? ""} height={26} />
              <Text type="text" color="primary" align="right">
                {props.to.name}
              </Text>
            </div>
          </div>
        )}
        {props.connected && (
          <div className="row">
            <CopyToClipboard
              text={props.from.address ?? ""}
              onCopy={() => {
                toast("copied address", {
                  position: "top-right",
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progressStyle: {
                    color: `
                        var(--primary-color)
                      `,
                  },
                  style: {
                    border: "1px solid var(--primary-color)",
                    borderRadius: "0px",
                    paddingBottom: "3px",
                    background: "black",
                    color: `var(--primary-color)
                    `,
                    height: "100px",
                    fontSize: "20px",
                  },
                  autoClose: 300,
                });
              }}
            >
              <Text
                type="text"
                color="primary"
                align="left"
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
              height={16}
            />
            <CopyToClipboard
              text={props.to.address ?? ""}
              onCopy={() => {
                toast("copied address", {
                  position: "top-right",
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progressStyle: {
                    color: `
                          var(--primary-color)
                        `,
                  },
                  style: {
                    border: "1px solid var(--primary-color)",
                    borderRadius: "0px",
                    paddingBottom: "3px",
                    background: "black",
                    color: `var(--primary-color)
                      `,
                    height: "100px",
                    fontSize: "20px",
                  },
                  autoClose: 300,
                });
              }}
            >
              <Text
                type="text"
                color="primary"
                align="right"
                onClick={() => copyAddress(props.to.address)}
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

        {props.needAddressBox && (
          <input
            placeholder="gravity address (gravity...)"
            type="text"
            name="address"
            id="address"
            onChange={(e) => {
              if (props.onAddressChange) {
                props.onAddressChange(e.target.value);
              }
            }}
          />
        )}
      </TransferBoxStyled>
    </FadeIn>
  );
};

interface StyeldProps {
  disabled?: boolean;
}
export const TransferBoxStyled = styled.div<StyeldProps>`
  background-color: black;
  border-radius: 18px;
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 3rem;
  /* border: ${(props) =>
    props.disabled ? " 2px solid #333" : "2px solid #333"}; */

  /* border: ${(props) =>
    props.disabled ? " 1px solid #333" : "1px solid var(--primary-color)"}; */
  position: relative;

  .row {
    display: flex;
    /* gap: 1rem; */

    justify-content: space-between;
    filter: ${(props) => (props.disabled ? "grayscale(100%)" : "none")};

    align-items: center;
    & > * {
      /* flex-grow: 1; */
      flex: 1;
      flex-basis: 0;
    }
  }

  button {
    border-radius: 4px;
  }
  .overlay {
    /* background-color: #080808d2; */
    border-radius: 18px;

    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    position: absolute;
    display: ${(props) => (props.disabled ? "grid" : "none")};
    justify-content: center;
  }
  .max {
    position: absolute;
    right: 1rem;
    bottom: 5px;
    font-size: 13px;
    color: var(--primary-color);
  }
  .token {
    display: flex;
    gap: 1rem;
  }
  .switchd {
    margin-top: 12rem;
    width: 34rem !important;
  }
  .switch {
    width: 400px;

    color: ${({ disabled }) => (disabled ? "var(--warning-color)" : "")};
    border: ${({ disabled }) =>
      disabled ? "1px solid var(--warning-color)" : ""};
    background-color: ${({ disabled }) => (disabled ? "#382e1f" : "")};
    &:hover {
      background-color: ${({ disabled }) => (disabled ? "#2a2218" : "")};
    }
  }

  .amount {
    filter: ${(props) => (props.disabled ? "grayscale(100%)" : "none")};
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    height: 6rem;
    /* padding: 1.4rem; */
    /* border: 1px solid #333; */
    border-radius: 4px;
    background-color: #222222;

    .amount-input {
      height: 100%;
      width: 80%;
      border-left: 2px solid black;
      display: flex;
      justify-content: start;
      align-items: center;
      /* border: 1px solid #333; */
      padding: 1rem;
      gap: 1rem;
    }
  }

  input[type="number"] {
    background-color: transparent;
    border: none;
    outline: none;
    color: var(--primary-color);
    text-align: left;
    font-size: 22px;
    width: 100px;
    border-bottom: 1px solid transparent;
    &::placeholder {
      color: var(--primary-darker-color);
    }
    &:focus,
    &:hover {
      border-bottom: 1px solid var(--primary-color);
    }

    /* Chrome, Safari, Edge, Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    &[type="number"] {
      -moz-appearance: textfield;
    }
  }
  #address {
    background-color: transparent;
    color: var(--primary-color);
    border: none;
    border-bottom: 1px solid var(--just-grey-color);
    text-align: center;
    font-size: 18px;
    &:focus {
      outline: none;
      border-bottom: 1px solid var(--primary-color);
    }
  }
`;
