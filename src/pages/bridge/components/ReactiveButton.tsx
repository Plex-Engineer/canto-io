import { useEffect } from "react";
import { useBridgeStore } from "../stores/gravityStore";
import loading from "assets/loading.svg";
import { PrimaryButton } from "cantoui";
import { UserNativeGTokens } from "pages/bridge/config/interfaces";
import { getReactiveButtonText } from "../utils/reactiveButtonText";
import { emptySelectedToken } from "../config/interfaces";
import { convertStringToBigNumber } from "../utils/stringToBigNumber";

interface RBProps {
  amount: string;
  account: string | undefined;
  token: UserNativeGTokens | undefined;
  destination: string | undefined;
  gravityAddress: string | undefined;
  onClick: () => void;
}
export const ReactiveButton = ({ amount, token, onClick }: RBProps) => {
  const [approveStatus, cosmosStatus] = useBridgeStore((state) => [
    state.approveStatus,
    state.cosmosStatus,
  ]);
  const parsedAmount = convertStringToBigNumber(
    amount,
    token?.data.decimals ?? 18
  );

  const [buttonText, disabled] = getReactiveButtonText(
    parsedAmount,
    token ?? emptySelectedToken,
    approveStatus,
    cosmosStatus
  );

  useEffect(() => {
    if (approveStatus == "Success") {
      setTimeout(() => {
        // resetApprove();
      }, 1000);
    }
  }, [approveStatus]);

  return (
    <PrimaryButton onClick={onClick} disabled={disabled}>
      {buttonText}
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
