import styled from "@emotion/styled";
import { useState } from "react";
import downImg from "assets/down.svg";
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
      cursor: pointer;
    }
  }

  tr {
    font-size: 14px;
    font-weight: 400;
    line-height: 4rem;
    background-color: black;
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
    border-left: 4px solid black;
    border-radius: 4px;
  }

  th:last-of-type {
    border-right: 4px solid black;
    border-radius: 4px;
  }
  img {
    height: 30px;
  }
  tbody {
    td:first-of-type {
      border-left: 4px solid var(--primary-color);
      border-radius: 4px;
      height: 90px;
    }
    td:last-of-type {
      border-right: 4px solid var(--primary-color);
      border-radius: 4px;
    }
    tr {
      height: 90px;
      border: 2px solid green;
    }
    tr:hover {
      background-color: #173428;
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
                  position: "relative",
                }}
                key={heading + (Math.random() + 1).toString(36).substring(7)}
                onClick={() => {
                  props.onColumnClicked ? props.onColumnClicked(key) : {};
                  setWasColumnClicked(true);
                }}
              >
                {heading}
                {wasColumnClicked && key == props.columnClicked ? (
                  <img
                    src={downImg}
                    width="10"
                    style={{ position: "absolute", right: "10px", top: "2px" }}
                  />
                ) : (
                  ""
                )}
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
