import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { ChecklistTracker } from "../config/transactionChecklist";

interface ChecklistBoxProps {
  trackerList: ChecklistTracker;
  currentStep: number;
  totalTxs: number;
  addTx: () => void;
  removeTx: () => void;
}
export const BridgeChecklistBox = (props: ChecklistBoxProps) => {
  const fullList = Object.keys(props.trackerList).map((keyName, i) => (
    <Text
      type="text"
      size="text2"
      key={i}
      align="left"
      style={{
        color: i > props.currentStep ? "#414141" : "var(--primary-color)",
      }}
    >
      {props.currentStep == i ? "•" : ""}
      {i + 1}
      {". "}
      {props.trackerList[Number(keyName)].label}
    </Text>
  ));
  return (
    <Styled>
      <Text type="title" size="title2">
        Checklist
      </Text>
      <div className="list">{fullList}</div>
      <Text type="text" size="text3">
        {"transactions tracked: " + props.totalTxs}
      </Text>
      <div className="btns">
        <PrimaryButton onClick={props.addTx}>
          <Text type="text" color="dark" bold>
            Add Txn
          </Text>
        </PrimaryButton>
        <OutlinedButton onClick={props.removeTx}>
          <Text type="text" bold>
            Remove Txn
          </Text>
        </OutlinedButton>
      </div>
    </Styled>
  );
};

const Styled = styled.div`
  background-color: #151515;
  width: 22rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 2rem;
  .list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .btns {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-direction: row-reverse;
  }
`;
