import styled from "@emotion/styled";
import { useNetworkInfo } from "global/stores/networkInfo";
import Popup from "reactjs-popup";
import { Validator } from "../config/interfaces";
import useValidatorModalStore, {
  ValidatorModalType,
} from "../stores/validatorModalStore";
import { StakingModal } from "./stakingModal";
import close from "assets/close.svg";
import FadeIn from "react-fade-in";
import DelegationModal from "./delegationModal";
import RedelgationModal from "./redelgationModal";
import ChoiceModal from "./choiceModal";

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
    overflow-y: hidden;
    overflow-x: hidden;
    background-color: black;
    border-radius: 4px;
    scroll-behavior: smooth;
    animation: fadein 0.5s 1;
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
  }

  & {
    overflow-y: auto;
  }

  @media (max-width: 1000px) {
    /* &-overlay {
      width: 100%;
    } */
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
      {validatorModals.currentModal == ValidatorModalType.DELEGATE && (
        <DelegationModal
          validator={validatorModals.activeValidator}
          allValidators={props.allValidators}
          balance={networkInfo.balance}
          account={networkInfo.account}
        />
      )}
      {validatorModals.currentModal == ValidatorModalType.UNDELEGATE && (
        <DelegationModal
          undelegation
          validator={validatorModals.activeValidator}
          allValidators={props.allValidators}
          balance={networkInfo.balance}
          account={networkInfo.account}
        />
      )}
      {validatorModals.currentModal == ValidatorModalType.REDELEGATE && (
        <RedelgationModal
          validator={validatorModals.activeValidator}
          allValidators={props.allValidators}
          balance={networkInfo.balance}
          account={networkInfo.account}
        />
      )}
      {validatorModals.currentModal === ValidatorModalType.STAKE && (
        <StakingModal
          validator={validatorModals.activeValidator}
          allValidators={props.allValidators}
          balance={networkInfo.balance}
          account={networkInfo.account}
        />
        // <ChoiceModal
        //   validator={validatorModals.activeValidator}
        //   balance={networkInfo.balance}
        // />
      )}
    </StyledPopup>
  );
};
