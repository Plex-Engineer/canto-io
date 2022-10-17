import styled from "@emotion/styled";
import { formatEther } from "ethers/lib/utils";
import { Text } from "global/packages/src";
import moment from "moment";

import { lockout, UndelegatingValidator } from "../config/interfaces";

const HoverTable = (validator?: UndelegatingValidator) => {
  return validator ? (
    <Styled>
      <p>
        {"total undelegated : " +
          formatEther(validator.validator_unbonding) +
          " canto"}
      </p>
      <table>
        <thead>
          <tr>
            <th>completion date</th>
            <th align="right">canto</th>
          </tr>
        </thead>
        <tbody>
          {validator.lockouts?.map((lockout: lockout) => (
            <tr key={lockout.complete_time_stamp}>
              <td>
                {moment
                  .utc(lockout.complete_time_stamp)
                  .local()
                  .format("MMMM Do YYYY")
                  .toLowerCase()}
              </td>
              <td align="center">{formatEther(lockout.value_of_coin)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Styled>
  ) : null;
};

const Styled = styled.div`
  background-color: black;
  border: 1px solid var(--primary-color);
  padding: 1rem;
  font-size: 16px;
  p {
    color: var(--primary-color);
  }
  table {
    color: white;
    text-align: left;
    width: 100%;

    th {
      font-weight: 400;
    }
  }
`;
export default HoverTable;
