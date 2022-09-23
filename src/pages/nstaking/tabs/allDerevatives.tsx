import { ValidatorTable } from "../components/stakingTable";
import { MasterValidatorProps } from "../utils/allUserValidatorInfo";

interface AllDerevativesProps {
  validators: MasterValidatorProps[];
}
const AllDerevatives = (props: AllDerevativesProps) => {
  return (
    <ValidatorTable validators={props.validators} sortBy="validatorTotal" />
  );
};

export default AllDerevatives;
