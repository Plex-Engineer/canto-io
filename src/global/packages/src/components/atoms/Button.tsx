import styled from "@emotion/styled";

const Sizes = {
  "xx-sm": 12,
  "x-sm": 16,
  sm: 18,
  md: 20,
  lg: 22,
  "x-lg": 28,
};

const Height = {
  big: 56,
  normal: 42,
  small: 32,
};

const Weight = {
  normal: 400,
  light: 300,
  bold: 500,
  "x-bold": 600,
};
interface Props {
  size?: "xx-sm" | "x-sm" | "sm" | "md" | "lg" | "x-lg";
  padding?: "xx-sm" | "x-sm" | "sm" | "md" | "lg" | "x-lg";
  weight?: "light" | "normal" | "bold" | "x-bold";
  height?: "small" | "normal" | "big";
  filled?: boolean;
}
const PrimaryButton = styled.button<Props>`
  font-size: ${({ size }) => Sizes[size ?? "x-sm"] + "px"};
  font-weight: ${({ weight }) => Weight[weight ?? "normal"]};
  background-color: var(--primary-color);
  color: var(--pitch-black-color);
  padding: ${({ padding }) => Sizes[padding ?? "xx-sm"] + "px"};
  border: 1px solid transparent;
  display: flex;
  height: ${({ height }) => Height[height ?? "normal"] + "px"};
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: ${({ filled }) => (filled ? "100%" : "fit-content")};

  &:hover {
    background-color: var(--primary-dark-color);
    cursor: pointer;
  }

  &:disabled {
    background-color: #005732;
    color: black;
  }
`;

const OutlinedButton = styled(PrimaryButton)<Props>`
  /* background-color: var(--pitch-black-color); */
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);

  &:hover {
    background-color: #172b23;
    /* background: rgba(6, 252, 153, 0.1); */
    cursor: pointer;
  }

  &:disabled {
    color: #006739;
    background-color: var(--pitch-black-color);
    border: 1px solid #006739;
  }
`;

const FilledButton = styled(PrimaryButton)<Props>`
  background-color: var(--too-dark-color);
  color: var(--off-white-color);
  &:hover {
    background-color: var(--dark-grey-color);
    color: var(--off-white-color);
    border: 1px solid var(--dark-grey-color);
  }
  &:disabled {
    background-color: var(--dark-grey-color);
    color: var(--holy-grey-color);
  }
`;
const HighlightButton = styled(FilledButton)<Props>`
  background-color: #172b23;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 1rem !important;

  &:hover {
    background-color: #203128;
    color: var(--primary-dark-color);
    border: 1px solid var(--primary-darker-color);
  }

  &:disabled {
    background-color: #373737;
    color: var(--off-white-color);
    border: 1px solid var(--off-white-color);
  }
`;

interface HybridProps {
  onClick?: () => void;
  size?: "x-sm" | "sm" | "md" | "lg" | "x-lg";
  padding?: "x-sm" | "sm" | "md" | "lg" | "x-lg";
  type: "primary" | "filled" | "highlight" | "outlined";
  children: React.ReactNode;
}
const HybirdButton = (props: HybridProps) => {
  switch (props.type) {
    case "outlined":
      return (
        <OutlinedButton
          size={props.size}
          padding={props.padding}
          onClick={props.onClick}
        >
          {props.children}
        </OutlinedButton>
      );
    case "filled":
      return (
        <FilledButton
          size={props.size}
          padding={props.padding}
          onClick={props.onClick}
        >
          {props.children}
        </FilledButton>
      );
    case "highlight":
      return (
        <HighlightButton
          size={props.size}
          padding={props.padding}
          onClick={props.onClick}
        >
          {props.children}
        </HighlightButton>
      );
    case "primary":
    default:
      return (
        <PrimaryButton
          size={props.size}
          padding={props.padding}
          onClick={props.onClick}
        >
          {props.children}
        </PrimaryButton>
      );
  }
};
export {
  PrimaryButton,
  OutlinedButton,
  FilledButton,
  HighlightButton,
  HybirdButton,
};
