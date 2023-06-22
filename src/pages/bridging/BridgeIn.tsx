import styled from "@emotion/styled";
import Step2TxBox from "./components/step2TxBox";
import Step1TxBox from "./components/step1TxBox";
import QBoxList from "./components/QBoxList";
import { Token } from "global/config/interfaces/tokens";
import { BigNumber } from "ethers";
import { TransactionStore } from "global/stores/transactionStore";
import {
  BridgingNetwork,
  NativeTransaction,
} from "./config/bridgingInterfaces";

interface BridgeInProps {
  //tokens
  bridgeTokens: Token[];
  selectedToken?: Token;
  selectToken: (token?: Token) => void;
  //networks
  chainId: number;
  allNetworks: BridgingNetwork[];
  fromNetwork: BridgingNetwork;
  toNetwork: BridgingNetwork;
  selectNetwork: (network: BridgingNetwork, isFrom: boolean) => void;
  //addresses
  ethAddress?: string;
  cantoAddress?: string;
  //tx
  tx: (amount: BigNumber, toChainAddress?: string) => Promise<boolean>;
  txStore: TransactionStore;
  //step2
  step2Transactions: NativeTransaction[];
}
const BridgeIn = (props: BridgeInProps) => {
  return (
    <BridgeStyled>
      <div className="left">
        <QBoxList
          title="instructions"
          QA={[
            {
              question: "Step 1: Send Funds to Canto",
              answer: (
                <>
                  To start bridging, select the network and token you want to
                  bridge in on the top half of the page. If you are bridging in
                  from Ethereum, this first step usually takes 20 minutes
                  <br />
                  <br />
                  For more details,{" "}
                  <a
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      window.open(
                        "https://docs.canto.io/user-guides/bridging-assets/to-canto",
                        "_blank"
                      )
                    }
                    style={{
                      color: "var(--primary-color)",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    click here
                  </a>
                </>
              ),
            },
            {
              question: "Step 2: Complete Queued Transactions",
              answer:
                "The 'Complete' button will appear in the bridge queue on the bottom half of this page once the tokens arrive at the Canto native chain. Click the 'Complete' button to move the tokens from the Canto native chain to Canto's EVM",
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
          bridgeIn={true}
          allNetworks={props.allNetworks}
          fromNetwork={props.fromNetwork}
          toNetwork={props.toNetwork}
          selectNetwork={(network) => props.selectNetwork(network, true)}
          fromAddress={props.ethAddress}
          toAddress={
            props.selectedToken?.isOFT ? props.ethAddress : props.cantoAddress
          }
          allTokens={props.bridgeTokens}
          selectedToken={props.selectedToken}
          selectToken={props.selectToken}
          tx={async (amount: BigNumber) => await props.tx(amount)}
        />
        <Step2TxBox
          bridgeIn
          transactions={props.step2Transactions}
          cantoAddress={props.cantoAddress ?? ""}
          ethAddress={props.ethAddress ?? ""}
          txStore={props.txStore}
          chainId={props.chainId}
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
    margin-top: 3rem;
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
    flex-direction: column-reverse;

    br {
      display: none;
    }
    .center {
      padding: 4rem 1rem 2rem 1rem;
    }

    .right {
      display: none;
    }

    .left {
      margin-top: 0;
      margin-bottom: 4rem;
    }
  }
`;

export default BridgeIn;
