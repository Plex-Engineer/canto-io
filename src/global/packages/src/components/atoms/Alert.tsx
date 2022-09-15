import { useAlert } from "../../stores/index";
import styled from "@emotion/styled";

const SuccessStyle = styled.div`
  background-color: #09271b;
  border-bottom: 1px solid var(--primary-color);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--primary-color);
  text-shadow: none;
  transition: all;
  overflow-x: hidden;
`;

const ErrorStyle = styled(SuccessStyle)`
  background-color: #1d0a0a;
  border-bottom: 1px solid #ff4141;
  color: #ff4141;
`;

const WarningStyle = styled(SuccessStyle)`
  background-color: #3b310e;
  border-bottom: 1px solid #ffda58;
  color: #ffda58;
`;

const Container = styled.div`
  height: 6rem;
  transition: all 0.3s;
`;

const Alert = () => {
  const { type, open, child } = useAlert();
  return (
    <Container
      style={{
        height: open ? "6rem" : "0",
      }}
    >
      {type == "Success" ? (
        <SuccessStyle>{child}</SuccessStyle>
      ) : type == "Failure" ? (
        <ErrorStyle>{child}</ErrorStyle>
      ) : type == "Warning" ? (
        <WarningStyle>{child}</WarningStyle>
      ) : null}
    </Container>
  );
};

export default Alert;
