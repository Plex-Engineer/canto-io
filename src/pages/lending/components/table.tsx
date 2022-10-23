import styled from "@emotion/styled";
import { useState } from "react";

const Table = styled.table`
  border: none;
  border: var(--primary-color) solid 1px;
  box-shadow: 0px 0px 10px #94ffb241;
  margin: 5px auto;
  color: var(--primary-color);
  width: calc(100% - 10px);
  text-align: center;
  border-collapse: collapse;
  border-spacing: 0;

  thead {
    text-transform: lowercase;
    font-size: 14px;
    background-color: #06fc9a1b;
  }
  td {
    display: table-cell;
  }
  th {
    padding: 8px;
    font-weight: 400;
    line-height: 1rem;
    &:hover {
      background-color: #14392a;
      cursor: pointer;
    }
  }

  tr {
    font-size: 14px;
    font-weight: 400;
    line-height: 4rem;
    background-color: black;
    border-bottom: var(--primary-color) solid 1px;
    animation-fill-mode: forwards;
    @keyframes fader {
      from {
        border-bottom: transparent solid 1px;
      }
      to {
        border-bottom: var(--primary-color) solid 1px;
      }
    }
  }
  td:first-of-type,
  th:first-of-type {
    padding-left: 2rem;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 1rem;
    text-transform: uppercase;
  }
  th:first-of-type {
    text-transform: lowercase;
  }
  img {
    height: 30px;
    /* width: 30px; */
    /* border-radius: 50%; */
    /* border: 1px solid var(--primary-color); */
    /* background-color: #cecece; */
  }
  tbody {
    border: var(--primary-color) solid 1px;

    tr:hover {
      background-color: #14392a;
      cursor: pointer;
    }
  }
  @media (max-width: 1000px) {
    width: 800px;

    margin: 0 2rem;
  }
`;
interface Props {
  columns: string[];
  children: React.ReactNode;
  isLending: boolean;
  onColumnClicked?: (column: number) => void;
}

const LendingTable = (props: Props) => {
  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <Table>
        <thead>
          <tr>
            {props.columns.map((heading, key) => (
              <th
                key={heading + (Math.random() + 1).toString(36).substring(7)}
                onClick={() =>
                  props.onColumnClicked ? props.onColumnClicked(key) : {}
                }
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{props.children}</tbody>
      </Table>
    </div>
  );
};

export default LendingTable;
