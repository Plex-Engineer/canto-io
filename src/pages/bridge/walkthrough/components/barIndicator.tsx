import styled from "@emotion/styled";

interface Props {
  total: number;
  current: number;
}

const BarIndicator = ({ total, current }: Props) => {
  return (
    <Styled>
      {Array.from(Array(total), (e, idx) => (
        <div
          key={idx}
          className={idx == current ? "active bar" : "not-active bar"}
        />
      ))}
    </Styled>
  );
};

const Styled = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  justify-content: center;
  gap: 10px;
  .bar {
    height: 4px;
    width: 34px;
    border-radius: 4px;
    background-color: #333;
  }

  .active {
    background-color: var(--primary-color);
  }
`;
export default BarIndicator;
