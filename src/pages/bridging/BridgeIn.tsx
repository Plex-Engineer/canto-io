import styled from "@emotion/styled";
import Step2TxBox from "./components/step2TxBox";
import { NativeTransaction, UserERC20BridgeToken } from "./config/interfaces";
import Step1TxBox from "./components/step1TxBox";
import { useBridgingTransactions } from "./hooks/useBridgingTransactions";
import { ADDRESSES } from "global/config/addresses";
import QBoxList from "./components/QBoxList";
import { NATIVE_COMSOS_TOKENS } from "./config/bridgingTokens";
import { TokenGroups } from "global/config/tokenInfo";
import { BigNumberish } from "ethers";
import { formatUnits } from "ethers/lib/utils";

interface BridgeInProps {
  ethAddress?: string;
  cantoAddress?: string;
  ethGBridgeTokens: UserERC20BridgeToken[];
  selectedEthToken: UserERC20BridgeToken;
  selectEthToken: (tokenAddress: string) => void;
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
              answer: (
                <>
                  If you want to bridge tokens that are currently on Ethereum
                  mainnet, start at the top to initiate bridging. This first
                  step takes roughly 20 minutes.
                  <br />
                  <br />
                  If you want to bridge from a Cosmos chain start at the top to
                  initiate an IBC transfer (
                  <a
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      window.open(
                        "https://docs.canto.io/user-guides/bridging-assets/to-canto#from-cosmos-hub-and-other-ibc-chains",
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
          tokenGroups={[
            {
              groupName: "canto dex tokens",
              tokens: [
                ...props.ethGBridgeTokens,
                ...NATIVE_COMSOS_TOKENS,
              ].filter((token) =>
                token.tokenGroups.includes(TokenGroups.DEX_TOKENS)
              ),
              getBalance: (token) => {
                if (token.tokenGroups.includes(TokenGroups.IBC_TOKENS))
                  return "ibc";
                else {
                  return formatUnits(
                    token.erc20Balance as BigNumberish,
                    token.decimals
                  );
                }
              },
            },
            {
              groupName: "other tokens",
              tokens: [
                ...props.ethGBridgeTokens,
                ...NATIVE_COMSOS_TOKENS,
              ].filter(
                (token) => !token.tokenGroups.includes(TokenGroups.DEX_TOKENS)
              ),
              getBalance: (token) => {
                if (token.tokenGroups.includes(TokenGroups.IBC_TOKENS))
                  return "ibc";
                else {
                  return formatUnits(
                    token.erc20Balance as BigNumberish,
                    token.decimals
                  );
                }
              },
            },
          ]}
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
