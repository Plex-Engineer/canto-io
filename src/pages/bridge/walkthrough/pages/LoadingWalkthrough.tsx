import styled from "@emotion/styled";
import loadingIcon from "assets/loading.gif";
import { Text } from "global/packages/src";
import { useEffect, useState } from "react";

interface Props {
  delay: number;
}
const LoadingWalkthrough = ({ delay }: Props) => {
  const [isDone, setDone] = useState(false);

  useEffect(() => {
    setTimeout(() => setDone(true), delay);
  }, []);

  if (isDone) {
    return <></>;
  }
  return (
    <Styled>
      <Text type="title" size="title2">
        Bridge Walkthrough
      </Text>

      <img src={loadingIcon} height={100} />
      <div
        style={{
          maxWidth: "500px",
        }}
      >
        <Text type="title">Setting up the walkthrough for you</Text>
        <Text type="text" size="text3">
          You can use this to ease up and go through each step one-by-one. we
          are here to help you make the process easier
        </Text>
      </div>
    </Styled>
  );
};

const Styled = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
  background-color: #010101;
  z-index: 2;
  padding: 2rem;
`;

export default LoadingWalkthrough;
