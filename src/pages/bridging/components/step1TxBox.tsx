import styled from "@emotion/styled";
import { PrimaryButton, Text } from "global/packages/src";
import CopyIcon from "assets/copy.svg";
import { EMPTY_NATIVE_TOKEN, NativeToken } from "../config/bridgingInterfaces";
import LoadingBlip from "./LoadingBlip";
import {
  convertStringToBigNumber,
  truncateNumber,
} from "global/utils/formattingNumbers";
import { formatUnits } from "ethers/lib/utils";
import { CInput } from "global/packages/src/components/atoms/Input";
import CopyToClipboard from "react-copy-to-clipboard";
import { useState } from "react";
import { copyAddress, formatAddress, getStep1ButtonText } from "../utils/utils";
import Modal from "global/packages/src/components/molecules/Modal";
import IBCGuideModal from "./modals/ibcGuideModal";
import { Token, TokenGroups } from "global/config/interfaces/tokens";
import { BigNumber } from "ethers";
import DropDown from "./dropDown";
import { BridgingNetwork, IBCNetwork } from "../config/bridgingInterfaces";
import { TokenWallet } from "./tokenSelect";
import ConfirmTxModal, {
  TokenWithIcon,
} from "global/components/modals/confirmTxModal";
import { getBridgeExtraDetails } from "./bridgeDetails";
interface Step1TxBoxProps {
  bridgeIn: boolean;
  //network indo
  allNetworks: BridgingNetwork[];
  fromNetwork: BridgingNetwork;
  toNetwork: BridgingNetwork;
  selectNetwork: (network: BridgingNetwork) => void;
  //addresses
  fromAddress?: string;
  toAddress?: string;
  //tokens
  allTokens: Token[];
  selectedToken?: Token;
  selectToken: (token?: Token) => void;
  //tx
  tx: (amount: BigNumber, toAddress: string) => Promise<boolean>;
}
const Step1TxBox = (props: Step1TxBoxProps) => {
  //regular confirmation modal
  const [isModalOpen, setModalOpen] = useState(false);
  //ibc in modal
  const [isIBCModalOpen, setisIBCModalOpen] = useState(false);
  const [selectedIBCToken, setSelectedIBCToken] =
    useState<NativeToken>(EMPTY_NATIVE_TOKEN);
  //ibc out modal
  const [userInputAddress, setUserInputAddress] = useState("");

  //general
  const [amount, setAmount] = useState("");
  const currentTokenBalance = props.selectedToken?.balance ?? BigNumber.from(0);
  const [buttonText, buttonDisabled] = props.selectedToken
    ? getStep1ButtonText(
        convertStringToBigNumber(amount, props.selectedToken.decimals),
        currentTokenBalance,
        props.bridgeIn
      )
    : ["select token", true];

  return (
    <Styled>
      <Modal
        title="ibc transfer"
        open={isIBCModalOpen}
        onClose={() => setisIBCModalOpen(false)}
      >
        <IBCGuideModal
          network={props.fromNetwork.IBC as IBCNetwork}
          token={selectedIBCToken}
          cantoAddress={props.toAddress ?? ""}
          onClose={() => setisIBCModalOpen(false)}
        />
      </Modal>
      <Modal
        title="confirmation"
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
      >
        <ConfirmTxModal
          title={"CONFIRM"}
          titleIcon={TokenWithIcon({
            icon: props.selectedToken?.icon ?? "",
            name: props.selectedToken?.name ?? "",
          })}
          confirmationValues={[
            { title: "from", value: formatAddress(props.fromAddress, 6) },
            {
              title: "to",
              value: props.bridgeIn
                ? formatAddress(props.toAddress, 6)
                : formatAddress(userInputAddress, 6),
            },
            {
              title: "amount",
              value: truncateNumber(amount) + " " + props.selectedToken?.symbol,
            },
          ]}
          extraInputs={
            props.bridgeIn
              ? []
              : [
                  {
                    header: "address",
                    placeholder: "",
                    value: userInputAddress,
                    setValue: setUserInputAddress,
                  },
                ]
          }
          disableConfirm={
            !(
              props.bridgeIn ||
              props.toNetwork.IBC?.checkAddress(userInputAddress)
            )
          }
          onConfirm={() => {
            if (props.selectedToken)
              props.tx(
                convertStringToBigNumber(amount, props.selectedToken.decimals),
                userInputAddress
              );
          }}
          extraDetails={getBridgeExtraDetails(
            props.bridgeIn,
            false,
            formatAddress(props.fromAddress, 6),
            props.bridgeIn
              ? formatAddress(props.toAddress, 6)
              : props.toNetwork.name
          )}
          onClose={() => {
            setModalOpen(false);
          }}
        />
      </Modal>
      <Text type="title" size="title2">
        send funds {props.bridgeIn ? "to" : "from"} canto
      </Text>
      <div className="icons-indicator">
        <div className="center-element">
          <div className="network-selector">
            <DropDown
              title="select bridge"
              label="Network"
              items={props.allNetworks.map((network) => ({
                primaryText: network.name,
                icon: network.icon,
                id: network.id,
              }))}
              onSelect={(id) => {
                const network = props.allNetworks.find(
                  (network) => network.id === id
                );
                if (network) {
                  props.selectNetwork(network);
                }
              }}
              selectedId={props.fromNetwork.id}
            />
          </div>
          <CopyToClipboard text={props.fromAddress ?? ""} onCopy={copyAddress}>
            <Text
              type="text"
              color="primary"
              align="left"
              size="text4"
              style={{ cursor: "pointer", color: "#717171" }}
            >
              {props.fromAddress
                ? props.fromAddress.slice(0, 5) +
                  "..." +
                  props.fromAddress.slice(-4)
                : "retrieving wallet"}
              <img
                src={CopyIcon}
                style={{
                  height: "18px",
                  position: "relative",
                  top: "5px",
                  left: "4px",
                }}
              />
            </Text>
          </CopyToClipboard>
        </div>

        <div className="loading">
          <LoadingBlip active />
          <div style={{ height: 26 }}></div>
        </div>
        <div className="center-element">
          <DropDown
            title="select network"
            label="Network"
            items={props.allNetworks.map((network) => ({
              primaryText: network.name,
              icon: network.icon,
              id: network.id,
            }))}
            onSelect={(id) => {
              const network = props.allNetworks.find(
                (network) => network.id === id
              );
              if (network) {
                props.selectNetwork(network);
              }
            }}
            selectedId={props.toNetwork.id}
          />
          <CopyToClipboard text={props.toAddress ?? ""} onCopy={copyAddress}>
            <Text
              type="text"
              color="primary"
              align="right"
              size="text4"
              style={{ cursor: "pointer", color: "#717171" }}
            >
              {props.toAddress
                ? props.toAddress.slice(0, 5) +
                  "..." +
                  props.toAddress.slice(-4)
                : "retrieving wallet"}{" "}
              <img
                src={CopyIcon}
                style={{
                  height: "18px",
                  marginLeft: "-6px",
                  position: "relative",
                  top: "5px",
                }}
              />
            </Text>
          </CopyToClipboard>
        </div>
      </div>

      <div className="amount-box">
        <div className="token-box">
          <TokenWallet
            allTokens={props.allTokens}
            activeToken={props.selectedToken}
            onSelect={(token) => {
              if (
                token?.tokenGroups.includes(TokenGroups.IBC_TOKENS) &&
                props.bridgeIn
              ) {
                setisIBCModalOpen(true);
                setSelectedIBCToken(token as NativeToken);
                return;
              }
              props.selectToken(token);
            }}
          />
        </div>
        <div className="amount">
          <CInput
            style={{
              backgroundColor: "transparent",
              width: "100%",
              height: "54px",
            }}
            placeholder={`amount :  ${truncateNumber(
              formatUnits(currentTokenBalance, props.selectedToken?.decimals),
              6
            )} `}
            value={amount}
            onChange={(val) => {
              setAmount(val.target.value);
            }}
          />
          <button
            className="maxBtn"
            onClick={() => {
              setAmount(
                truncateNumber(
                  formatUnits(
                    currentTokenBalance,
                    props.selectedToken?.decimals
                  ),
                  6
                )
              );
            }}
          >
            <Text>max</Text>
          </button>
        </div>
      </div>
      <Text
        type="text"
        size="text4"
        align="center"
        className="warning"
        style={{ color: "#ff4141" }}
      >
        {buttonDisabled &&
          convertStringToBigNumber(
            amount,
            props.selectedToken?.decimals ?? 0
          ).gt(currentTokenBalance) &&
          `you have exceeded the maximum amount! (current balance: ${truncateNumber(
            formatUnits(currentTokenBalance, props.selectedToken?.decimals)
          )})`}
      </Text>

      <PrimaryButton
        height="big"
        weight="bold"
        padding="lg"
        filled
        disabled={buttonDisabled}
        onClick={() => {
          setModalOpen(true);
        }}
      >
        {buttonText}
      </PrimaryButton>
    </Styled>
  );
};

