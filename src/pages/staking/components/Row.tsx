import styled from "@emotion/styled";
import {
  Validator,
  DelegationResponse,
  formatNumber,
  validators,
  lockout,
} from "../utils/utils";
import { BigNumber } from "ethers";
import HistoryToggleOffSharpIcon from "@mui/icons-material/HistoryToggleOffSharp";
import Popover from "@mui/material/Popover";
import { Toolbar, Typography } from "@mui/material";
import React, { useState } from "react";
import moment from "moment";

type props = {
  validator: Validator;
  setIsOpen: (isOpen: boolean) => void;
  delegations: DelegationResponse[];
  setValidatorModal: (v: Validator) => void;
  fetchNewData: () => void;
  rank: number;
  undelegationInfo?: validators;
};

const Button = styled.button`
  font-weight: 300;
  font-size: 18px;
  background-color: black;
  color: var(--primary-color);
  padding: 0.2rem 2rem;
  border: 1px solid var(--primary-color);
  margin: 3rem auto;
  display: flex;
  align-self: center;

  &:hover {
    background-color: var(--primary-color-dark);
    color: black;
    cursor: pointer;
  }
`;

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function AcccessibleTable(validator?: validators) {
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
            formatNumber(validator.validator_unbonding, 18) +
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
                {formatNumber(lockout.value_of_coin, 18)}
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

function Row(props: props) {
  const {
    validator,
    setIsOpen,
    delegations,
    setValidatorModal,
    fetchNewData,
    rank,
    undelegationInfo,
  } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const name = validator.description.moniker;
  const tokens = BigNumber.from(validator.tokens);
  const commision =
    parseFloat(validator.commission.commission_rates.rate) * 100;

  // check if the user has delegate shares to this validator
  let hasDelegatedToValidator = false;
  let staked = BigNumber.from("0");
  delegations.forEach((delegation) => {
    if (delegation.delegation.validator_address == validator.operator_address) {
      hasDelegatedToValidator = true;
      staked = BigNumber.from(delegation.balance.amount);
    }
  });

  return (
    <tr>
      <td>{rank + 1}</td>
      <td>{name}</td>
      <td>{formatNumber(tokens, 18)} canto</td>
      <td>{formatNumber(staked, 18)} canto</td>
      <td>
        <HistoryToggleOffSharpIcon
          style={{ verticalAlign: "middle" }}
          aria-owns={open ? "mouse-over-popover" : undefined}
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        />
        {undelegationInfo?.lockouts ? (
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
            {AcccessibleTable(undelegationInfo)}
          </Popover>
        ) : null}
      </td>
      <td>{commision.toFixed(3)}%</td>
      <td>
        <Button
          style={{
            margin: "0",
            textAlign: "center",
          }}
          onClick={() => {
            setIsOpen(true);
            setValidatorModal(validator);
            fetchNewData();
          }}
        >
          manage
        </Button>
      </td>
    </tr>
  );
}

export default Row;
