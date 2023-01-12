import { useState } from "react";
import styled from "@emotion/styled";
import { ProposalData, VotingOption } from "../config/interfaces";
import { PrimaryButton } from "global/packages/src";

const Container = styled.div`
  background-color: #040404;
  height: 80vh;
  width: 26rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding: 1rem;
  overflow-y: scroll;
  .btn {
    margin-top: 1rem;
  }
  h2 {
    font-style: normal;
    font-weight: 300;
    font-size: 22px;
    line-height: 130%;
    text-align: center;
    letter-spacing: -0.3px;
    text-transform: lowercase;
    color: #efefef;
    margin-bottom: 2rem;
    margin-top: 0.3rem;
  }

  .selected {
    background: rgba(6, 252, 153, 0.15);
    border-radius: 1px;
    color: var(--primary-color);
  }

  .voteForm {
    border: 1px solid #222;
    padding: 1rem;
    width: 100%;
    div {
      padding: 2rem;
      width: 100%;
    }
  }
`;

interface Props {
  proposal: ProposalData;
  currentVote: VotingOption;
  onVote: (voteOption: VotingOption) => void;
}
const GovModal = ({ proposal, currentVote, onVote }: Props) => {
  const [option, setOption] = useState(currentVote ?? VotingOption.NONE);
  const handleChange = (value: VotingOption) => {
    setOption(value);
  };

  return (
    <Container>
      <p
        style={{
          marginTop: "2rem",
          color: "#999",
        }}
      >
        your vote for #{proposal.proposal_id}
      </p>
      <h2
        style={{
          marginBottom: ".3rem",
        }}
      >
        {proposal.content.title}
      </h2>
      <h2
        style={{
          fontSize: "14px",
          color: "#999",
        }}
      >
        {proposal.content.description}
      </h2>

      <GovRadioButton
        selected={option === VotingOption.YES}
        voteOption={VotingOption.YES}
        name="yes"
        onChange={handleChange}
      />
      <GovRadioButton
        selected={option === VotingOption.NO}
        voteOption={VotingOption.NO}
        name="no"
        onChange={handleChange}
      />
      <GovRadioButton
        selected={option === VotingOption.VETO}
        voteOption={VotingOption.VETO}
        name="veto"
        onChange={handleChange}
      />
      <GovRadioButton
        selected={option === VotingOption.ABSTAIN}
        voteOption={VotingOption.ABSTAIN}
        name="abstain"
        onChange={handleChange}
      />

      <PrimaryButton className="btn" onClick={() => onVote(option)}>
        vote
      </PrimaryButton>
    </Container>
  );
};
interface radioProps {
  name: string;
  voteOption: VotingOption;
  selected: boolean;
  onChange: (value: VotingOption) => void;
}

const GovRadioStyle = styled.div`
  padding: 2rem;
  border: 1px solid transparent;
  width: 100%;
  cursor: pointer;
  display: flex;
  transition: all 0.4s;
  color: white;
  border: 1px solid #222;
  /* margin-top: -1px; */

  &:hover,
  &.active {
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    background-color: #06fc9a1d;
    .unchecked {
      border: 1px solid var(--primary-color);
    }
  }

  .unchecked {
    border: 1px solid white;
    height: 20px;
    width: 20px;
    border-radius: 50%;
  }

  .checked {
    margin: 4px;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    transition: background-color 0.4s;
    background-color: var(--primary-color);
  }
`;
const GovRadioButton = (props: radioProps) => {
  return (
    <GovRadioStyle
      className={props.selected ? "active" : ""}
      onClick={() => {
        props.onChange(props.voteOption);
      }}
    >
      {
        <div className="unchecked">
          <div className={props.selected ? "checked" : ""}></div>
        </div>
      }
      <p
        style={{
          marginLeft: "1rem",
        }}
      >
        {props.name}
      </p>
    </GovRadioStyle>
  );
};

export default GovModal;
