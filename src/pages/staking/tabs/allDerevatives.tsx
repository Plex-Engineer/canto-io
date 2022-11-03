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
          userSearch,
          validator.validator.description.moniker.toLowerCase()
        ) < 6 ||
        validator.validator.description.moniker
          .toLowerCase()
          .includes(userSearch)
      );
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          marginTop: "1.4rem",
        }}
      >
        <CInput
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          placeholder="search validators..."
        />
      </div>
      {searchedValidators().length == 0 ? (
        "no validators match this search"
      ) : (
        <ValidatorTable
          validators={searchedValidators()}
          sortBy="validatorTotal"
          searched={userSearch}
        />
      )}
    </div>
  );
};

export default AllDerevatives;
