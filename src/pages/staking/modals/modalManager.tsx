import { useNetworkInfo } from "global/stores/networkInfo";
import { TxFeeBalanceCheck, Validator } from "../config/interfaces";
import useValidatorModalStore, {
  ValidatorModalType,
} from "../stores/validatorModalStore";
import { StakingModal } from "./stakingModal";
import close from "assets/icons/close.svg";
import DelegationModal from "./delegationModal";
import RedelgationModal from "./redelgationModal";
import useTransactionStore from "../stores/transactionStore";
import { useEffect } from "react";
import { Mixpanel } from "mixpanel";
import { StyledPopup } from "global/components/Styled";

interface ModalManagerProps {
  allValidators: Validator[];
  txBalanceChecks: TxFeeBalanceCheck;
}
export const ModalManager = (props: ModalManagerProps) => {
  const validatorModals = useValidatorModalStore();
  const transactionStore = useTransactionStore();
  const networkInfo = useNetworkInfo();

  useEffect(() => {
    if (validatorModals.currentModal != ValidatorModalType.NONE) {
      Mixpanel.events.stakingActions.modalInteraction(
        validatorModals.activeValidator.validator.description.moniker,
        true
      );
    }
  }, [validatorModals.currentModal]);

  return (
    <StyledPopup
      open={validatorModals.currentModal != ValidatorModalType.NONE}
      onClose={() => {
        validatorModals.close(() =>
          transactionStore.setTransactionStatus(undefined)
        );
        Mixpanel.events.stakingActions.modalInteraction(
          validatorModals.activeValidator.validator.description.moniker,
          false
        );
      }}
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
            top: ".5rem",
            right: ".5rem",
            cursor: "pointer",
            zIndex: "3",
            padding: ".5rem",
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
          txFeeCheck={props.txBalanceChecks}
          onClose={() =>
            validatorModals.close(() =>
              transactionStore.setTransactionStatus(undefined)
            )
          }
        />
      )}
    </StyledPopup>
  );
};
