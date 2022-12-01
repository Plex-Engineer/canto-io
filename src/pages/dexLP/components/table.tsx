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
    border-radius: 4px;
    font-size: 14px;
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
  }

  tbody {
    tr {
      border-radius: 4px;
      border-left: 3px solid var(--primary-color);
      border-right: 3px solid var(--primary-color);
      transition: all 0.2s;

      &:hover {
        background-color: #163428;
        cursor: pointer;
        transform: scale(1.02);
      }
      position: relative;
    }
    tr:hover {
      background-color: #09291c;
      cursor: pointer;
    }
  }
  @media (max-width: 1000px) {
    width: 100%;
    padding: 0 1rem;
    /* td,
    th {
      display: none;
    } */

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
