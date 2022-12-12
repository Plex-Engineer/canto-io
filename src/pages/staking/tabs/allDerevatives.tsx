import { Text } from "global/packages/src";
import { CInput, CSearch } from "global/packages/src/components/atoms/Input";

import { useState } from "react";
import Select from "react-select";
import { ValidatorTable } from "../components/stakingTable";
import { MasterValidatorProps } from "../config/interfaces";
import { Selected } from "../modals/redelgationModal";

import { levenshteinDistance } from "../utils/utils";
import warningImg from "assets/warning.svg";
import styled from "@emotion/styled";
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
    <Styled
      style={{
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: searchedValidators().length == 0 ? "black" : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "2rem",
          marginTop: "1.4rem",
        }}
      >
        <Selected
          style={{
            width: "10rem",
          }}
        >
          <Select
            className="react-select-container"
            classNamePrefix="react-select"
            options={ToggleDisplayOptions}
            onChange={(val) => {
              setValidatorDisplaySwitch(val?.value);
            }}
            isSearchable={false}
            defaultValue={{
              label: "active",
              value: 1,
            }}
            placeholder="active"
          ></Select>
        </Selected>
        <CSearch
          //   type={"search"}
          style={{
            textAlign: "left",
            paddingRight: "1rem",
          }}
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          placeholder="search..."
        />
      </div>

      <div
        style={{
          height: "16px",
        }}
      />
      {searchedValidators().length == 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            marginTop: "1rem",
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={warningImg} alt="" />
          <Text size="title2" type="title">
            no validators match this search
          </Text>
        </div>
      ) : (
        <>
          <ValidatorTable
            validators={searchedValidators()}
            sortBy="validatorTotal"
            searched={userSearch}
          />
          <div
            style={{
              height: "60px",
            }}
          />
        </>
      )}
    </Styled>
  );
};

const Styled = styled.div`
  justify-content: center;
  width: 100vmax;
  max-width: 1200px;
`;

export default AllDerevatives;
