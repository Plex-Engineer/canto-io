import styled from "@emotion/styled";
import { useState } from "react";

const Table = styled.table`
  border: none;
  margin: 5px auto;
  color: var(--primary-color);
  width: calc(100% - 10px);
  text-align: center;
  border-spacing: 0 1rem;
  border-collapse: separate !important;
  thead {
    text-transform: lowercase;
    font-size: 14px;
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
    margin-top: 1rem;
    transition: all 0.2s ease;

    position: relative;
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
  }
  tbody {
    tr:hover {
      background-color: #2c2c2c;
      cursor: pointer;
    }
  }
  @media (max-width: 1000px) {
    width: 100%;

    td,
    th {
      display: none;
    }

    th:last-of-type {
      display: table-cell;
    }

    td:last-of-type {
      display: table-cell;
    }
  }
`;
interface Props {
  columns: string[];
  children: React.ReactNode;
  isLending: boolean;
  onColumnClicked?: (column: number) => void;
  columnClicked?: number;
}

const LendingTable = (props: Props) => {
  const [wasColumnClicked, setWasColumnClicked] = useState(false);
  return (
    <div>
      <Table>
        <thead>
          <tr>
            {props.columns.map((heading, key) => (
              <th
                style={{
                  backgroundColor:
                    wasColumnClicked && key == props.columnClicked
                      ? "#14392a"
                      : "",
                }}
                key={heading + (Math.random() + 1).toString(36).substring(7)}
                onClick={() => {
                  props.onColumnClicked ? props.onColumnClicked(key) : {};
                  setWasColumnClicked(true);
                }}
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
