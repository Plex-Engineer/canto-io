import styled from "styled-components";
import LendingSwitch from "./lendingSwitch";
import { noteSymbol } from "global/utils/utils";
import { ToolTip } from "./Tooltip";

interface SupplyProps {
  assetName: string;
  assetIcon: string;
  apy: string;
  distAPY: string;
  wallet: string;
  symbol?: string;
  collateral?: boolean;
  onClick?: () => void;
  onToggle: (state: boolean) => void;
  collaterable: boolean;
}

interface BorrowProps {
  assetName: string;
  assetIcon: string;
  apy: string;
  wallet: string;
  symbol?: string;
  liquidity: number;
  onClick: () => void;
  onToggle: (state: boolean) => void;
}
interface BorrowingProps {
  assetName: string;
  assetIcon: string;
  apy: string;
  wallet: string;
  symbol?: string;
  balance: string;
  liquidity: number;
  onClick: () => void;
  onToggle: (state: boolean) => void;
}
interface SupplyingProps {
  assetName: string;
  assetIcon: string;
  apy: string;
  distAPY: string;
  wallet: string;
  symbol?: string;
  collateral?: boolean;
  balance: string;
  onToggle: (state: boolean) => void;
  onClick?: () => void;
  collaterable: boolean;
  rewards: string;
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
      <td>
        <DualRow top={props.apy + " %"} bottom={props.distAPY + "%"}></DualRow>
      </td>
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
}

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
      {props.assetName == "NOTE" ? (
        // <Popup trigger={<td>N/A</td>} on={["hover", "focus"]}>
        //   <ToolTip>Note Liquidity Is Infinite</ToolTip>
        // </Popup>
        <ToolTip as={"td"} data-tooltip="Note Liquidity Is Infinite">
          N/A
        </ToolTip>
      ) : (
        <td>
          {noteSymbol}
          {formatLiquidity(props.liquidity)}
        </td>
      )}
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
      <td>{Number(props.rewards).toFixed(2)} WCANTO</td>
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

const LoadingRow = styled.td`
  display: table-cell !important;
  text-transform: lowercase !important;
  text-align: center !important;
`;

export {
  SupplyRow,
  SupplyingRow,
  BorrowingRow,
  BorrowedRow,
  TransactionRow,
  LoadingRow,
};
