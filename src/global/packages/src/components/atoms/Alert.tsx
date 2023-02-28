import { useAlert } from "../../stores/index";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";

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
  overflow-x: visible;
  overflow-y: visible;

  z-index: 10;
  position: absolute;

  p {
    width: 100%;
    font-size: 14px;
    text-align: center;
  }
  padding: ${({ open }) => (open ? "1rem 2rem" : "0rem")};
  height: min-content;
  position: ${({ floating }) => (floating ? "absolute" : "relative")};
  left: 50%;
  top: ${({ open, floating }) =>
    open && floating ? "1rem" : !open && floating ? "-6rem" : "0rem"};
  border-radius: ${({ floating }) => (floating ? "4px" : "0")};

  transform: translateX(-50%);
  border: 1px solid ${({ type }) => ColorMapping[type]};
  border: ${({ floating }) => (floating ? "" : "none")};
  border-bottom: 1px solid ${({ type }) => ColorMapping[type]};
  background-color: ${({ type }) => BGMapping[type]};
  color: ${({ type, open }) => (open ? ColorMapping[type] : "transparent")};

  /* ${({ open }) => (open ? "color : transparent; !important" : "")}; */

  .close-btn {
    position: absolute;

    height: 30px;
    width: 30px;
    top: -10px;
    right: -10px;
    display: flex;
    justify-content: center;
    cursor: pointer;
    border-radius: 40px;
    border: 1px solid ${({ type }) => ColorMapping[type]};

    border: ${({ floating }) => (floating ? "" : "none")};
    border-bottom: 1px solid ${({ type }) => ColorMapping[type]};
    background-color: ${({ type, floating }) =>
      floating ? BGFMapping[type] : BGMapping[type]};
    color: ${({ type }) => ColorMapping[type]};
  }
  @media (max-width: 1000px) {
    padding: 1rem;
    width: calc(100% - 4rem);
    margin: 10px 0;
  }
`;

const Alert = () => {
  const { type, open, child, floating } = useAlert();
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);
  return (
    <>
      <Container type={type} open={open ? isOpen : false} floating={floating}>
        <div
          role={"button"}
          tabIndex={-1}
          className="close-btn"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          x
        </div>
        {child}
      </Container>
    </>
  );
};

export default Alert;
