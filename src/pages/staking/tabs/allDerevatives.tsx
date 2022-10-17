import styled from "@emotion/styled";
import { useState } from "react";
import { ValidatorTable } from "../components/stakingTable";
import { MasterValidatorProps } from "../config/interfaces";
import { levenshteinDistance } from "../utils/utils";

interface AllDerevativesProps {
  validators: MasterValidatorProps[];
}
const AllDerevatives = (props: AllDerevativesProps) => {
  const [userSearch, setUserSearch] = useState("");
  const searchedValidators = () => {
    if (userSearch === "") {
      return props.validators;
    }
    return props.validators.filter((validator) => {
      return (
        levenshteinDistance(
          validator.validator.description.moniker.toLowerCase(),
          userSearch
        ) < 4 ||
        validator.validator.description.moniker
          .toLowerCase()
          .includes(userSearch)
      );
    });
  };

  return (
    <div>
      <InputStyle>
        <input
          className="input"
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        ></input>
      </InputStyle>
      {searchedValidators().length == 0 ? (
        "no validators match this search"
      ) : (
        <ValidatorTable
          validators={searchedValidators()}
          sortBy="validatorTotal"
        />
      )}
    </div>
  );
};
const InputStyle = styled.div`
  .input {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #333;
    padding: 1rem;
    gap: 1rem;
    background-color: black;
    border-radius: 18px;
    width: 40rem;
    display: flex;
    flex-direction: column;
    color: white;
  }
`;

export default AllDerevatives;
