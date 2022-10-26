import { CInput } from "global/packages/src/components/atoms/Input";
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
      <CInput
        value={userSearch}
        onChange={(e) => setUserSearch(e.target.value)}
        placeholder="search validators..."
      />
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

export default AllDerevatives;
