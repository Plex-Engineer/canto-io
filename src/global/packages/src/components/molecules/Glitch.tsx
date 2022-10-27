import styled from "@emotion/styled";

const GlitchWrapper = styled.p`
  & {
    color: var(--primary-color);
    font-family: "IBM Plex Mono";
    font-size: 26px;
    font-weight: 300;
    margin: 0 1rem;
    position: relative;
    text-shadow: 0.05em 0 0 #00ffd5, -0.03em -0.04em 0 #1d7407,
      0.025em 0.04em 0 #8bff9f;
    animation: glitch 725ms infinite;
  }
  & span {
    position: absolute;
    top: 0;
    left: 0;
  }
  & span:first-of-type {
    animation: glitch 500ms infinite;
    clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
    transform: translate(-0.04em, -0.03em);
    opacity: 0.75;
  }
  & span:last-child {
    animation: glitch 375ms infinite;
    clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
    transform: translate(0.04em, 0.03em);
    opacity: 0.75;
  }
  @keyframes glitch {
    0% {
      text-shadow: 0.05em 0 0 #00ffd5, -0.03em -0.04em 0 #1d7407,
        0.025em 0.04em 0 #8bff9f;
    }
    15% {
      text-shadow: 0.05em 0 0 #00ffd5, -0.03em -0.04em 0 #1d7407,
        0.025em 0.04em 0 #8bff9f;
    }
    16% {
      text-shadow: -0.05em -0.025em 0 #00ffd5, 0.025em 0.035em 0 #1d7407,
        -0.05em -0.05em 0 #8bff9f;
    }
    49% {
      text-shadow: -0.05em -0.025em 0 #00ffd5, 0.025em 0.035em 0 #1d7407,
        -0.05em -0.05em 0 #8bff9f;
    }
    50% {
      text-shadow: 0.05em 0.035em 0 #00ffd5, 0.03em 0 0 #1d7407,
        0 -0.04em 0 #8bff9f;
    }
    99% {
      text-shadow: 0.05em 0.035em 0 #00ffd5, 0.03em 0 0 #1d7407,
        0 -0.04em 0 #8bff9f;
    }
    100% {
      text-shadow: -0.05em 0 0 #00ffd5, -0.025em -0.04em 0 #1d7407,
        -0.04em -0.025em 0 #8bff9f;
    }
  }
`;

type Props = {
  title: string;
};

const Glitch = ({ title }: Props) => {
  return (
    <GlitchWrapper>
      <span aria-hidden="true">{title}</span>
      {title}
      <span aria-hidden="true">{title}</span>
    </GlitchWrapper>
  );
};

export default Glitch;
