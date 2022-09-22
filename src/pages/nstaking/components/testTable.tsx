import { BigNumber } from "ethers";
import { commify, formatEther } from "ethers/lib/utils";
import { truncateNumber } from "global/utils/utils";
import LendingTable from "pages/lending/components/table";
import { UndelegatingValidator } from "../config/interfaces";

import { MasterValidatorProps } from "../utils/allUserValidatorInfo";

interface TableProps {
  validators: MasterValidatorProps[];
  sortBy: "validatorTotal" | "userTotal";
}
export const TestTable = (props: TableProps) => {
  const sortedValidators = props.validators.sort((a, b) => {
    const value1 =
      props.sortBy === "userTotal"
        ? a.userDelegations?.balance.amount
        : a.validator.tokens;
    const value2 =
      props.sortBy === "userTotal"
        ? b.userDelegations?.balance.amount
        : b.validator.tokens;

    return BigNumber.from(value1).gt(BigNumber.from(value2)) ? -1 : 1;
  });

  if (props.validators.length) {
    return (
      <LendingTable
        isLending={false}
        columns={[
          "rank",
          "name",
          `validator total ${props.sortBy === "validatorTotal" ? "^" : ""}`,
          `my stake ${props.sortBy === "userTotal" ? "^" : ""}`,
          "undelegations",
          "commission",
          "",
        ]}
      >
        {sortedValidators.map((validator, key) => {
          return (
            <Row
              key={key}
              rank={key + 1}
              name={validator.validator.description.moniker}
              totalStake={validator.validator.tokens}
              userStake={validator.userDelegations?.balance.amount ?? "0"}
              undelegationInfo={validator.undelagatingInfo}
              commission={Number(
                validator.validator.commission.commission_rates.rate
              )}
            />
          );
        })}
      </LendingTable>
    );
  } else {
    return null;
  }
};

interface RowProps {
  rank: number;
  name: string;
  totalStake: string;
  userStake: string;
  undelegationInfo?: UndelegatingValidator;
  commission: number;
}
const Row = (props: RowProps) => {
  return (
    <tr>
      <td>{props.rank}</td>
      <td>{props.name}</td>
      <td>
        {commify(truncateNumber(formatEther(props.totalStake))) + " canto"}
      </td>
      <td>
        {commify(truncateNumber(formatEther(props.userStake))) + " canto"}
      </td>
      <td>{props.undelegationInfo?.validator_unbonding.toString()}</td>
      <td>{props.commission * 100 + "%"}</td>
    </tr>
  );
};
