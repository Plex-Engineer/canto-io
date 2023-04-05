import styled from "@emotion/styled";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
  columns: string[];
  onColumnClicked?: (column: number) => void;
  columnClicked?: number;
};

const Table = (props: Props) => {
  const [wasColumnClicked, setWasColumnClicked] = useState(false);

  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <Styled>
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
      </Styled>
    </div>
  );
};

const Styled = styled.table`
  margin: 5px auto;
  max-width: 1200px;
  width: 100%;
  color: var(--primary-color);
  text-align: center;
  border-spacing: 0 1rem;
  border-collapse: separate;

  thead {
    text-transform: lowercase;
    font-size: 14px;
  }

  th {
    text-transform: lowercase;
    padding: 8px;
    font-weight: 400;
    &:hover {
      cursor: pointer;
    }
  }

  tr {
    font-size: 14px;
    transition: all 0.2s ease;
    position: relative;
    z-index: 1;

    &::after {
      background-color: black;
      content: " ";
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      border-radius: 4px;
      left: 0;
      z-index: -1;
    }
  }

  td:first-of-type,
  th:first-of-type {
    padding-left: 2rem;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  img {
    height: 30px;
  }

  tbody {
    tr {
      &::after {
        border-left: 4px solid var(--primary-color);
        border-right: 4px solid var(--primary-color);
      }
      &:hover {
        cursor: pointer;
        transform: scale(1.02);
      }

      &:hover::after {
        background-color: #09291c;
      }
    }

    td {
      height: 90px;
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
export default Table;
