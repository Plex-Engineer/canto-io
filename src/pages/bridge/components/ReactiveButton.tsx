import { useEffect } from "react";
import loading from "assets/loading.svg";
import { PrimaryButton } from "global/packages/src";
import styled from "@emotion/styled";
import { TransactionState } from "global/config/transactionTypes";

interface RBProps {
  account: string | undefined;
  destination: string | undefined;
  gravityAddress: string | undefined;
  onClick: () => void;
  approveStatus: TransactionState;
  cosmosStatus: TransactionState;
  buttonText: string;
  buttonDisabled: boolean;
}
export const ReactiveButton = ({
  onClick,
  approveStatus,
  cosmosStatus,
  buttonDisabled,
  buttonText,
}: RBProps) => {
  useEffect(() => {
    if (approveStatus == "Success") {
      setTimeout(() => {
        // resetApprove();
      }, 1000);
    }
  }, [approveStatus]);

  return (
    <Styled
      onClick={onClick}
      disabled={buttonDisabled}
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
    </Styled>
  );
};

const Styled = styled(PrimaryButton)`
  .loading {
    animation: rotation 3s infinite linear;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`;
