import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import useTransactionStore from "../stores/transactionStore";
import loadingGif from "assets/loading.gif";
import completeIcon from "assets/complete.svg";
import warningIcon from "assets/warning.svg";

const LoadingModal = () => {
  const transactionStatus = useTransactionStore(
    (state) => state.transactionStatus
  );
  return (
    <Styled>
      <img
        src={
          transactionStatus?.status == "success"
            ? completeIcon
            : transactionStatus?.status == "failure"
            ? warningIcon
            : loadingGif
        }
        height={100}
        width={100}
      />
      <Text size="title2" type="title">
        {transactionStatus?.status}
      </Text>
      <Text size="text1" type="text">
        {transactionStatus?.message}
      </Text>
    </Styled>
  );
};

const Styled = styled.div`
  background-color: black;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export default LoadingModal;
