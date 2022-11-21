import styled from "@emotion/styled";
import { useNetworkInfo } from "global/stores/networkInfo";
import Popup from "reactjs-popup";
import { Validator } from "../config/interfaces";
import useValidatorModalStore, {
  ValidatorModalType,
} from "../stores/validatorModalStore";
import { StakingModal } from "./stakingModal";
import close from "assets/icons/close.svg";
import DelegationModal from "./delegationModal";
import RedelgationModal from "./redelgationModal";
import useTransactionStore from "../stores/transactionStore";

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
    border-radius: 4px;
    scroll-behavior: smooth;
    transition: all 0.2s;
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
  const transactionStore = useTransactionStore();
  const networkInfo = useNetworkInfo();

  return (
    <StyledPopup
      open={validatorModals.currentModal != ValidatorModalType.NONE}
      onClose={() =>
        validatorModals.close(() =>
          transactionStore.setTransactionStatus(undefined)
        )
      }
      lockScroll
      modal
      position="center center"
      nested
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() =>
          validatorModals.close(() =>
            transactionStore.setTransactionStatus(undefined)
          )
        }
      >
        <img
          src={close}
          style={{
            position: "absolute",
            top: "1.3rem",
            right: "1.4rem",
            width: "30px",
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
          onClose={() =>
            validatorModals.close(() =>
              transactionStore.setTransactionStatus(undefined)
            )
          }
        />
        // <ChoiceModal
        //   validator={validatorModals.activeValidator}
        //   balance={networkInfo.balance}
        // />
      )}
    </StyledPopup>
  );
};
