import { BigNumber } from "ethers";
import { commify, formatEther } from "ethers/lib/utils";
import { truncateNumber } from "global/utils/utils";
import HistoryToggleOffSharpIcon from "@mui/icons-material/HistoryToggleOffSharp";
import Popover from "@mui/material/Popover";

import {
  lockout,
  MasterValidatorProps,
  UndelegatingValidator,
} from "../config/interfaces";
import useValidatorModalStore, {
  ValidatorModalType,
} from "../stores/validatorModalStore";
import React from "react";
import Row from "./row";
import Table from "./table";

interface TableProps {
  validators: MasterValidatorProps[];
  sortBy: "validatorTotal" | "userTotal";
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
        columns={[
          "rank",
          "name",
          `validator total ${props.sortBy === "validatorTotal" ? "^" : ""}`,
          `my stake ${props.sortBy === "userTotal" ? "^" : ""}`,
          //   "undelegations",
          "commission",
          "",
        ]}
      >
        {sortedValidators.map((validator, idx) => {
          return (
            <Row
              key={idx}
              rank={idx + 1}
              name={validator.validator.description.moniker}
              totalStake={validator.validator.tokens}
              userStake={validator.userDelegations?.balance.amount ?? "0"}
              undelegationInfo={validator.undelagatingInfo}
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
  commission: number;
  onClick?: () => void;
}
const Row = (props: RowProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  return (
    <tr onClick={props.onClick}>
      <td>{props.rank}</td>
      <td>{props.name}</td>
      <td>
        {commify(truncateNumber(formatEther(props.totalStake))) + " canto"}
      </td>
      <td>
        {commify(truncateNumber(formatEther(props.userStake))) + " canto"}
      </td>
      <td>
        <HistoryToggleOffSharpIcon
          style={{ verticalAlign: "middle" }}
          aria-owns={open ? "mouse-over-popover" : undefined}
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        />
        {props.undelegationInfo?.lockouts ? (
          <Popover
            id="mouse-over-popover"
            sx={{
              pointerEvents: "none",
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            {AcccessibleTable(props.undelegationInfo)}
          </Popover>
        ) : null}
      </td>
      <td>{props.commission * 100 + "%"}</td>
    </tr>
  );
};

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Toolbar, Typography } from "@mui/material";
import moment from "moment";
function AcccessibleTable(validator?: UndelegatingValidator) {
  // const styles: React.CSSProperties = {
  //     fontWeight: 300,
  //     fontSize: 18,
  //     backgroundColor: black,
  //     color: var(--primary-color),
  //     border: 1px solid var(--primary-color),
  //     // margin: 3rem auto,
  //     // display: flex,
  //     // align-self: center,
  // };
  const textColor: React.CSSProperties = {
    color: "#06fc99",
  };

  const matrixBackground: React.CSSProperties = {
    borderColor: "#06fc99",
    borderWidth: 1,
    border: "solid",
    backgroundImage: `repeating-linear-gradient(
              0deg,
              #010000 0%,
              #010000 4px,
              #021911 4px,
              #021911 8px
            )`,
    color: "#06fc99",
  };

  return validator ? (
    <TableContainer component={Paper} style={matrixBackground}>
      <Toolbar>
        <Typography>
          {"undelegated total: " +
            formatEther(validator.validator_unbonding) +
            " canto"}
        </Typography>
      </Toolbar>
      <Table sx={{ minWidth: 450 }} aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell style={textColor}>
              undelegation completion date
            </TableCell>
            <TableCell style={textColor} align="right">
              canto
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {validator.lockouts?.map((lockout: lockout) => (
            <TableRow key={lockout.complete_time_stamp}>
              <TableCell style={textColor} component="th" scope="row">
                {moment
                  .utc(lockout.complete_time_stamp)
                  .local()
                  .format("LLLL")
                  .toLowerCase()}
              </TableCell>
              <TableCell style={textColor} align="right">
                {formatEther(lockout.value_of_coin)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <></>
  );
}
