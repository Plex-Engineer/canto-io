import styled from "@emotion/styled";
import Popup from "reactjs-popup";

export const StyledPopup = styled(Popup)`
  // use your custom style for ".popup-overlay"
  &-overlay {
    background-color: #1f4a2c6e;
    backdrop-filter: blur(2px);
    z-index: 10;
  }
  &-content {
    background-color: black;
    border: 1px solid var(--primary-color);
  }
`;
