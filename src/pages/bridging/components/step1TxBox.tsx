import styled from "@emotion/styled";
import { PrimaryButton, Text } from "global/packages/src";
import ethIcon from "assets/icons/ETH.svg";
import bridgeIcon from "assets/icons/canto-bridge.svg";
import cantoIcon from "assets/icons/canto-evm.svg";
import CopyIcon from "../../../assets/copy.svg";
import arrow from "../../../assets/next.svg";
import { UserERC20BridgeToken } from "../config/interfaces";
import LoadingBlip from "./LoadingBlip";
import { truncateNumber } from "global/utils/utils";
import { formatUnits } from "ethers/lib/utils";
import { CInput } from "global/packages/src/components/atoms/Input";
import CopyToClipboard from "react-copy-to-clipboard";
import { BridgeTransaction } from "../hooks/useBridgingTransactions";
import { useEffect, useState } from "react";
import {
  convertStringToBigNumber,
  copyAddress,
  formatAddress,
  getStep1ButtonText,
  toastBridgeTx,
} from "../utils/utils";
import Modal from "global/packages/src/components/molecules/Modal";
import ConfirmationModal from "./modals/confirmationModal";
import { CantoMainnet, ETHMainnet } from "global/config/networks";
import { TokenWallet } from "./tokenSelect";

interface Step1TxBoxProps {
  fromAddress?: string;
  toAddress?: string;
  bridgeIn: boolean;
  tokens: UserERC20BridgeToken[];
  selectedToken: UserERC20BridgeToken;
  selectToken: (token: UserERC20BridgeToken) => void;
  txHook: () => BridgeTransaction;
}
const Step1TxBox = (props: Step1TxBoxProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const txProps = props.txHook();

  const currentTokenBalance = props.selectedToken.erc20Balance;
  const [buttonText, buttonDisabled] = getStep1ButtonText(
    convertStringToBigNumber(amount, props.selectedToken.decimals),
    currentTokenBalance,
    props.selectedToken.allowance,
    props.bridgeIn
  );
  useEffect(() => {
    toastBridgeTx(txProps.state, txProps.txName);
  }, [txProps.state]);
  return (
    <Styled>
      <Modal
        title="confirmation"
        open={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          txProps.resetState();
        }}
      >
        <ConfirmationModal
          amount={convertStringToBigNumber(
            amount,
            props.selectedToken.decimals
          )}
          token={props.selectedToken}
          tx={txProps}
          from={{
            chain: props.bridgeIn ? ETHMainnet.name : CantoMainnet.name,
            address: props.fromAddress ?? "",
            chainId: props.bridgeIn ? ETHMainnet.chainId : CantoMainnet.chainId,
          }}
          to={{
            chain: "canto bridge",
            address: props.toAddress ?? "",
          }}
          onClose={() => {
            setModalOpen(false);
          }}
          extraDetails={
            props.bridgeIn
              ? `by bridging in, you are transferring your assets from your ethereum EVM address (${formatAddress(
                  props.fromAddress ?? "",
                  6
                )}) to your canto native address (${formatAddress(
                  props.toAddress ?? "",
                  6
                )}) through gravity bridge. `
              : `by bridging out, you are transferring your assets from your canto EVM address (${formatAddress(
                  props.fromAddress ?? "",
                  6
                )}) to your canto native address (${formatAddress(
                  props.toAddress ?? "",
                  6
                )}). `
          }
        />
      </Modal>
      <Text type="title" size="title2">
        send funds {props.bridgeIn ? "to" : "from"} canto
      </Text>
      <div className="icons-indicator">
        <div className="center">
          <img
            src={props.bridgeIn ? ethIcon : cantoIcon}
            alt={props.bridgeIn ? "ethereum" : "canto"}
            height={42}
            style={{ marginBottom: "10px" }}
          />
          <Text type="title">{props.bridgeIn ? "Ethereum" : "Canto"}</Text>
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
        <div className="token-select">
          <TokenWallet
            tokens={props.tokens}
            activeToken={props.selectedToken}
            onSelect={(value) => {
              props.selectToken(value ?? props.selectedToken);
            }}
          />
        </div>
        <div className="balance">
          <Text
            style={{
              color: "#888",
            }}
            align="right"
          >
            balance :{" "}
            {truncateNumber(
              formatUnits(currentTokenBalance, props.selectedToken.decimals)
            )}
          </Text>
        </div>
      </div>
      <div className="amount-box">
        <div className="amount">
          <Text
            style={{
              color: "#848484",
              width: "180px",
            }}
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
            value={amount}
            onChange={(val) => {
              setAmount(val.target.value);
            }}
          ></CInput>
          <button
            className="maxBtn"
            onClick={() => {
              setAmount(
                truncateNumber(
                  formatUnits(
                    currentTokenBalance,
                    props.selectedToken.decimals
                  ),
                  6
                )
              );
            }}
          >
            <Text>max</Text>
          </button>
        </div>
        <PrimaryButton
          height="big"
          weight="bold"
          padding="lg"
          disabled={buttonDisabled}
          style={{
            width: "14rem",
          }}
          onClick={() => {
            setModalOpen(true);
          }}
        >
          {buttonText}
        </PrimaryButton>
      </div>
      <div className="address-nodes">
        <div className="row">
          <CopyToClipboard text={props.fromAddress ?? ""} onCopy={copyAddress}>
            <Text
              type="text"
              color="primary"
              align="left"
              size="text3"
              style={{ cursor: "pointer" }}
            >
              {props.fromAddress
                ? props.fromAddress.slice(0, 5) +
                  "..." +
                  props.fromAddress.slice(-4)
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
          <CopyToClipboard text={props.toAddress ?? ""} onCopy={copyAddress}>
            <Text
              type="text"
              color="primary"
              align="right"
              size="text3"
              style={{ cursor: "pointer" }}
            >
              {props.toAddress
                ? props.toAddress.slice(0, 5) +
                  "..." +
                  props.toAddress.slice(-4)
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

  .maxBtn {
    height: 100%;
    width: 6rem;
    margin-left: 3px;
    background-color: #333;
    border: none;
    &:hover {
      background-color: #252525;
      cursor: pointer;
    }
  }
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
    width: 100%;
    height: 100%;
  }

  .balance {
    width: 70%;
    opacity: 0.4;
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
export default Step1TxBox;
