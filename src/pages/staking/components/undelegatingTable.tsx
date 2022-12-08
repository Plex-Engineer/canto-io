import { BigNumber } from "ethers";
import { commify, formatEther } from "ethers/lib/utils";
import { truncateNumber } from "global/utils/utils";
import cantoIcon from "assets/logo.svg";
import { MasterValidatorProps } from "../config/interfaces";
import Table from "./table";
import FadeIn from "react-fade-in";
import moment from "moment";
import { useState } from "react";
import { sortColumnsByType } from "pages/lending/components/LMTables";

interface TableProps {
  validators: MasterValidatorProps[];
}
export const UndelegatingTable = (props: TableProps) => {
  const [columnClicked, setColumnClicked] = useState(2);
  const allUndelegations = [];
  for (const validator of props.validators) {
    if (validator.undelagatingInfo?.lockouts) {
      for (const undelegation of validator.undelagatingInfo?.lockouts ?? []) {
        allUndelegations.push({
          name: validator.validator.description.moniker,
          amount: undelegation.value_of_coin,
          completionDate: undelegation.complete_time_stamp,
        });
      }
    }
  }
  if (props.validators.length) {
    return (
      <Table
        columns={["name", "undelegation", "completion date"]}
        onColumnClicked={(column) => setColumnClicked(column)}
        columnClicked={columnClicked}
      >
        <FadeIn>
          {allUndelegations
            // .sort((a, b) =>
            //   new Date(a.completionDate) > new Date(b.completionDate) ? 1 : -1
            // )
            .map((undelegation, idx) => {
              return (
                <Row
                  key={idx}
                  name={undelegation.name}
                  amount={undelegation.amount}
                  completionDate={moment
                    .utc(undelegation.completionDate)
                    .local()
                    .format("L h:mma")
                    .toLowerCase()}
                  sortableProps={[
                    undelegation.name,
                    Number(formatEther(undelegation.amount)),
                  ]}
                />
              );
            })
            .sort((a, b) => {
              if (columnClicked == 2) {
                return -1;
              }
              return sortColumnsByType(
                a.props.sortableProps?.[columnClicked],
                b.props.sortableProps?.[columnClicked]
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
  name: string;
  amount: BigNumber;
  completionDate: string;
  sortableProps?: unknown[];
}
const Row = (props: RowProps) => {
  return (
    <tr>
      <td>{props.name}</td>
      <td>
        {commify(truncateNumber(formatEther(props.amount)))}{" "}
        <img src={cantoIcon} alt="canto" height={14} />
      </td>
      <td
        style={{
          display: "table-cell",
        }}
      >
        {props.completionDate}
      </td>
    </tr>
  );
};
