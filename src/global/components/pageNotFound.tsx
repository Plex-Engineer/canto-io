import styled from "@emotion/styled";
import { PrimaryButton, Text } from "global/packages/src";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <Styled>
      <Text
        type="title"
        size="title1"
        style={{
          fontSize: "8rem",
        }}
      >
        404
      </Text>
      <Text type="title" size="title1">
        Page not found
      </Text>
      <Text type="text" size="text3">
        The page you are looking for does not exist.
      </Text>

      <PrimaryButton
        height="big"
        style={{
          width: "10rem",
          margin: "2rem",
        }}
        filled
        onClick={() => {
          navigate("/");
        }}
      >
        Go Home
      </PrimaryButton>
    </Styled>
  );
};

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 10rem);
  flex-grow: 2;
  width: 1200px;
  margin: 0 auto;
  background-color: black;
`;

export default PageNotFound;
