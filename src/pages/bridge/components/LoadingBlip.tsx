import styled from "@emotion/styled";

interface Props {
  active?: boolean;
  height?: number;
  gap?: number;
  speed?: number;
}

const LoadingBlip = (props: Props) => {
  return (
    <Styled {...props}>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </Styled>
  );
};

const Styled = styled.div<Props>`
  display: flex;
  gap: 6px;
  justify-content: center;
  align-items: center;

  .bar {
    height: 4px;
    width: 4px;
    background-color: ${(props) =>
      props.active ? "var(--primary-color)" : "var(--just-grey-color)"};
    ${({ active }) => (active ? "animation: example 3s;" : "")}

    animation-iteration-count: infinite;

    &:nth-child(1) {
      animation-delay: 0s;
    }
    &:nth-child(2) {
      animation-delay: 0.3s;
    }
    &:nth-child(3) {
      animation-delay: 0.6s;
    }
    &:nth-child(4) {
      animation-delay: 0.9s;
    }
    &:nth-child(5) {
      animation-delay: 1.2s;
    }
    &:nth-child(6) {
      animation-delay: 1.5s;
    }
    &:nth-child(7) {
      animation-delay: 1.8s;
    }
    &:nth-child(8) {
      animation-delay: 2.1s;
    }
  }

  @keyframes example {
    0% {
      height: 4px;
    }
    15% {
      height: 18px;
    }
    30% {
      height: 4px;
    }
  }
`;

export default LoadingBlip;
