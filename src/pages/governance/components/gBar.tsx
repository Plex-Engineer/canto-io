import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import Tooltip from "global/packages/src/components/molecules/Tooltip";
import { truncateNumber } from "global/utils/formattingNumbers";
interface Props {
  yes: number;
  no: number;
  veto: number;
  abstain: number;
  totalVotes: number;
  quorum: number;
  threshold: number;
  vetoThreshold: number;
}

const GBar = (props: Props) => {
  return (
    <Styled {...props}>
      <div className="votes">
        <Tooltip
          content={
            <Text>
              {truncateNumber(props.yes.toString()).toString()}% votes casted
              for &quot;YES&quot;
            </Text>
          }
          trigger={
            <div className="yes bar">
              <p>{truncateNumber(props.yes.toString()).toString()}%</p>
            </div>
          }
        />

        <Tooltip
          content={
            <Text>
              {truncateNumber(props.no.toString()).toString()}% of validators
              voted no.
            </Text>
          }
          trigger={
            <div className="no bar">
              {/* <p>{truncateNumber(props.no.toString()).toString()}%</p> */}
            </div>
          }
        />
        <Tooltip
          content={
            <Text>
              {truncateNumber(props.veto.toString()).toString()}% of validators
              voted veto.
            </Text>
          }
          trigger={
            <div className="veto bar">
              {/* <p>{truncateNumber(props.veto.toString()).toString()}%</p> */}
            </div>
          }
        />
        <Tooltip
          content={
            <Text>
              {truncateNumber(props.abstain.toString()).toString()}% of
              validators voted abstain.
            </Text>
          }
          trigger={
            <div className="abstain bar">
              {/* <p>{truncateNumber(props.abstain.toString()).toString()}%</p> */}
            </div>
          }
        />
      </div>
      <div className="empty bar"></div>
      {/* <Tooltip
        content={<Text>{props.threshold + "% threshold"}</Text>}
        trigger={<div className="threshold dashed"></div>}
      />
      <Tooltip
        content={<Text>{props.vetoThreshold + "% veto threshold"}</Text>}
        trigger={<div className="vetoThreshold dashed"></div>}
      /> */}
      <Tooltip
        content={<Text>{props.quorum + "% quorum"}</Text>}
        trigger={<div className="quorum dashed"></div>}
      />
    </Styled>
  );
};
const Styled = styled.div<Props>`
  width: 100%;
  height: 50px;
  background-color: #222;
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 4px;
  padding: 4px;
  .bar {
    height: 100%;
    display: grid;
    place-items: center;
  }
  .dashed {
    border-right: 3px dotted #176155;
    position: absolute;
    left: 0;
    top: 0;
    transform: translateY(-5px);
    height: 60px;
    width: 20px;
  }
  .threshold {
    left: ${(props) => props.threshold + "%"};
  }
  .voteThreshold {
    left: ${(props) => props.vetoThreshold + "%"};
  }

  .quorum {
    left: ${(props) => props.quorum + "%"};
  }
  .yes {
    background-color: var(--primary-color);
    width: ${(props) => props.yes + "%"};
    color: black;
  }
  .no {
    background-color: #ff4646;
    width: ${(props) => props.no + "%"};
    color: black;
  }
  .veto {
    background-color: #710808;
    width: ${(props) => props.veto + "%"};
    color: black;
  }
  .abstain {
    background-color: #fbea51;
    width: ${(props) => props.abstain + "%"};
    color: black;
  }

  .votes {
    width: ${(props) => props.totalVotes + "%"};
    height: 100%;
    display: flex;
  }
  .empty {
    background-color: #111;
    width: ${(props) => 100 - props.totalVotes + "%"};
    color: black;
  }
`;
export default GBar;
