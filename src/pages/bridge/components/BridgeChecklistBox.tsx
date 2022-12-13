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
    <div key={i}>
      {props.currentStep == i ? ">> " : ""}
      {i + 1}
      {": "}
      {props.trackerList[Number(keyName)].label}
    </div>
  ));
  return (
    <>
      <div>Checklist</div>
      {fullList}
      <div>{"transactions tracked: " + props.totalTxs}</div>
      <button onClick={props.addTx}>Add Tx</button>
      <button onClick={props.removeTx}>Remove Tx</button>
    </>
  );
};
