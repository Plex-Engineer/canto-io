import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import IconPair from "./iconPair";
import noteIcon from "assets/note.svg";
interface RowProps {
  iconLeft: string;
  iconRight: string;
  assetName: string;
  totalValueLocked: string;
  position: string;
  share: string;
  onClick: () => void;
  delay?: number;
  sortableProps?: unknown[];
}

const RowStyle = styled.tr<RowProps>`
  .center {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
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
      <td className="center">
        <Text type="title" size="text3" bold className="center">
          <span>
            <img
              src={props.iconLeft}
              height={30}
              style={{
                zIndex: "2",
              }}
            />
            <img
              src={props.iconRight}
              height={30}
              style={{
                marginLeft: "-.7rem",
                paddingRight: "1rem",
              }}
            />
          </span>
          {props.assetName}
        </Text>
      </td>
      <td>
        <div className="center">
          <img src={noteIcon} alt="note" height={14} width={14} />
          <Text size="text3">{props.totalValueLocked}</Text>
        </div>
      </td>
      <td>
        <Text size="text3">{props.position}</Text>
      </td>
      <td>
        <Text size="text3">{props.share}%</Text>
      </td>
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
