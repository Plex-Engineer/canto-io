import { useNetworkInfo } from "global/stores/networkInfo";
import { TxFeeBalanceCheck, Validator } from "../config/interfaces";
import useValidatorModalStore, {
  ValidatorModalType,
} from "../stores/validatorModalStore";
import { StakingModal } from "./stakingModal";
import close from "assets/icons/close.svg";
import { useEffect } from "react";
import { Mixpanel } from "mixpanel";
import { StyledPopup } from "global/components/Styled";
import OngoingTxModal from "global/components/modals/ongoingTxModal";
import { useTransactionStore } from "global/stores/transactionStore";

interface ModalManagerProps {
  allValidators: Validator[];
  txBalanceChecks: TxFeeBalanceCheck;
}
export const ModalManager = (props: ModalManagerProps) => {
  const validatorModals = useValidatorModalStore();
  const txStore = useTransactionStore();
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
        validatorModals.close();
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
      <div role="button" tabIndex={0} onClick={validatorModals.close}>
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
      <OngoingTxModal onClose={validatorModals.close} />

      {validatorModals.currentModal === ValidatorModalType.STAKE && (
        <StakingModal
          validator={validatorModals.activeValidator}
          allValidators={props.allValidators}
          balance={networkInfo.balance}
          account={networkInfo.account}
          txFeeCheck={props.txBalanceChecks}
          txStore={txStore}
          chainId={Number(networkInfo.chainId)}
        />
      )}
    </StyledPopup>
  );
};
