import { useState } from "react";
import styled from "@emotion/styled";
import { ProposalData, VotingOption } from "../config/interfaces";
import { PrimaryButton, Text } from "global/packages/src";
import ImageButton from "global/components/ImageButton";
import closeIcon from "assets/icons/close.svg";

const Container = styled.div`
  background-color: #040404;
  height: min-content;
  width: 26rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem 2rem 2rem;
  overflow-y: auto;
  gap: 1rem;

  .close {
    position: absolute;
    right: 20px;
    top: 20px;
  }

  .grp {
    display: flex;
    flex-direction: column;
    width: 100%;
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

  @media (max-width: 1000px) {
    height: 100vh;
    width: 100%;
  }
`;

interface Props {
  proposal: ProposalData;
  currentVote: VotingOption;
  onVote: (voteOption: VotingOption) => void;
  onClose: () => void;
}
const GovModal = ({ proposal, currentVote, onVote, onClose }: Props) => {
  const [option, setOption] = useState(currentVote ?? VotingOption.NONE);
  const handleChange = (value: VotingOption) => {
    setOption(value);
  };

  return (
    <Container>
      <div className="close">
        <ImageButton
          src={closeIcon}
          alt="close"
          height={30}
          onClick={onClose}
        />
      </div>
      <Text type="title" size="title3">
        your vote for #{proposal.proposal_id}
      </Text>
      <Text color="white">{proposal.content.title}</Text>

      <div className="grp">
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
      </div>

      <PrimaryButton
        style={{
          marginTop: "1rem",
        }}
        onClick={() => onVote(option)}
        filled
      >
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

  &:hover {
    border: 1px solid #06fc9aac;
    color: #06fc9aac;
    background-color: #06fc9a2;
    .unchecked {
      border: 1px solid #06fc9aac;
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
