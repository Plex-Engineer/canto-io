import styled from "@emotion/styled";
interface Props {
  yes: number;
  no: number;
  veto: number;
  abstain: number;
  quorum: number;
  threshold: number;
  vetoThreshold: number;
}

const GBar = (props: Props) => {
  return (
    <Styled {...props}>
      <div className="yes bar">
        <p>{props.yes.toFixed(2)}%</p>
      </div>
      <div className="no bar"></div>
      <div className="veto bar"></div>
      <div className="abstain bar"></div>
      <div className="threshold dashed"></div>
      <div className="vetoThreshold dashed"></div>
      <div className="quorum dashed"></div>
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
    border-radius: 4px;
    display: grid;
    place-items: center;
  }
  .dashed {
    border-right: 3px dotted #000000;
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
`;
export default GBar;
