import styled from "@emotion/styled";
import { ReactNode } from "react";
import Popup from "reactjs-popup";
import close from "assets/icons/close.svg";
import { Text } from "../atoms/Text";

interface Props {
  title?: string;
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
}
const Modal = (props: Props) => {
  return (
    <StyledPopup
      open={props.open}
      onClose={props.onClose}
      lockScroll
      modal
      position="center center"
      nested
    >
      <div role="button" tabIndex={0} onClick={props.onClose}>
        {" "}
        <img
          src={close}
          style={{
            position: "absolute",
            top: ".7rem",
            right: ".7rem",
            cursor: "pointer",
            zIndex: "3",
            padding: ".5rem",
          }}
          alt="close"
        />
      </div>
      {props.title ? (
        <div className="modal-title">
          <Text type="title" size="title2">
            {props.title}
          </Text>
        </div>
      ) : null}
      <div className="scrollview">{props.children}</div>
    </StyledPopup>
  );
};

const StyledPopup = styled(Popup)`
  // use your custom style for ".popup-overlay"
  &-overlay {
    background-color: #1f4a2c6e;
    backdrop-filter: blur(2px);
    z-index: 10;
    animation: fadein 0.2s;
    @keyframes fadein {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }
  }

  // use your custom style for ".popup-content"
  &-content {
    position: relative;
    background-color: black;
    scroll-behavior: smooth;
    border-radius: 4px;
    animation: fadein 0.5s 1;
    min-height: 42rem;
    /* max-height: 45rem; */
    overflow-y: hidden;
    @keyframes fadein {
      0% {
        opacity: 0;
        transform: translateY(10px);
      }
      50% {
        opacity: 1;
      }
      100% {
        transform: translateY(0px);
      }
    }

    .scrollview {
      max-height: 43rem;
      overflow-y: auto;
      margin-bottom: 1rem;
      height: 100%;
    }
    .modal-title {
      width: 90%;
      border-bottom: 1px solid #222;
      margin: 0 auto;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      min-height: 60px;
    }
    /* width */
  }

  & {
    overflow-y: auto;
  }
`;
export default Modal;
