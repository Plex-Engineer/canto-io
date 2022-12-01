import styled from "@emotion/styled";
import arrow from "assets/rightArrow.svg";
import { useState } from "react";
const Container = styled.table`
  & {
    border: none;
    /* border: var(--primary-color) solid 1px; */
    margin: 24px auto;
    width: 1204px;
    color: var(--primary-color);
    text-align: center;
    border-collapse: collapse;
    border-spacing: 0;
  }
  thead {
    text-transform: lowercase;
    font-size: 14px;
    border-radius: 4px;
    background-color: black;
    display: inline-table;
    width: 100%;
    /* tr {
      border-bottom: var(--primary-color) solid 1px !important;
    } */
    tr {
      font-size: 12px;
      background-color: transparent;
      margin-top: 0;
    }
    th {
      padding: 7px;
    }
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
  td,
  th {
    flex: 4;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.4rem;

    /* &:nth-of-type(1),
    :nth-of-type(5),
    :nth-of-type(6) {
      flex: 2;
    } */
  }
  tr {
    display: flex;
    justify-content: space-around;

    font-size: 16px;
    font-weight: 400;
    line-height: 90px;

    animation-fill-mode: forwards;
    background-color: black;

    margin-top: 0.5rem;
    @keyframes fader {
      from {
        border-bottom: transparent solid 1px;
      }
      to {
        border-bottom: var(--primary-color) solid 1px;
      }
    }
  }

  tbody {
    display: grid;

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
      &::after {
        content: url(${arrow});
        position: absolute;
        right: 6px;
        top: 8px;

        &:hover {
          transform: translateX(10);
        }
      }
    }
  }
  @media (max-width: 1000px) {
    width: 100%;

    th:first-of-type {
      display: none;
    }
    td:first-of-type {
      display: none;
    }

    th:last-of-type {
      display: none;
    }
    td:last-of-type {
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
    <div>
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
