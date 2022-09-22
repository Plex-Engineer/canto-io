import { TestTable } from "../components/testTable";
import { MasterValidatorProps } from "../utils/allUserValidatorInfo";

interface AllDerevativesProps {
  validators: MasterValidatorProps[];
}
const AllDerevatives = (props: AllDerevativesProps) => {
  return <TestTable validators={props.validators} />;
};

export default AllDerevatives;
