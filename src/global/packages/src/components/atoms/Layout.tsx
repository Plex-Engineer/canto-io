import styled from "@emotion/styled";

const Sizes = {
  "x-sm": 16,
  sm: 18,
  md: 20,
  lg: 22,
  "x-lg": 28,
};
interface Props {
  size?: "x-sm" | "sm" | "md" | "lg" | "x-lg";
  padding?: "x-sm" | "sm" | "md" | "lg" | "x-lg";
}
const Row = styled.div<Props>`
  display: flex;
`;

const Column = styled.div<Props>`
  display: flex;
  flex-direction: column;
`;

const Center = styled.div<Props>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
`;

const VSpace = styled.div<Props>`
  height: 20;
`;
export { Row, Column, Center };
