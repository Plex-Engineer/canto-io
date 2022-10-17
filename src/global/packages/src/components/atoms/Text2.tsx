import styled from "@emotion/styled";

interface Props {
  type: "title" | "text";
  color?: "white" | "primary";
  align?: "left" | "center" | "right";
  size: "text1" | "text2" | "text3" | "text4" | "title1" | "title2" | "title1";
}

const Mapper = {
  white: "white",
  primary: "var(--primary-color)",
  size: {
    title1: 44,
    title2: 26,
    title3: 19,
    text1: 18,
    text2: 16,
    text3: 14,
    text4: 12,
  },
};

export const Text2 = styled.p<Props>`
  color: ${({ color }) => Mapper[color ?? "primary"]};
  letter-spacing: ${({ type }) => (type == "title" ? "-8%" : "-3%")};
  font-family: ${({ type }) =>
    type == "title" ? "Silkscreen" : "IBM Plex Mono"};
  line-height: 140%;
  font-size: ${({ size }) => Mapper.size[size] + "px"};
  text-align: ${({ align }) => align ?? "center"};
`;
