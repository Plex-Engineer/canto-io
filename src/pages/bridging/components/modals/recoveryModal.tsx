import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import Modal from "global/packages/src/components/molecules/Modal";
import Tooltip from "global/packages/src/components/molecules/Tooltip";
import { useState } from "react";
import recoverImg from "assets/recover.svg";
import {
  BasicNativeBalance,
  EMPTY_NATIVE_TOKEN,
} from "pages/bridging/config/interfaces";
import { ALL_BRIDGE_OUT_NETWORKS } from "pages/bridging/config/bridgeOutNetworks";
import MiniTransaction from "../miniTransaction";
import { BridgingTransactionsSelector } from "pages/bridging/hooks/useBridgingTransactions";
import { BigNumber } from "ethers";

interface RecoveryModalProps {
  tokens: BasicNativeBalance[];
  cantoAddress: string;
  txSelector: BridgingTransactionsSelector;
}
const RecoveryModal = ({
  tokens,
  cantoAddress,
  txSelector,
}: RecoveryModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNetowrk, setSelectedNetwork] = useState(0);
  return (
    <Styled>
      <Tooltip
        position="bottom right"
        trigger={
          <div
            role={"button"}
            tabIndex={-2}
            className="floating-btn"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <img src={recoverImg} alt="wallet" height={21} />
          </div>
        }
        content={<Text size="text4">RECOVERY</Text>}
      />
      <Modal
        title="Revcover IBC Transfers"
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <h1>Instructions: </h1>
        <ul style={{ width: "50rem" }}>
          <li>
            1. Each token below represents all unidentified ibc tokens on the
            canto network
          </li>
          <li>
            2. For each token, select the network you would like to ibc transfer
            the tokens back to (this could result in loss of funds if sent to
            the wrong chain)
          </li>
          <li>
            3. Click complete on the token once you have selected the network
            you wish
          </li>
          <li>4. Sorry this is not styled yet, but functionally should work</li>
        </ul>
        <br />
        <br />
        <br />
        <br />
        {/* <ChooseNetwork>
          <div className="network-list">
            {Object.keys(ALL_BRIDGE_OUT_NETWORKS).map((key, network) => (
              <div
                role="button"
                tabIndex={0}
                key={key}
                className="network-item"
                onClick={() => {
                  setSelectedNetwork(network);
                }}
                style={{
                  background: selectedNetowrk === network ? "#F2F2F2" : "",
                }}
              >
                <span>
                  <img
                    src={
                      ALL_BRIDGE_OUT_NETWORKS[
                        network as keyof typeof ALL_BRIDGE_OUT_NETWORKS
                      ].icon
                    }
                    alt=""
                  />
                  <p>
                    {
                      ALL_BRIDGE_OUT_NETWORKS[
                        network as keyof typeof ALL_BRIDGE_OUT_NETWORKS
                      ].name
                    }
                  </p>
                </span>
              </div>
            ))}
          </div>
        </ChooseNetwork> */}
        {tokens.map((token) => {
          return (
            token.denom !== "acanto" && (
              <MiniTransaction
                key={token.denom}
                cantoAddress={cantoAddress}
                ethAddress=""
                transaction={{
                  origin: "cosmos",
                  timeLeft: "0",
                  amount: BigNumber.from(token.amount),
                  token: {
                    ...EMPTY_NATIVE_TOKEN,
                    decimals: 0,
                    ibcDenom: token.denom,
                    name: token.denom,
                    symbol: token.denom.slice(0, 9),
                    supportedOutChannels: [
                      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                    ],
                  },
                }}
                txFactory={() => txSelector.bridgeOut.ibcOut(token.denom)}
                recover={true}
              />
            )
          );
        })}
      </Modal>
    </Styled>
  );
};
const Styled = styled.div`
  .floating-btn {
    height: 40px;
    width: 40px;
    background-color: var(--primary-color);
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: black;
    font-size: 20px;
    position: relative;
    z-index: 3;
    right: 30px;
    top: 20px;
    cursor: pointer;

    &:hover {
      background-color: #13a068;
    }
  }
`;
const ChooseNetwork = styled.div`
  .network-list {
    scrollbar-color: var(--primary-color);
    scroll-behavior: smooth;
    /* width */
    padding: 8px;
    max-height: 200px;
    overflow-y: scroll;
    .network-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 400;
      font-size: 18px;
      letter-spacing: -0.02em;
      height: 38px;
      padding: 0 14px;
      outline: none;
      cursor: pointer;
      img {
        margin: 6px;
        height: 18px;
        width: 18px;
      }
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }
    }
  }
  p {
    font-size: 16px;
    font-weight: 500;
    line-height: 21px;
    letter-spacing: -0.03em;
    color: var(--primary-color);
  }
  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

export default RecoveryModal;
