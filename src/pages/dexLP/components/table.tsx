import styled from "@emotion/styled";
import { useState } from "react";

const Container = styled.table`
  border: none;
  margin: 5px auto;
  width: 1200px;
  color: var(--primary-color);
  text-align: center;
  border-collapse: collapse;
  border-spacing: 0;
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

      &:hover {
        background-color: #09291c;
        cursor: pointer;
        transform: scale(1.02);
      }
      position: relative;
    }
  }
  @media (max-width: 1000px) {
    width: 100%;
    padding: 0 1rem;

    th:nth-of-type(3) {
      display: none;
    }
    td:nth-of-type(3) {
      display: none;
    }

    th:nth-of-type(4) {
      display: none;
    }
    td:nth-of-type(4) {
      display: none;
    }
  }
`;
type Props = {
  children: React.ReactNode;
  columns: string[];
  onColumnClicked?: (column: number) => void;
  columnClicked?: number;
};

const Table: React.FC<Props> = (props: Props) => {
  const [wasColumnClicked, setWasColumnClicked] = useState(false);

  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <Container>
        <thead>
          <tr>
            {props.columns.map((item, key) => (
              <th
                key={item}
                style={{
                  backgroundColor:
                    wasColumnClicked && key == props.columnClicked
                      ? "#14392a"
                      : "",
                }}
                onClick={() => {
                  props.onColumnClicked ? props.onColumnClicked(key) : {};
                  setWasColumnClicked(true);
                }}
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{props.children}</tbody>
      </Container>
    </div>
  );
};

export default Table;
