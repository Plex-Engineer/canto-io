import {
  DelegationResponse,
  MasterValidatorProps,
  UndelegatingValidator,
  UndelegationMap,
  Validator,
} from "../config/interfaces";

export function getAllValidatorData(
  validators: Validator[],
  delegations: DelegationResponse[],
  undelegations: UndelegationMap
): MasterValidatorProps[] {
  function find_matched_address(
    op_address: string,
    undelegations: UndelegationMap
  ) {
    const operator_address = op_address;
    return undelegations.validators?.find((o) => o.name === operator_address);
  }

  return validators.map((validator) => {
    const userDelegation = delegations.find((delegation) => {
      return (
        delegation.delegation.validator_address === validator.operator_address
      );
    });
    return {
      validator: validator,
      userDelegations: userDelegation,
      undelagatingInfo: find_matched_address(
        validator["operator_address"],
        undelegations
      ),
    };
  });
}
