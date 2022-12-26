import styled from "@emotion/styled";
import dotImg from "assets/icons/dot.svg";

interface Props {
  total: number;
  current: number;
}
const DotsIndicator = ({ total, current }: Props) => {
  return (
    <Styled>
      {Array.from(Array(total), (e, i) => (
        <img
          key={i}
          src={dotImg}
          height={10}
          className={i == current ? "active" : "not-active"}
        />
      ))}
    </Styled>
  );
};

const Styled = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  .active {
    transition: all 0.6s;

    filter: grayscale(0%) opacity(100%);
    transform: scale(1);
  }

  .not-active {
    transition: all 0.6s;
    transform: scale(0.7);
    filter: grayscale(100%) opacity(24%);
  }
`;

export default DotsIndicator;
