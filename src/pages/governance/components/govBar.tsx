import styled from "@emotion/styled";
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
        <p className="number">
          {props.status == "PROPOSAL_STATUS_VOTING_PERIOD"
            ? "Voting"
            : props.status == "PROPOSAL_STATUS_PASSED"
            ? "Passed"
            : "Rejected"}
        </p>
      </div>
      <h1>{props.name}</h1>

      <div className="options">
        <div className="details options-1">
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

        <div className="details options-2">
          <div
            style={{
              display: "flex",
              gap: "1rem",
            }}
          >
            <BlobText color="#06fc99">
              yes {props.yesPecterage.toFixed(2)}%
            </BlobText>
            <BlobText color="#ff4646">
              no {props.noPecterage.toFixed(2)}%
            </BlobText>
            <BlobText color="#710808">
              no with veto {props.vetoPecterage.toFixed(2)}%
            </BlobText>
            <BlobText color="#fbea51">
              abstain {props.abstainPecterage.toFixed(2)}%
            </BlobText>
          </div>
        </div>
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
  .number {
    color: #707070;
  }

  h1 {
    font-weight: 300;
    font-size: 1.4rem;
    letter-spacing: -0.05em;
    max-height: 3rem;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .details {
    position: absolute;
    top: 0px;
    display: flex;
    color: #7f7f7f;
    margin: 0.5rem 0 -0.5rem 0;
    justify-content: space-between;
  }

  .options {
    position: relative;
    height: 4rem;
  }
  .options-1 {
    display: flex;
    opacity: 1;
    transition: all 0.2s ease-in-out;
  }
  .options-2 {
    display: flex;
    opacity: 0;

    justify-content: space-between;
    transition: all 0.2s ease-in-out;
  }
  &:hover {
    border: 1px solid var(--primary-color);
    cursor: pointer;
    .options-1 {
      opacity: 0;
    }

    .options-2 {
      opacity: 1;
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
  align-items: center;
  &::before {
    content: " ";
    display: flex;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    margin-right: 0.5rem;
    background-color: ${(props) => props.color};
  }
`;
export default GovBar;
