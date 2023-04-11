import styled from "@emotion/styled";
import loadingIcon from "assets/loading.gif";
import bridgeInIcon from "assets/bridge-in.svg";
import bridgeOutIcon from "assets/bridge-out.svg";
import { Mixpanel } from "mixpanel";
import { TransactionHistoryEvent } from "../utils/bridgeTxHistory";
import { truncateNumber } from "global/utils/utils";
import { formatUnits } from "ethers/lib/utils";
import { convertSecondsToString } from "../utils/utils";

interface TransactionHistoryBoxProps {
  tx: TransactionHistoryEvent;
}
const TransactionHistoryBox = ({ tx }: TransactionHistoryBoxProps) => {
  return (
    <Styled>
      <img
        src={
          !tx.complete
            ? loadingIcon
            : tx.bridgeType == "in"
            ? bridgeInIcon
            : bridgeOutIcon
        }
        alt="loading"
        className="status-icon"
      />

      <p className="status">
        bridge {tx.bridgeType}
        {!tx.complete
          ? " - confirmed in: " + convertSecondsToString(tx.secondsToComplete)
          : ""}
      </p>
      <h1 className="balance">
        {truncateNumber(formatUnits(tx.amount, tx.token?.decimals ?? 18)) +
          " " +
          tx.token?.symbol}
      </h1>
      <a
        href={tx.blockExplorerUrl + tx.txHash}
        target="_blank"
        rel="noreferrer"
        className="link"
        onClick={() =>
          Mixpanel.events.bridgeActions.viewBlockExplorer(
            "bridge " + tx.bridgeType,
            !tx.complete ? "loading" : "complete"
          )
        }
      >
        view on explorer
      </a>
      <div className="date">{new Date(tx.timestamp).toLocaleString()}</div>
    </Styled>
  );
};

const Styled = styled.div`
  height: 6rem;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #222;
  color: var(--primary-color);
  padding: 1rem 1rem 1rem 0.2rem;
  display: grid;

  .status-icon {
    grid-area: icon;
    justify-self: center;
    align-self: stretch;
    width: 4rem;
  }
  .status {
    grid-area: status;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: -0.03em;
  }
  .balance {
    grid-area: balance;
    font-family: "Silkscreen";
    font-size: 20px;
    letter-spacing: -0.07em;
  }

  .date {
    grid-area: date;
    font-size: 14px;
    letter-spacing: -0.07em;
    text-align: right;
  }

  .link {
    text-decoration: underline;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: -0.03em;
    grid-area: link;
    text-align: right;
  }
  grid-template-areas: "icon status status . . . link" "icon balance balance . . . date ";

  @media (max-width: 1000px) {
    .balance {
      font-size: 15px;
    }
    .date {
      display: none;
    }
  }
`;
export default TransactionHistoryBox;
