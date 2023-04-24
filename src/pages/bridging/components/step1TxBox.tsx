import styled from "@emotion/styled";
import { PrimaryButton, Text } from "global/packages/src";
import ethIcon from "assets/icons/ETH.svg";
import bridgeIcon from "assets/icons/canto-bridge.svg";
import cantoIcon from "assets/icons/canto-evm.svg";
import CopyIcon from "assets/copy.svg";
import {
  EMPTY_NATIVE_TOKEN,
  NativeToken,
  Step1TokenGroups,
  UserERC20BridgeToken,
} from "../config/interfaces";
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
  getBridgeExtraDetails,
  getStep1ButtonText,
  toastBridgeTx,
} from "../utils/utils";
import Modal from "global/packages/src/components/molecules/Modal";
import { CantoMainnet, ETHMainnet } from "global/config/networks";
import { TokenWallet } from "./tokenSelect";
import IBCGuideModal from "./modals/ibcGuideModal";
import { TokenGroups } from "global/config/interfaces/tokens";
import ConfirmTxModal, {
  TokenWithIcon,
} from "global/components/modals/confirmTxModal";

interface Step1TxBoxProps {
  fromAddress?: string;
  toAddress?: string;
  bridgeIn: boolean;
  tokenGroups: Step1TokenGroups[];
  selectedToken: UserERC20BridgeToken;
  selectToken: (tokenAddress: string) => void;
  txHook: () => BridgeTransaction;
}
const Step1TxBox = (props: Step1TxBoxProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isIBCModalOpen, setisIBCModalOpen] = useState(false);
  const [selectedIBCToken, setSelectedIBCToken] =
    useState<NativeToken>(EMPTY_NATIVE_TOKEN);
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
        title="ibc transfer"
        open={isIBCModalOpen}
        onClose={() => setisIBCModalOpen(false)}
      >
        <IBCGuideModal
          token={selectedIBCToken}
          cantoAddress={props.toAddress ?? ""}
          onClose={() => setisIBCModalOpen(false)}
        />
        <div>ref</div>
      </Modal>
      <Modal
        title="confirmation"
        open={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          txProps.resetState();
        }}
      >
        <ConfirmTxModal
          networkId={props.bridgeIn ? ETHMainnet.chainId : CantoMainnet.chainId}
          title={txProps.txName}
          titleIcon={TokenWithIcon({
            icon: props.selectedToken.icon,
            name: props.selectedToken.name,
          })}
          confirmationValues={[
            { title: "from", value: formatAddress(props.fromAddress, 6) },
            { title: "to", value: formatAddress(props.toAddress, 6) },
            {
              title: "amount",
              value: truncateNumber(amount) + " " + props.selectedToken.symbol,
            },
          ]}
          extraInputs={[]}
          disableConfirm={false}
          onConfirm={() => {
            txProps.send(
              convertStringToBigNumber(
                amount,
                props.selectedToken.decimals
              ).toString()
            );
          }}
          loadingProps={{
            transactionType: txProps.txType,
            status: txProps.state,
            tokenName: props.selectedToken.name,
            onClose: () => {
              setModalOpen(false);
            },
          }}
          extraDetails={getBridgeExtraDetails(
            props.bridgeIn,
            false,
            formatAddress(props.fromAddress, 6),
            formatAddress(props.toAddress, 6)
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
          <img
            src={props.bridgeIn ? ethIcon : cantoIcon}
            alt={props.bridgeIn ? "ethereum" : "canto"}
            height={42}
            style={{ marginBottom: "10px" }}
          />
          <Text type="title">{props.bridgeIn ? "Ethereum" : "Canto"}</Text>
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
        </div>
        <div className="center-element">
          <img
            src={props.bridgeIn ? cantoIcon : bridgeIcon}
            alt={props.bridgeIn ? "canto" : "bridge"}
            height={42}
            style={{ marginBottom: "10px" }}
          />
          <Text type="title">{props.bridgeIn ? "Canto" : "Bridge"}</Text>
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
            tokenGroups={props.tokenGroups}
            activeToken={props.selectedToken}
            onSelect={(value) => {
              if (
                value?.tokenGroups.includes(TokenGroups.IBC_TOKENS) &&
                props.bridgeIn
              ) {
                setSelectedIBCToken(value as NativeToken);
                setisIBCModalOpen(true);
              }
              props.selectToken(value?.address ?? props.selectedToken.address);
            }}
          />
        </div>
        <div className="amount">
          {/* <Text
            style={{
              color: "#848484",
              width: "180px",
              marginLeft: "6px",
            }}
          >
            amount :
          </Text> */}
          <CInput
            style={{
              backgroundColor: "transparent",
              width: "100%",
              height: "54px",
            }}
            placeholder={`amount :  ${truncateNumber(
              formatUnits(currentTokenBalance, props.selectedToken.decimals),
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
      </div>
      <Text
        type="text"
        size="text4"
        align="center"
        className="warning"
        style={{ color: "#ff4141" }}
      >
        {buttonDisabled &&
          convertStringToBigNumber(amount, props.selectedToken.decimals).gt(
            currentTokenBalance
          ) &&
          `you have exceeded the maximum amount! (current balance: ${truncateNumber(
            formatUnits(currentTokenBalance, props.selectedToken.decimals)
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
  background: #090909;
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
    border: 1px solid #252525;
    border-radius: 4px;
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
