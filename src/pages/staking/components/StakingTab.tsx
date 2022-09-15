import { DelegationResponse, Validator, UndelegationMap } from "../utils/utils";
import styled from "@emotion/styled";
import ValidatorTable from "./ValidatorTable";

const Button = styled.button`
  font-weight: 300;
  font-size: 18px;
  background-color: black;
  color: var(--primary-color);
  padding: 0.2rem 2rem;
  border: 1px solid var(--primary-color);
  margin: 1rem auto;
  display: flex;
  align-self: center;
  width: 40%;
  justify-content: center;

  &:hover {
    background-color: var(--primary-color-dark);
    color: black;
    cursor: pointer;
  }
`;

const ValidatorContainer = styled.div``;

type props = {
  setIsOpen: (v: boolean) => void;
  setValidatorModal: (v: Validator) => void;
  setViewAllDelegations: (v: boolean) => void;
  viewAllDelegations: boolean;
  delegations: DelegationResponse[];
  validators: Validator[];
  fetchNewData: () => void;
  undelegations: UndelegationMap;
};

const StakingTab = (props: props) => {
  const {
    setIsOpen,
    setValidatorModal,
    setViewAllDelegations,
    viewAllDelegations,
    delegations,
    validators,
    fetchNewData,
    undelegations,
  } = props;

  return !viewAllDelegations ? (
    <Button onClick={() => setViewAllDelegations(!viewAllDelegations)}>
      view my delegations
    </Button>
  ) : (
    <div style={{ width: "100%" }}>
      <ValidatorContainer>
        <ValidatorTable
          setIsOpen={setIsOpen}
          setValidatorModal={setValidatorModal}
          validators={validators}
          delegations={delegations}
          fetchNewData={fetchNewData}
          undelegations={undelegations}
        />
      </ValidatorContainer>
      <Button onClick={() => setViewAllDelegations(!viewAllDelegations)}>
        minimize
      </Button>
    </div>
  );
};

export default StakingTab;
