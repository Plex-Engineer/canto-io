import styled from "@emotion/styled";
import IconPair from "./iconPair";

interface ButtonProps {
  primary?: boolean;
}
// ! TODO: switch to interal primary button option
export const Button = styled.button<ButtonProps>`
  background-color: ${(props) =>
    props.primary ? "black" : "var(--primary-color);"};
  font-size: 14px;

  border: none;
  color: ${(props) => (props.primary ? "var(--primary-color)" : "black")};
  border: ${(props) =>
    props.primary ? "var(--primary-color) solid 1px" : "none"};
  padding: 0.3rem;
  margin: 0.2rem;
  font-weight: 500;
  /* text-shadow: ${(props) =>
    props.primary
      ? "1px 1px 2px green, 0 0 1em green, 0 0 0.2em green"
      : "1px 1px 1px #00B665, 0 0 1px #00B665, 0 0 1px #00B665"}; */

  &:hover {
    transform: scale(1.1);
    cursor: pointer;
    transition: all 0.1s ease-in-out;
  }
`;

interface RowProps {
  iconLeft: string;
  iconRight: string;
  assetName: string;
  totalValueLocked: string;
  position: string;
  apr: string;
  share: string;
  onClick: () => void;
}
const Row = (props: RowProps) => {
  return (
    <tr
      onClick={() => {
        props.onClick();
      }}
    >
      <td style={{
        display : "flex",
        justifyContent : "center"
      }}><span style={{
        display : "flex",
 
        alignContent : "center",
        alignItems : "center"
      }}>
        <img src={props.iconLeft} height={30}style={{
          // zIndex : "1"
          
        }}/>
        <img src={props.iconRight} height={28} style={{
          marginLeft: "-.7rem",
          paddingRight : "1rem"
        }}/>
        </span>{props.assetName}</td>
      <td>{props.totalValueLocked}</td>
      <td>{props.position}</td>
      <td>{props.share} %</td>
    </tr>
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

<td style={{
        display : "flex",
        justifyContent : "center"
      }}> <span style={{
        display : "flex",
 
        alignContent : "center",
        alignItems : "center"
      }}>
        {typeof props.icons != "string" ? (
        <IconPair iconLeft={props.icons.icon1} iconRight={props.icons.icon2} />
      ) : (
        <img src={props.icons} height={30} style={{marginRight : "10px"}} />
      )}  </span>
        <span>{props.name}</span>
      </td>
      <td>{props.status}</td>
      <td>{props.date.toDateString()}</td>
    </tr>
  );
};


export default Row;
