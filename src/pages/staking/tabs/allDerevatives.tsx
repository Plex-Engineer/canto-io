import { Text } from "global/packages/src";
import { CInput, CSearch } from "global/packages/src/components/atoms/Input";

import { useEffect, useState } from "react";
import Select from "react-select";
import { ValidatorTable } from "../components/stakingTable";
import { MasterValidatorProps } from "../config/interfaces";
import { Selected } from "../modals/redelgationModal";

import { levenshteinDistance } from "../utils/utils";
import warningImg from "assets/warning.svg";
import styled from "@emotion/styled";
import useStakingStore from "../stores/stakingStore";
import { Mixpanel } from "mixpanel";
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
  const stakingStore = useStakingStore();

  const [loggedSearch, setLoggedSearch] = useState(false);

  const searchedValidators = () => {
    const validators = props.validators.filter((validator) => {
      if (stakingStore.validatorSort == 1) {
        return !validator.validator.jailed;
      } else if (stakingStore.validatorSort == 2) {
        return validator.validator.jailed;
      }
      return true;
    });
    if (stakingStore.searchQuery === "") {
      return validators;
    }
    return validators.filter((validator) => {
      return (
        levenshteinDistance(
          stakingStore.searchQuery,
          validator.validator.description.moniker.toLowerCase()
        ) < 6 ||
        validator.validator.description.moniker
          .toLowerCase()
          .includes(stakingStore.searchQuery)
      );
    });
  };

  useEffect(() => {
    if (!loggedSearch && stakingStore.searchQuery !== "") {
      Mixpanel.events.stakingActions.userSearch();
      setLoggedSearch(true);
    }
  }, [stakingStore.searchQuery]);

  return (
    <Styled
      style={{
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor:
          searchedValidators().length == 0 ? "black" : "transparent",
      }}
    >
      <div className="sort-search-local">
        <Selected
          style={{
            width: "18rem",
          }}
        >
          <Select
            className="react-select-container"
            styles={{
              dropdownIndicator: (baseStyles, state) => ({
                ...baseStyles,
                color: "var(--primary-color)",
              }),
            }}
            classNamePrefix="react-select"
            options={ToggleDisplayOptions}
            onChange={(val) => {
              stakingStore.setValidatorSort(val?.value ?? 1);
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
          value={stakingStore.searchQuery}
          onChange={(e) => stakingStore.setSearchQuery(e.target.value)}
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
            height: "100%",
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
            searched={stakingStore.searchQuery}
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

  .sort-search-local {
    display: none;
    justify-content: center;
    gap: 12px;
    margin-top: 1.4rem;
  }

  @media (max-width: 1000px) {
    .sort-search-local {
      display: flex;
      gap: 1rem;
      flex-direction: row-reverse;
    }
  }
`;

export default AllDerevatives;
