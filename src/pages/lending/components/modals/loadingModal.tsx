import styled from "styled-components";
import loading from "assets/loading.svg";
interface ILoading {
  isLoading: boolean;
  status: string | undefined;
  modalText: string;
}

const Progress = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  //keep rotating img
  img {
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
const LoadingModal = ({ status, modalText }: ILoading) => {
  let currentStatus = "";
  switch (status) {
    case "PendingSignature":
      currentStatus = "waiting for confirmation";
      break;
    case "Mining":
      currentStatus = "validating";
      break;
    case "Success":
      currentStatus = "successful";
      break;
    case "Exception":
      currentStatus = "Cancelled";
      break;
  }
  return (
    <Progress>
      <img src={loading} height={60} />
      {/* <h3>{modalText}</h3> */}
      <p>{currentStatus}</p>
      {currentStatus == "mining" ? (
        <Button>view on etherscan</Button>
      ) : null}{" "}
    </Progress>
  );
};

export default LoadingModal;
