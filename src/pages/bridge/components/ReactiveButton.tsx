import { useEffect } from "react";
import { useBridgeStore } from "../stores/gravityStore";
import loading from "assets/loading.svg";
import {
  EmptySelectedETHToken,
  UserGravityBridgeTokens,
} from "pages/bridge/config/interfaces";
import { getReactiveButtonText } from "../utils/reactiveButtonText";
import { convertStringToBigNumber } from "../utils/stringToBigNumber";
import { OutlinedButton, PrimaryButton } from "global/packages/src";

interface RBProps {
  amount: string;
  account: string | undefined;
  token: UserGravityBridgeTokens | undefined;
  destination: string | undefined;
  gravityAddress: string | undefined;
  onClick: () => void;
}
export const ReactiveButton = ({ amount, token, onClick }: RBProps) => {
  const [approveStatus, cosmosStatus] = useBridgeStore((state) => [
    state.approveStatus,
    state.cosmosStatus,
  ]);
  const parsedAmount = convertStringToBigNumber(amount, token?.decimals ?? 18);

  const [buttonText, disabled] = getReactiveButtonText(
    parsedAmount,
    token ?? EmptySelectedETHToken,
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
    <PrimaryButton
      onClick={onClick}
      disabled={disabled}
      height="big"
      weight="bold"
    >
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
