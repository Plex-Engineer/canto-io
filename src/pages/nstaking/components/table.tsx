import styled from "@emotion/styled";
import arrow from "assets/rightArrow.svg";
const Container = styled.table`
  & {
    border: none;
    /* border: var(--primary-color) solid 1px; */
    margin: 5px auto;
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

    /* tr {
      border-bottom: var(--primary-color) solid 1px !important;
    } */
  }
  th {
    padding: 8px;
    font-weight: 400;
    line-height: 1rem;
    flex: 1;
  }
  td {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.4rem;
  }
  tr {
    display: flex;
    justify-content: space-around;

    font-size: 14px;
    font-weight: 400;
    line-height: 4rem;

    animation-fill-mode: forwards;
    background-color: black;
    margin-top: 1rem;
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
    /* border: var(--primary-color) solid 1px; */
    tr {
      border-radius: 4px;
      border-left: 3px solid var(--primary-color);
      border-right: 3px solid var(--primary-color);
      transition: all 0.2s;
      &:hover {
        background-color: #163428;
        cursor: pointer;
      }
      position: relative;
      &::after {
        content: url(${arrow});
        position: absolute;
        right: 6px;
        top: 10px;

        &:hover {
          transform: translateX(10);
          background-color: red;
        }
      }
    }
  }
  @media (max-width: 1000px) {
    width: 800px;
    margin: 0 2rem;
  }
`;
type Props = {
  children: React.ReactNode;
  columns: string[];
};

const Table: React.FC<Props> = (props: Props) => {
  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <Container>
        <thead>
          <tr>
            {props.columns.map((item) => (
              <th key={item}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>{props.children}</tbody>
      </Container>
    </div>
  );
};

export default Table;
