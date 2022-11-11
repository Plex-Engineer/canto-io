import styled from "@emotion/styled";
import arrow from "assets/rightArrow.svg";

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
    border-radius: 4px;
    border-left: 3px solid var(--primary-color);
    border-right: 3px solid var(--primary-color);
    transition: all 0.2s;
    background-color: black;
    margin-top: 1rem;
    &:hover {
      background-color: #163428;
      cursor: pointer;
      transform: scale(1.02);
    }
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
    /* width: 30px; */
    /* border-radius: 50%; */
    /* border: 1px solid var(--primary-color); */
    /* background-color: #cecece; */
  }
  tbody {
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
      style={
        {
          // overflowX: "auto",
        }
      }
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
