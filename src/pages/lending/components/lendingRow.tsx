import styled from "@emotion/styled";
import LendingSwitch from "./lendingSwitch";
import { noteSymbol } from "global/utils/utils";
import { ToolTip } from "./Tooltip";
import React from "react";
import { formatLiquidity } from "../utils/utils";

interface BorrowingProps {
  borrowing: boolean;
  assetName: string;
  assetIcon: string;
  apy: string;
  amount: string;
  amountInNote: string;
  symbol?: string;
  liquidity: number;
  onClick: () => void;
}
interface SupplyProps {
  supplying: boolean;
  assetName: string;
  assetIcon: string;
  apy: string;
  distAPY: string;
  symbol?: string;
  collateral?: boolean;
  amount: string;
  amountInNote: string;
  onToggle: (state: boolean) => void;
  onClick?: () => void;
  collaterable: boolean;
  rewards?: string;
}

interface ITransactionProps {
  name: string;
  icon: string;
  status: string;
  onClick?: () => void;
  date: Date;
}

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
const BorrowRow = (props: BorrowingProps) => {
  return (
    <tr onClick={props.onClick}>
      <td>
        <img src={props.assetIcon} alt="" /> <span>{props.assetName}</span>
      </td>
      <td>{props.apy + " %"}</td>
      {props.borrowing ? (
        <React.Fragment>
          <td>
            <DualRow
              top={props.amount + " " + props.symbol}
              bottom={noteSymbol + props.amountInNote}
            ></DualRow>
          </td>
          <td>{props.liquidity.toFixed(0) + " %"}</td>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <td>{props.amount + " " + props.symbol}</td>
          {props.assetName == "NOTE" ? (
            <ToolTip as={"td"} data-tooltip="Note Liquidity Is Infinite">
              N/A
            </ToolTip>
          ) : (
            <td>
              {noteSymbol}
              {formatLiquidity(props.liquidity)}
            </td>
          )}
        </React.Fragment>
      )}
    </tr>
  );
};

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
      <td>
        <DualRow top={props.apy + " %"} bottom={props.distAPY + "%"}></DualRow>
      </td>
      {props.supplying ? (
        <React.Fragment>
          <td>{Number(props.rewards).toFixed(2)} WCANTO</td>
          <td>
            <DualRow
              top={props.amount + " " + props.symbol}
              bottom={noteSymbol + props.amountInNote}
            ></DualRow>
          </td>
        </React.Fragment>
      ) : (
        <td>{props.amount + " " + props.symbol}</td>
      )}

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

const LoadingRow = styled.td`
  display: table-cell !important;
  text-transform: lowercase !important;
  text-align: center !important;
`;

export { SupplyRow, BorrowRow, TransactionRow, LoadingRow };
