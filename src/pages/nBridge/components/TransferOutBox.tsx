import { HighlightButton, Text } from "cantoui";
import { ChangeEvent } from "react";
import styled from "@emotion/styled";
import arrow from "../../../assets/right.svg";
import CopyIcon from "../../../assets/copy.svg";
import { toast } from "react-toastify";
import { TransferBoxStyled } from "./TransferBox";
import FadeIn from "react-fade-in";

interface Props {
  tokenSymbol: string;
  tokenIcon: string;
  networkName: string;
  onSwitch: () => void;
  onChange: (s: string) => void;
  disabled?: boolean;
  connected: boolean;
  button: React.ReactNode;
  max: string;
  amount?: string;
  tokenSelector: React.ReactNode;
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
  onAddressChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const TransferOutBox = (props: Props) => {
  function copyAddress(value: string | undefined) {
    navigator.clipboard.writeText(value ?? "");
    toast("copied address", {
      autoClose: 300,
    });
  }
  return (
    <FadeIn>
      <TransferBoxOutStyled disabled={!props.connected}>
        <div className="overlay">
          <HighlightButton
            className="switch"
            id="network-switch"
            onClick={props.onSwitch}
          >
            {!props.connected
              ? "switch to " + props.networkName
              : "connected to " + props.networkName}
          </HighlightButton>
        </div>
        <div className="row">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {props.from.icon && <img src={props.from.icon ?? ""} height={26} />}
            <Text type="text" color="white" align="left">
              {props.from.name}
            </Text>
          </div>
          <img
            style={{
              flex: "0",
            }}
            src={arrow}
            alt="right arrow"
            height={40}
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
            <Text type="text" color="white" align="right">
              {props.to.name}
            </Text>
          </div>
        </div>
        <div className="row">
          <Text
            type="text"
            color="white"
            align="left"
            onClick={() => copyAddress(props.from.address)}
            style={{ cursor: "pointer" }}
          >
            {props.from.address
              ? props.from.address.slice(0, 4) +
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
          <Text
            type="text"
            color="white"
            align="right"
            onClick={() => copyAddress(props.to.address)}
            style={{ cursor: "pointer" }}
          >
            {props.to.address
              ? props.to.address.slice(0, 4) +
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
              // ref={amountRef}
              value={props.amount}
              onChange={(e) => props.onChange(e.target.value)}
            />
            {Number(props.max) < 0 ? (
              ""
            ) : (
              <div
                className="max"
                style={{ cursor: "pointer" }}
                onClick={() => props.onChange(props.max)}
              >
                max: {Number(props.max)}
              </div>
            )}
          </div>
        </div>
        <input
          placeholder="gravity address (gravity...)"
          type="text"
          name="address"
          id="address"
          onChange={props.onAddressChange}
        />
        <div className="row">{props.button}</div>
        {/* <div
        style={{ cursor: "pointer" }}
        onClick={() => props.onChange(props.max)}
      >
        max: {props.max}
      </div> */}
      </TransferBoxOutStyled>
    </FadeIn>
  );
};

interface StyeldProps {
  disabled?: boolean;
}
const TransferBoxOutStyled = styled(TransferBoxStyled)<StyeldProps>`
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

export default TransferOutBox;
