import { useAlert } from "../../stores/index";
import styled from "@emotion/styled";

const ColorMapping = {
  Success: "var(--primary-color)",
  Failure: "#ff4141",
  Warning: "#ffda58",
  None: "transparent",
};

const BGMapping = {
  Success: "#09271b",
  Failure: "#1d0a0a",
  Warning: "#2a230b",
  None: "transparent",
};

const BGFMapping = {
  Success: "#0A2D21",
  Failure: "#3a1b1b",
  Warning: "#2A2913",
  None: "transparent",
};
interface Props {
  open: boolean;
  floating: boolean;
  type: "None" | "Success" | "Failure" | "Warning";
}
const Container = styled.div<Props>`
  transition: all 0.3s;
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  z-index: 10;

  p {
    width: 100%;
    font-size: 14px;
    text-align: center;
  }
  padding: ${({ open }) => (open ? "1rem 2rem" : "0rem")};
  height: ${({ open, floating }) =>
    open ? "min-content" : floating ? "min-content" : "0rem"};
  position: ${({ floating }) => (floating ? "absolute" : "relative")};
  left: 50%;
  top: ${({ open, floating }) => (open && floating ? "1rem" : "0rem")};
  border-radius: ${({ floating }) => (floating ? "4px" : "0")};

  transform: translateX(-50%);
  border: 1px solid ${({ type }) => ColorMapping[type]};
  border: ${({ floating }) => (floating ? "" : "none")};
  border-bottom: 1px solid ${({ type }) => ColorMapping[type]};
  background-color: ${({ type, floating }) =>
    floating ? BGFMapping[type] : BGMapping[type]};
  color: ${({ type }) => ColorMapping[type]};
`;

const Alert = () => {
  const { type, open, child, floating } = useAlert();
  return (
    <Container type={type} open={open} floating={floating}>
      {child}
    </Container>
  );
};

export default Alert;
