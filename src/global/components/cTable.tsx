import styled from "@emotion/styled";
import { Text } from "global/packages/src";

interface Props {
  title?: string;
  headers: string[];
  items: React.ReactNode[][];
}

const CTable = ({ title, headers, items }: Props) => {
  return (
    <Styled>
      {title && (
        <Text type="title" align="left" className="tableName">
          {title}
        </Text>
      )}
      <div className="table">
        <div className="row header">
          {headers.map((heading) => (
            <div className="cell" key={heading}>
              {heading}
            </div>
          ))}
        </div>
        {items.map((row, idx) => (
          <div className="row" key={idx}>
            {row.map((cell, idx) => (
              <div className="cell" key={idx} data-title={headers[idx]}>
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Styled>
  );
};

const Styled = styled.div`
  margin: 4rem;

  .table {
    display: grid;
    width: 100%;
    background-color: white;
    grid-template-columns: 1fr;
  }

  .header {
    border-radius: 16px;
    .cell {
      background: #eee;
      border: none;
      border-bottom: 1px solid #ddd;
    }
  }
  .row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    transition: all 0.3s;
    &:hover {
      background-color: #eee;
      cursor: pointer;
    }
  }

  .cell {
    display: table-cell;
    color: black;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ddd;
  }

  @media (max-width: 1000px) {
    margin: 1rem;
    .row {
      grid-template-columns: 1fr 1fr 0.5fr 0.5fr 1fr;
      grid-template-rows: 1fr 1fr;
    }
    .cell {
      &:nth-of-type(3) {
        background: red;
      }
      &:nth-of-type(4) {
        background: red;
      }
    }
  }
`;
export default CTable;
