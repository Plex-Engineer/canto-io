import styled from "@emotion/styled";
import { useNetworkInfo } from "global/stores/networkInfo";
import Popup from "reactjs-popup";
import { Validator } from "../config/interfaces";
import useValidatorModalStore, {
  ValidatorModalType,
} from "../stores/validatorModalStore";
import { StakingModal } from "./stakingModal";
import close from "assets/close.svg";

const StyledPopup = styled(Popup)`
  // use your custom style for ".popup-overlay"
  &-overlay {
    background-color: #1f4a2c6e;
    backdrop-filter: blur(2px);
    z-index: 10;
  }
  // use your custom style for ".popup-content"
  &-content {
    /* height: 400px; */
    position: relative;
    overflow-y: hidden;
    overflow-x: hidden;
    background-color: black;
    border: 1px solid var(--primary-color);
    scroll-behavior: smooth;
    /* width */
  }

  & {
    overflow-y: auto;
  }
`;
interface ModalManagerProps {
  allValidators: Validator[];
}
export const ModalManager = (props: ModalManagerProps) => {
  const validatorModals = useValidatorModalStore();
  const networkInfo = useNetworkInfo();

  return (
    <StyledPopup
      open={validatorModals.currentModal != ValidatorModalType.NONE}
      onClose={validatorModals.close}
      lockScroll
      modal
      position="center center"
      nested
    >
      <div role="button" tabIndex={0} onClick={validatorModals.close}>
        <img
          src={close}
          style={{
            position: "absolute",
            top: ".5rem",
            right: ".5rem",
            width: "40px",
            cursor: "pointer",
            zIndex: "3",
          }}
          alt="close"
        />
      </div>
      {validatorModals.currentModal === ValidatorModalType.STAKE && (
        <StakingModal
          validator={validatorModals.activeValidator}
          allValidators={props.allValidators}
          balance={networkInfo.balance}
          account={networkInfo.account}
        />
      )}
    </StyledPopup>
  );
};
