import { BigNumber } from "ethers";
import { BridgeStyled } from "./BridgeIn";
import QBoxList from "./components/QBoxList";
import Step1TxBox from "./components/step1TxBox";
import { TransactionStore } from "global/stores/transactionStore";
import { Token } from "global/config/interfaces/tokens";
import { BridgingNetwork } from "./config/bridgingInterfaces";
interface BridgeOutProps {
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
}
const BridgeOut = (props: BridgeOutProps) => {
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
              question: "Step 1: Send Funds from Canto",
              answer:
                "This first step initiates bridging out, select the token and the amount you want to bridge out to add a transaction to the bridging queue. This first step usually completes in a few seconds.",
            },
            {
              question: "Step 2: Complete Queued Transactions",
              answer: (
                <>
                  After completing the first step, the token you want to bridge
                  out will appear in the queue. Click the “Complete” button to
                  bridge the tokens out to their native chain. You’ll need the
                  address you want to send tokens to.{" "}
                  <a
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      window.open(
                        " https://docs.canto.io/user-guides/bridging-assets/from-canto",
                        "_blank"
                      )
                    }
                    style={{
                      color: "var(--primary-color)",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    click here to learn more.
                  </a>
                </>
              ),
            },
          ]}
        />
        <QBoxList
          title="F.A.Q."
          QA={[
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
          bridgeIn={false}
          allNetworks={props.allNetworks}
          fromNetwork={props.fromNetwork}
          toNetwork={props.toNetwork}
          selectNetwork={(network) => props.selectNetwork(network, false)}
          fromAddress={props.ethAddress}
          toAddress={
            props.toNetwork.isEVM ? props.ethAddress : props.cantoAddress
          }
          allTokens={props.bridgeTokens}
          selectedToken={props.selectedToken}
          selectToken={props.selectToken}
          tx={async (amount: BigNumber, toAddress?: string) =>
            await props.tx(amount, toAddress)
          }
        />
      </div>
      <div className="right"></div>
    </BridgeStyled>
  );
};

export default BridgeOut;
