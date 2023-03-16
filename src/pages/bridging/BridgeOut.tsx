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
  selectToken: (token: UserERC20BridgeToken) => void;
  step2Transactions: NativeTransaction[];
}
const BridgeOut = (props: BridgeOutProps) => {
  const transactionHooks = useBridgingTransactions();

  return (
    <BridgeStyled>
      <div className="left">
        <QBoxList
          QA={[
            {
              question: "How long does it take?",
              answer:
                "Sending tokens from Ethereum to the bridge (Step 1) takes 20-30 minutes to reach the bridge. IBC transactions usually complete in a few seconds.",
            },
            {
              question: "Where are my tokens?",
              answer:
                "If you can’t find your tokens, first check to see if the pending transaction is complete at the bottom half of the page. If the transaction is complete, you can click the “Balances” button to see a table of your token balances on Ethereum, the bridge, and Canto’s EVM.",
            },
            {
              question: " Send Funds to Canto",
              answer:
                "If you want to bridge tokens that are currently on the Ethereum mainnet, start at the top and send tokens to the Canto Bridge. If you want to bridge Cosmos tokens using IBC, first send the tokens over (see the docs for instructions), and then proceed to the pending transaction list to complete the bridging process.",
            },
            {
              question: "Complete Pending Transactions",
              answer:
                "If you have previously sent tokens to the bridge, you should see a pending transaction in the list on the bottom half of this page. The “Complete” button will be clickable once the tokens arrive at the Canto Bridge. Click the “Complete” button to move the tokens from the bridge to Canto’s EVM.",
            },
          ]}
        />
      </div>
      <div className="center">
        <div className="evmToBrige">
          <Step1TxBox
            fromAddress={props.ethAddress}
            toAddress={props.cantoAddress}
            bridgeIn={false}
            tokens={props.bridgeOutTokens}
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
        </div>
        <div className="bridgeToCanto">
          <Step2TxBox
            bridgeIn={false}
            transactions={props.step2Transactions}
            txHook={(tokenName) => transactionHooks.bridgeOut.ibcOut(tokenName)}
            cantoAddress={props.cantoAddress ?? ""}
            ethAddress={props.ethAddress ?? ""}
          />
        </div>
      </div>
      <div className="right"></div>
    </BridgeStyled>
  );
};

export default BridgeOut;
