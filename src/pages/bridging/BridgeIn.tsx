import styled from "@emotion/styled";
import Step2TxBox from "./components/step2TxBox";
import { NativeTransaction, UserERC20BridgeToken } from "./config/interfaces";
import Step1TxBox from "./components/step1TxBox";
import { useBridgingTransactions } from "./hooks/useBridgingTransactions";
import { ADDRESSES } from "global/config/addresses";
import QBoxList from "./components/QBoxList";
import { NATIVE_COMSOS_TOKENS } from "./config/bridgingTokens";

interface BridgeInProps {
  ethAddress?: string;
  cantoAddress?: string;
  ethGBridgeTokens: UserERC20BridgeToken[];
  selectedEthToken: UserERC20BridgeToken;
  selectEthToken: (tokenAddress: string) => void;
  step2Transactions: NativeTransaction[];
  needPubKey: boolean;
}
const BridgeIn = (props: BridgeInProps) => {
  const transactionHooks = useBridgingTransactions();
  const selectedToken = props.selectedEthToken;
  const needAllowance =
    selectedToken.symbol !== "choose token" &&
    (selectedToken.allowance.lt(selectedToken.erc20Balance) ||
      selectedToken.allowance.isZero());

  return (
    <BridgeStyled>
      <div className="left">
        <div
          className="spacer"
          style={{
            marginTop: "3rem",
          }}
        ></div>
        <QBoxList
          title="instructions"
          QA={[
            {
              question: "Step 1: Send Funds to Canto",
              answer: (
                <>
                  If you want to bridge tokens that are currently on Ethereum
                  mainnet, start at the top to initiate bridging. This first
                  step takes roughly 20 minutes.
                  <br />
                  <br />
                  If you want to bridge Cosmos tokens using IBC, first send the
                  tokens over (
                  <a
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      window.open(
                        "https://docs.canto.io/user-guides/bridging-assets/to-canto#from-cosmos-hub-or-other-ibc-enabled-chain",
                        "_blank"
                      )
                    }
                    style={{
                      color: "var(--primary-color)",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    see the docs for instructions
                  </a>
                  ) and then proceed to the queued transaction list to complete
                  the bridging process.
                </>
              ),
            },
            {
              question: "Step 2: Complete Queued Transactions",
              answer:
                "Once you send tokens to Canto you should see a transaction in the bridge queue on the bottom half of this page. The “Complete” button will appear once the tokens arrive at the Canto native chain. Click the “Complete” button to move the tokens from the Canto native chain to Canto’s EVM.",
            },
          ]}
        />
        <QBoxList
          title="F.A.Q."
          QA={[
            {
              question: "How long does it take?",
              answer:
                "Sending tokens from Ethereum to the Canto native chain (Step 1) takes 20-30 minutes. IBC transactions usually complete in a few seconds. Completing a queued transaction (Step 2) usually takes a few seconds.",
            },
            {
              question: "Where are my tokens?",
              answer:
                "If you can’t find your tokens, first check to see if the queued transaction is complete at the bottom half of the page. If the transaction is complete, you can click the “Balances” button to see a table of your token balances that are either queued or on Ethereum or Canto.",
            },
          ]}
        />
      </div>
      <div className="center">
        <Step1TxBox
          fromAddress={props.ethAddress}
          toAddress={props.cantoAddress}
          bridgeIn={true}
          tokens={props.ethGBridgeTokens}
          selectedToken={props.selectedEthToken}
          selectToken={props.selectEthToken}
          txHook={() => {
            if (needAllowance) {
              return transactionHooks.bridgeIn.approveToken(
                selectedToken.address
              );
            }
            return transactionHooks.bridgeIn.sendToCosmos(
              ADDRESSES.ETHMainnet.GravityBridge,
              selectedToken.address,
              props.cantoAddress ?? "ibc"
            );
          }}
          extraTokenData={{
            tokens: NATIVE_COMSOS_TOKENS,
            balance: "ibc",
            onSelect: () => true,
          }}
          needPubKey={props.needPubKey}
        />
        <Step2TxBox
          bridgeIn
          transactions={props.step2Transactions}
          txHook={(tokenName: string) =>
            transactionHooks.convertCoin.convertTx(
              tokenName,
              props.cantoAddress ?? "",
              true
            )
          }
          cantoAddress={props.cantoAddress ?? ""}
          ethAddress={props.ethAddress ?? ""}
        />
      </div>
      <div className="right"></div>
    </BridgeStyled>
  );
};

export const BridgeStyled = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  width: 100%;
  position: relative;
  & > * {
    width: 100%;
  }
  .left {
    height: calc(100% - 1rem);
    overflow-y: auto;
    ::-webkit-scrollbar {
      width: 3px;
      height: 6px;
    }
  }
  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    padding: 60px 0;
    flex-grow: 1;
    width: 100%;
    position: relative;
  }
  @media (max-width: 1000px) {
    br {
      display: none;
    }
  }
`;

export default BridgeIn;
