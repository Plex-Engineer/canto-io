import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import warningImg from "assets/warning.svg";

const ConfirmUndelegation = styled.div`
  background: rgba(217, 217, 217, 0.2);
  backdrop-filter: blur(35px);
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column wrap;
  .warning-message {
    margin: 1rem;
    width: 55%;
  }
  .btn-group {
    margin-bottom: 1rem;
    width: 50%;
  }
`;

interface ConfirmUndelegationProps {
  onUndelegate: () => void;
  onCancel: () => void;
}
export const ConfirmUndelegationModal = (props: ConfirmUndelegationProps) => {
  return (
    <ConfirmUndelegation>
      <img src={warningImg} alt={"warning-icon"} />
      <Text type={"title"} className="warning-message">
        funds will not be available for another 21 days
      </Text>
      <Text type={"text"} className="warning-message">
        you will be able to dispose of these funds after 21 days. during this
        period, no rewards will accrue
      </Text>
      <PrimaryButton className="btn-group" onClick={() => props.onUndelegate()}>
        confirm undelegation
      </PrimaryButton>
      <OutlinedButton className="btn-group" onClick={() => props.onCancel()}>
        undelegate later
      </OutlinedButton>
    </ConfirmUndelegation>
  );
};
