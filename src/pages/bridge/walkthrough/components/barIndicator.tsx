import styled from "@emotion/styled";

interface Props {
  total: number;
  current: number;
  stepAt: number;
}

const BarIndicator = ({ total, current, stepAt }: Props) => {
  return (
    <Styled>
      {Array.from(Array(total), (e, idx) => (
        <>
          {idx == stepAt ? <div className="circle"></div> : null}
          <div
            key={idx}
            className={idx == current ? "active bar" : "not-active bar"}
          />
        </>
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
    width: 28px;
    border-radius: 4px;
    background-color: #333;
  }

  .circle {
    height: 10px;
    width: 10px;
    border-radius: 10px;
    background-color: #444;
    transform: translateY(-2.5px);
  }
  transition: all 0.4s;
  .active {
    background-color: var(--primary-color);
    width: 36px;

    transition: all 0.4s;
  }
`;
export default BarIndicator;
