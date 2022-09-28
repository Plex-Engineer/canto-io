import { useEffect } from "react";
import { useTokenStore } from "../stores/tokens";
import loading from "assets/loading.svg";
import { PrimaryButton } from "cantoui";
import {
  getTransactionStatusString,
  transactionStatusActions,
} from "global/utils/utils";
import { NativeGTokens } from "../hooks/useCosmosTokens";

interface RBProps {
  amount: string;
  account: string | undefined;
  token: NativeGTokens | undefined;
  destination: string | undefined;
  gravityAddress: string | undefined;
  onClick: () => void;
  disabled: boolean;
}
export const ReactiveButton = ({
  amount,
  token,
  onClick,
  disabled,
}: RBProps) => {
  const [approveStatus, cosmosStatus] = useTokenStore((state) => [
    state.approveStatus,
    state.cosmosStatus,
  ]);
  useEffect(() => {
    if (approveStatus == "Success") {
      setTimeout(() => {
        // resetApprove();
      }, 1000);
    }
  }, [approveStatus]);
  if (token == undefined) {
    return <PrimaryButton>Loading</PrimaryButton>;
  }

  //? refactor this into a single component
  //if the token hasn't been approved
  if (token?.allowance == -1) {
    return <PrimaryButton disabled>select a token</PrimaryButton>;
  }
  //if the amount enter is greater than balance available in the wallet && the token has been approved
  if (Number(amount) > Number(token.balanceOf) && token.allowance != 0) {
    return <PrimaryButton disabled>insufficient funds</PrimaryButton>;
  }

  //if amount entered is greater than allowance approved for the token
  if (Number(amount) <= 0 && token.allowance != 0) {
    return <PrimaryButton disabled>enter amount</PrimaryButton>;
  }
  if (disabled) {
    return <PrimaryButton disabled>enter gravity address</PrimaryButton>;
  }
  const increaseAllowanceActions =
    transactionStatusActions("increase allowance");
  const enableActions = transactionStatusActions("enable");
  const sendTokenActions = transactionStatusActions("send token");

  return (
    <PrimaryButton onClick={onClick}>
      {Number(amount) > token.allowance && token.allowance != 0
        ? getTransactionStatusString(
            increaseAllowanceActions.action,
            increaseAllowanceActions.inAction,
            increaseAllowanceActions.postAction,
            approveStatus
          )
        : token.allowance == 0
        ? getTransactionStatusString(
            enableActions.action,
            enableActions.inAction,
            enableActions.postAction,
            approveStatus
          )
        : getTransactionStatusString(
            sendTokenActions.action,
            sendTokenActions.inAction,
            sendTokenActions.postAction,
            cosmosStatus
          )}
      {approveStatus == "Mining" || cosmosStatus == "Mining" ? (
        <img
          style={{
            marginLeft: "20px",
          }}
          className="loading"
          height={26}
          src={loading}
        />
      ) : null}
    </PrimaryButton>
  );
};
