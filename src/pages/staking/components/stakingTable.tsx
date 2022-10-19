import { BigNumber } from "ethers";
import { commify, formatEther } from "ethers/lib/utils";
import { truncateNumber } from "global/utils/utils";
import cantoIcon from "assets/logo.svg";
import {
  MasterValidatorProps,
  UndelegatingValidator,
} from "../config/interfaces";
import useValidatorModalStore, {
  ValidatorModalType,
} from "../stores/validatorModalStore";
// import Row from "./row";
import Table from "./table";

import FadeIn from "react-fade-in";

interface TableProps {
  validators: MasterValidatorProps[];
  sortBy: "validatorTotal" | "userTotal";
  undelegationOnly?: boolean;
}
export const ValidatorTable = (props: TableProps) => {
  const validatorModalStore = useValidatorModalStore();
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
      <Table
        columns={
          props.undelegationOnly
            ? [
                "rank",
                "name",
                `validator total ${
                  props.sortBy === "validatorTotal" ? "^" : ""
                }`,
                `my stake ${props.sortBy === "userTotal" ? "^" : ""}`,
                "undelegations",
                "commission",
              ]
            : [
                "rank",
                "name",
                `validator total ${
                  props.sortBy === "validatorTotal" ? "^" : ""
                }`,
                `my stake ${props.sortBy === "userTotal" ? "^" : ""}`,
                "commission",
              ]
        }
      >
        <FadeIn>
          {sortedValidators.map((validator, idx) => {
            return (
              <Row
                key={idx}
                rank={idx + 1}
                name={validator.validator.description.moniker}
                totalStake={validator.validator.tokens}
                userStake={validator.userDelegations?.balance.amount ?? "0"}
                undelegationInfo={validator.undelagatingInfo}
                undelegationOnly={props.undelegationOnly ?? false}
                commission={Number(
                  validator.validator.commission.commission_rates.rate
                )}
                onClick={() => {
                  validatorModalStore.setActiveValidator(validator);
                  validatorModalStore.open(ValidatorModalType.STAKE);
                }}
              />
            );
          })}
        </FadeIn>
      </Table>
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
  undelegationOnly: boolean;
  commission: number;
  onClick?: () => void;
}
const Row = (props: RowProps) => {
  return (
    <tr onClick={props.onClick}>
      <td>{props.rank}</td>
      <td>{props.name}</td>
      <td>
        {commify(truncateNumber(formatEther(props.totalStake)))}{" "}
        <img src={cantoIcon} alt="canto" height={14} />
      </td>
      <td>
        {commify(truncateNumber(formatEther(props.userStake)))}
        <img src={cantoIcon} alt="canto" height={14} />
      </td>

      <td>{props.commission * 100 + "%"}</td>
    </tr>
  );
};
