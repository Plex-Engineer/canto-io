import styled from "@emotion/styled";
import Step2TxBox from "./components/step2TxBox";
import { NativeTransaction, UserERC20BridgeToken } from "./config/interfaces";
import Step1TxBox from "./components/step1TxBox";
import { useBridgingTransactions } from "./hooks/useBridgingTransactions";
import { ADDRESSES } from "global/config/addresses";
import QBoxList from "./components/QBoxList";

interface BridgeInProps {
  ethAddress?: string;
  cantoAddress?: string;
  ethGBridgeTokens: UserERC20BridgeToken[];
  selectedEthToken: UserERC20BridgeToken;
  selectEthToken: (token: UserERC20BridgeToken) => void;
  step2Transactions: NativeTransaction[];
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
        <QBoxList
          title="instructions"
          QA={[
            {
              question: "Step 1: Send Funds to Canto",
              answer:
                "If you want to bridge tokens that are currently on Ethereum mainnet, start at the top and send tokens to the Canto Bridge. If you want to bridge Cosmos tokens using IBC, first send the tokens over (see the docs for instructions), and then proceed to the pending transaction list to complete the bridging process.",
            },
            {
              question: "Step 2: Complete Pending Transactions",
              answer:
                "If you have previously sent tokens to the bridge, you should see a pending transaction in the list on the bottom half of this page. The “Complete” button will be clickable once the tokens arrive at the Canto Bridge. Click the “Complete” button to move the tokens from the bridge to Canto’s EVM.",
            },
          ]}
        />
        <QBoxList
          title="F.A.Q."
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
              props.cantoAddress ?? ""
            );
          }}
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
