import { BigNumberish } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { BridgeStyled } from "./BridgeIn";
import QBoxList from "./components/QBoxList";
import Step1TxBox from "./components/step1TxBox";
import Step2TxBox from "./components/step2TxBox";
import { NativeTransaction, UserERC20BridgeToken } from "./config/interfaces";
import { useBridgingTransactions } from "./hooks/useBridgingTransactions";

interface BridgeOutProps {
  ethAddress?: string;
  cantoAddress?: string;
  bridgeOutTokens: UserERC20BridgeToken[];
  selectedBridgeOutToken: UserERC20BridgeToken;
  selectToken: (tokenAddress: string) => void;
  step2Transactions: NativeTransaction[];
}
const BridgeOut = (props: BridgeOutProps) => {
  const transactionHooks = useBridgingTransactions();

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
          fromAddress={props.ethAddress}
          toAddress={props.cantoAddress}
          bridgeIn={false}
          tokenGroups={[
            {
              groupName: "bridge out tokens",
              tokens: props.bridgeOutTokens,
              getBalance: (token) =>
                formatUnits(token.erc20Balance as BigNumberish, token.decimals),
            },
          ]}
          selectedToken={props.selectedBridgeOutToken}
          selectToken={props.selectToken}
          txHook={() =>
            transactionHooks.convertCoin.convertTx(
              props.selectedBridgeOutToken.address,
              props.cantoAddress ?? "",
              false
            )
          }
        />
        <Step2TxBox
          bridgeIn={false}
          transactions={props.step2Transactions}
          txHook={(tokenName) => transactionHooks.bridgeOut.ibcOut(tokenName)}
          cantoAddress={props.cantoAddress ?? ""}
          ethAddress={props.ethAddress ?? ""}
        />
      </div>
      <div className="right"></div>
    </BridgeStyled>
  );
};

export default BridgeOut;