const Styled = styled.div`
  background: #181818;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  width: 600px;
  padding: 1rem 2rem;
  position: relative;

  .maxBtn {
    height: 100%;
    width: 7rem;
    margin-left: 3px;
    background-color: #252525;

    border: none;
    &:hover {
      background-color: #333;
      cursor: pointer;
      p {
        color: white;
      }
    }

    p {
      color: #999;
    }
  }

  .warning {
    width: 100%;
    height: 14px;
    margin: 8px;
  }
  .icons-indicator {
    height: 140px;
    width: 100%;

    margin: 1rem 0;
    display: flex;
    justify-content: space-around;
    align-items: center;

    /* .loading {
      display: flex;
      height: 5rem;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    } */
  }

  .center-element {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .balance {
    width: 70%;
    opacity: 0.4;
  }
  .token-box {
    height: 58px;
    width: 100%;
    border: 1px solid #252525;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .address-nodes {
    width: 100%;
  }
  .amount-box {
    display: flex;
    gap: 1rem;
  }
  .amount {
    height: 58px;
    background: #060606;
    border: 1px solid #2e2d2d;
    border-radius: 4px;
    display: flex;
    align-items: center;
    min-width: 18rem;
    width: 100%;
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

  @media (max-width: 1000px) {
    width: 100%;
    /* margin: 0 1rem; */
    padding: 12px;
    .amount-box {
      flex-direction: column;
    }
    .amount {
      min-width: 14rem;
      width: 100%;
    }
  }
`;
export default Step1TxBox;
