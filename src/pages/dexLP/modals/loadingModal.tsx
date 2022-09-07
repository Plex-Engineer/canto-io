import styled from "@emotion/styled";
import loading from "assets/loading.svg";
import {
  getTransactionStatusString,
  transactionStatusActions,
} from "global/utils/utils";
interface ILoading {
  status: string | undefined;
  name: string;
  icons:
    | {
        icon1: string;
        icon2: string;
      }
    | string;
  amount: string;
  type: string;
}

const Progress = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  //keep rotating img
  .loading {
    animation: rotate 2s linear infinite;
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  h3 {
    margin-top: 1rem;
    color: var(--primary-color);
    font-weight: 400;
  }
  p {
    border-top: 1px solid #222;
    width: 80%;
    margin-top: 1rem;
    padding-top: 1rem;
    color: white;
    font-size: 18px;
    font-weight: 400;
    line-height: 25px;
    letter-spacing: 0em;
    text-align: center;
  }
`;

const Button = styled.button`
  font-weight: 300;
  font-size: 18px;
  background-color: black;
  color: var(--primary-color);
  padding: 0.2rem 2rem;
  border: 1px solid var(--primary-color);
  margin: 3rem auto;
  margin-bottom: 0;
  display: flex;
  align-self: center;
  &:hover {
    background-color: var(--primary-color-dark);
    color: black;
    cursor: pointer;
  }
`;

const LoadingModal = (props: ILoading) => {
  const actionObj = transactionStatusActions(props.type, "tokens");

  const currentStatus = getTransactionStatusString(
    actionObj.action,
    actionObj.inAction,
    actionObj.postAction,
    props.status
  );

  return (
    <Progress>
      {/* {typeof props.icons != "string" ? (
        <IconPair iconLeft={props.icons.icon1} iconRight={props.icons.icon2} />
      ) : (
        <img src={props.icons} height={40} />
      )} */}
      <img src={loading} className="loading" height={60} />
      <h3 style={{ marginTop: "2rem" }}>{props.name}</h3>
      <p>{currentStatus}</p>
      {currentStatus == "mining" ? (
        <Button>view on etherscan</Button>
      ) : null}{" "}
    </Progress>
  );
};

export default LoadingModal;
