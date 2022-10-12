import styled from "@emotion/styled";
import loadingIcon from "assets/loading.gif";
import completeIcon from "assets/complete.svg";

interface Props {
  type: "in" | "out";
  balance: string;
  id: number;
  txnValue: string;
  symbol: string;
  status: "loading" | "complete";
}
const TransactionBox = (props: Props) => {
  return (
    <Styled>
      <img
        src={props.status == "loading" ? loadingIcon : completeIcon}
        height={80}
        alt="loading"
        className="status-icon"
      />

      <p className="status">
        #{props.id} {" bridge"} {props.type}
      </p>
      <h1 className="balance">{props.balance + " " + props.symbol}</h1>
      <a
        href={"https://etherscan.io/tx/" + props.txnValue}
        target="_blank"
        rel="noreferrer"
        className="link"
      >
        view on explorer
      </a>
    </Styled>
  );
};

const Styled = styled.div`
  height: 6rem;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #222;
  color: var(--primary-color);
  padding: 1rem;
  display: grid;
  .status-icon {
    grid-area: icon;
    justify-self: start;
    align-self: center;
    width: 5.8rem;
    height: 5.8rem;
    margin: -1rem;
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

  .link {
    text-decoration: underline;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: -0.03em;
    grid-area: link;
  }
  grid-template-areas: "icon status status . . . link" "icon balance balance . . . . ";
`;
export default TransactionBox;
