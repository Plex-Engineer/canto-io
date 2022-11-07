import { CInput } from "global/packages/src/components/atoms/Input";
import LendingSwitch from "pages/lending/components/lendingSwitch";
import { useState } from "react";
import Select from "react-select";
import { ValidatorTable } from "../components/stakingTable";
import { MasterValidatorProps } from "../config/interfaces";
import { Selected } from "../modals/redelgationModal";
import { levenshteinDistance } from "../utils/utils";

interface AllDerevativesProps {
  validators: MasterValidatorProps[];
}
const ToggleDisplayOptions = [
  {
    label: "active",
    value: 1,
  },
  {
    label: "inactive",
    value: 2,
  },
  {
    label: "all",
    value: 3,
  },
];
const AllDerevatives = (props: AllDerevativesProps) => {
  const [userSearch, setUserSearch] = useState("");
  const [validatorDisplaySwitch, setValidatorDisplaySwitch] = useState<
    number | undefined
  >(1);
  const searchedValidators = () => {
    const validators = props.validators.filter((validator) => {
      if (validatorDisplaySwitch == 1) {
        return !validator.validator.jailed;
      } else if (validatorDisplaySwitch == 2) {
        return validator.validator.jailed;
      }
      return true;
    });
    if (userSearch === "") {
      return validators;
    }
    return validators.filter((validator) => {
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
        <Selected
          style={{
            width: "25%",
            position: "absolute",
            left: "0",
          }}
        >
          <Select
            className="react-select-container"
            classNamePrefix="react-select"
            options={ToggleDisplayOptions}
            onChange={(val) => {
              setValidatorDisplaySwitch(val?.value);
            }}
            placeholder="active"
          ></Select>
        </Selected>
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
