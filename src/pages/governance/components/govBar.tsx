import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import { VoteStatus } from "../config/interfaces";
import { convertDateToString } from "../utils/formattingStrings";

const GovBar = (props: barProps) => {
  return (
    <Styled onClick={props.onClick}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <p className="number">#{props.proposalID}</p>
        <Text type="title" className="number">
          {props.status == "PROPOSAL_STATUS_VOTING_PERIOD"
            ? "Voting"
            : props.status == "PROPOSAL_STATUS_PASSED"
            ? "Passed"
            : "Rejected"}
        </Text>
      </div>
      <Text type="title" size="title3" align="left">
        {props.name}
      </Text>

      <div className="options-1">
        {props.status == VoteStatus.votingOngoing ? (
          <>
            <p>start {convertDateToString(props.startDate, true)}</p>{" "}
            <p> &nbsp;→&nbsp; </p>
            <p>end {convertDateToString(props.endDate, true)}</p>
          </>
        ) : (
          <>vote ended {convertDateToString(props.endDate, false)}</>
        )}
      </div>
      <div className="votes-grp">
        <BlobText color="#06fc99">
          <span className="label">yes :</span> {props.yesPecterage.toFixed(2)}%
        </BlobText>
        <BlobText color="#ff4646">
          <span className="label">no :</span> {props.noPecterage.toFixed(2)}%
        </BlobText>
        <BlobText color="#710808">
          <span className="label">veto :</span> {props.vetoPecterage.toFixed(2)}
          %
        </BlobText>
        <BlobText color="#fbea51">
          <span className="label">abstain :</span>{" "}
          {props.abstainPecterage.toFixed(2)}%
        </BlobText>
      </div>
      <GraphBar {...props} />
    </Styled>
  );
};

const Styled = styled.div`
  background-color: black;
  padding: 1rem;
  border: 1px solid transparent;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  &:hover {
    border: 1px solid #444;
    border-radius: 4px;
    cursor: pointer;
  }
  .number {
    color: #707070;
  }

  .details {
    display: flex;
    color: #7f7f7f;
    background-color: red;
    text-align: right;
    align-items: flex-end;
    justify-content: space-between;
  }

  .options-1 {
    display: flex;
    align-items: center;
    transition: all 0.2s ease-in-out;
  }
  .votes-grp {
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: absolute;
    row-gap: 2rem;
    column-gap: 4rem;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 4px;
    justify-content: space-between;
    /* transition: all 0.2s ease-in 0.2s; */
    background-color: black;
    padding: 2rem;
    padding-left: 4rem;
    opacity: 0;

    &:hover {
      opacity: 1;
      transition-delay: 0.1s;
    }
  }
`;
interface barProps {
  yesPecterage: number;
  noPecterage: number;
  vetoPecterage: number;
  abstainPecterage: number;
  name: string;
  proposalID: string;
  startDate: string;
  endDate: string;
  status: string;
  onClick: () => void;
}
interface minibarProps {
  yesPecterage: number;
  noPecterage: number;
  vetoPecterage: number;
  abstainPecterage: number;
}

const Bar = styled.div<minibarProps>`
  width: 100%;
  display: flex;
  margin-top: 1rem;
  margin-bottom: 0.4rem;
  div {
    height: 6px;
  }
  .yes {
    background-color: #06fc99;
    width: ${(props) => props.yesPecterage + "%"};
  }
  .no {
    background-color: #ff4646;
    width: ${(props) => props.noPecterage + "%"};
  }
  .veto {
    background-color: #710808;
    width: ${(props) => props.vetoPecterage + "%"};
  }
  .abstain {
    background-color: #fbea51;
    width: ${(props) => props.abstainPecterage + "%"};
  }
`;
export const GraphBar = (props: minibarProps) => {
  return (
    <Bar {...props}>
      <div className="yes"></div>
      <div className="no"></div>
      <div className="veto"></div>
      <div className="abstain"></div>
    </Bar>
  );
};

interface blobProp {
  color: string;
}
const BlobText = styled.p<blobProp>`
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  font-family: "Silkscreen";

  span {
    font-family: "Silkscreen";
    margin-right: 8px;
    /* color: ${(props) => props.color}; */
  }

  &::before {
    content: " ";
    display: flex;
    height: 20px;
    width: 10px;
    border-radius: 10px;
    margin-right: 0.5rem;
    background-color: ${(props) => props.color};
  }
`;
export default GovBar;
