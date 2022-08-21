import styled from "styled-components";
import LendingSwitch from "./lendingSwitch";
import { noteSymbol } from "global//utils/utils";
import Popup from "reactjs-popup";

interface SupplyProps {
  assetName: string;
  assetIcon: string;
  apy: number;
  distAPY: number;
  wallet: number;
  symbol?: string;
  collateral?: boolean;
  onClick?: () => void;
  onToggle: (state: boolean) => void;
  collaterable: boolean;
}

interface BorrowProps {
  assetName: string;
  assetIcon: string;
  apy: number;
  wallet: number;
  symbol?: string;
  liquidity: number;
  onClick: () => void;
  onToggle: (state: boolean) => void;
}
interface BorrowingProps {
  assetName: string;
  assetIcon: string;
  apy: number;
  wallet: number;
  symbol?: string;
  balance: string;
  liquidity: number;
  onClick: () => void;
  onToggle: (state: boolean) => void;
}
interface SupplyingProps {
  assetName: string;
  assetIcon: string;
  apy: number;
  distAPY: number;
  wallet: number;
  symbol?: string;
  collateral?: boolean;
  balance: string;
  onToggle: (state: boolean) => void;
  onClick?: () => void;
  collaterable: boolean;
}

interface ITransactionProps {
  name: string;
  icon: string;
  status: string;
  onClick?: () => void;
  date: Date;
}

const SupplyRow = (props: SupplyProps) => {
  return (
    <tr onClick={props.onClick}>
      <td>
        <img
          style={{
            padding: props.assetName.slice(-2) == "LP" ? "0" : "0 10px",
          }}
          src={props.assetIcon}
          alt=""
        />{" "}
        <span>{props.assetName}</span>
      </td>
      <td> <DualRow top={props.apy + " %"} bottom={props.distAPY + "%"}></DualRow></td>
      <td>
        {props.wallet} {props.symbol}
      </td>
      <td>
        {
          <LendingSwitch
            disabled={!props.collaterable}
            checked={props.collateral ?? false}
            onChange={() => {
              props.onToggle(!props.collateral);
            }}
          />
        }
      </td>
    </tr>
  );
};

function formatLiquidity(liquidity: number) {
  if (liquidity < 2) {
    return liquidity.toFixed(4);
  }
  if (liquidity < 10000) {
    return liquidity.toFixed(2);
  }
  if (liquidity < 1000000) {
    return (liquidity / 1000).toFixed(1) + "k";
  }
  if (liquidity < 1000000000) return (liquidity / 1000000).toFixed(1) + "M";

  return (liquidity / 1000000000).toFixed(1) + "B";

  //TODO : temp fix
  const fm = (liquidity / 1000000).toPrecision(3);
  return fm.substring(0, fm.length - 4);
}
const ToolTip = styled.div`
    border: 1px solid var(--primary-color);
    background-color: #111;
    padding: 1rem;
    /* width: 20rem; */
    color : white;
  `

const BorrowingRow = (props: BorrowProps) => {
  return (
    <tr onClick={props.onClick}>
      <td>
        <img src={props.assetIcon} alt="" /> <span>{props.assetName}</span>
      </td>
      <td>{props.apy} %</td>
      <td>
        {props.wallet} {props.symbol}
      </td>
      {props.assetName == "NOTE" ? <Popup trigger={<td>N/A</td>} on={['hover', 'focus']}><ToolTip>Note Liquidity Is Infinite</ToolTip></Popup> : 
      <td>
        {noteSymbol}
        {formatLiquidity(props.liquidity)}
      </td>
      }
    </tr>
  );
};

interface Iitems {
  top: string;
  bottom: string;
}
const DualRow = ({ top, bottom }: Iitems) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        lineHeight: "1.5rem",
      }}
    >
      <p>{top}</p>
      <p
        style={{
          opacity: 0.5,
        }}
      >
        {bottom}
      </p>
    </div>
  );
};
//TODO: figure out what do to with the props
const BorrowedRow = (props: BorrowingProps) => {
  return (
    <tr onClick={props.onClick}>
      <td>
        <img src={props.assetIcon} alt="" /> <span>{props.assetName}</span>
      </td>
      <td>
        <DualRow top={props.apy + " %"} bottom={""}></DualRow>
      </td>
      <td>
        <DualRow
          bottom={noteSymbol + props.balance}
          top={props.wallet + " " + props.symbol}
        ></DualRow>
      </td>
      <td>{props.liquidity.toFixed(0) + " %"}</td>
    </tr>
  );
};

const SupplyingRow = (props: SupplyingProps) => {
  return (
    <tr onClick={props.onClick}>
      <td>
        <img
          style={{
            padding: props.assetName.slice(-2) == "LP" ? "0" : "0 10px",
          }}
          src={props.assetIcon}
          alt=""
        />{" "}
        <span>{props.assetName}</span>
      </td>
      <td>
        <DualRow top={props.apy + " %"} bottom={props.distAPY + "%"}></DualRow>
      </td>
      <td>
        <DualRow
          bottom={noteSymbol + props.balance}
          top={props.wallet + " " + props.symbol}
        ></DualRow>
      </td>

      <td>
        {
          <LendingSwitch
            checked={props.collateral ?? false}
            disabled={!props.collaterable}
            onChange={() => {
              props.onToggle(!props.collateral);
            }}
          />
        }
      </td>
    </tr>
  );
};

const TransactionRow = (props: ITransactionProps) => {
  return (
    <tr onClick={props.onClick}>
      <td>
        <img src={props.icon} /> <span>{props.name}</span>
      </td>
      <td>{props.status}</td>
      <td>{props.date.toDateString()}</td>
    </tr>
  );
};

export { SupplyRow, SupplyingRow, BorrowingRow, BorrowedRow, TransactionRow };
