import styled from "@emotion/styled";
import IconPair from "./iconPair";

interface RowProps {
  iconLeft: string;
  iconRight: string;
  assetName: string;
  totalValueLocked: string;
  position: string;
  apr: string;
  share: string;
  onClick: () => void;
  delay?: number;
  sortableProps?: unknown[];
}

const RowStyle = styled.tr<RowProps>`
  /* opacity: 0; */
  /* animation: fadein 0.6s ${(props) => props.delay}s, fader 0.5s; */
  /* animation-fill-mode: forwards; */

  @keyframes fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;
const Row = (props: RowProps) => {
  return (
    <RowStyle
      {...props}
      onClick={() => {
        props.onClick();
      }}
    >
      <td
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <img src={props.iconLeft} height={30} />
          <img
            src={props.iconRight}
            height={28}
            style={{
              marginLeft: "-.7rem",
              paddingRight: "1rem",
            }}
          />
        </span>
        {props.assetName}
      </td>
      <td>{props.totalValueLocked}</td>
      <td>{props.position}</td>
      <td>{props.share} %</td>
    </RowStyle>
  );
};

interface TransactionProps {
  name: string;
  icons:
    | {
        icon1: string;
        icon2: string;
      }
    | string;
  status: string;
  onClick?: () => void;
  date: Date;
}

export const TransactionRow = (props: TransactionProps) => {
  return (
    <tr onClick={props.onClick}>
      <td
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {" "}
        <span
          style={{
            display: "flex",

            alignContent: "center",
            alignItems: "center",
          }}
        >
          {typeof props.icons != "string" ? (
            <IconPair
              iconLeft={props.icons.icon1}
              iconRight={props.icons.icon2}
            />
          ) : (
            <img
              src={props.icons}
              height={30}
              style={{ marginRight: "10px" }}
            />
          )}{" "}
        </span>
        <span>{props.name}</span>
      </td>
      <td>{props.status}</td>
      <td>{props.date.toDateString()}</td>
    </tr>
  );
};

const LoadingStyle = styled.td`
  display: table-cell !important;
  text-transform: lowercase !important;
  text-align: center !important;
`;

interface LoadingProps {
  colSpan: number;
}
export const LoadingRow = ({ colSpan }: LoadingProps) => {
  return (
    <tr>
      <LoadingStyle colSpan={colSpan}>loading</LoadingStyle>
    </tr>
  );
};

export default Row;
