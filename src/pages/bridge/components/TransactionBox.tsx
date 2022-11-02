import styled from "@emotion/styled";
import loadingIcon from "assets/loading.gif";
import completeIcon from "assets/complete.svg";
import { convertSecondsToString } from "../utils/utils";

interface Props {
  type: "in" | "out";
  balance: string;
  blockExplorerUrl: string;
  symbol: string;
  status: "loading" | "complete";
  timestamp: number | string;
  secondsUntilConfirmed?: string;
}
const TransactionBox = (props: Props) => {
  return (
    <Styled>
      <img
        src={props.status == "loading" ? loadingIcon : completeIcon}
        alt="loading"
        className="status-icon"
      />

      <p className="status">
        bridge {props.type}
        {props.secondsUntilConfirmed
          ? " - confimred in: " +
            convertSecondsToString(props.secondsUntilConfirmed)
          : ""}
      </p>
      <h1 className="balance">{props.balance + " " + props.symbol}</h1>
      <a
        href={props.blockExplorerUrl}
        target="_blank"
        rel="noreferrer"
        className="link"
      >
        view on explorer
      </a>
      <div className="date">{new Date(props.timestamp).toLocaleString()}</div>
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
export default TransactionBox;
