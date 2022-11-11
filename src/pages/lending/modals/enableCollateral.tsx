import styled from "@emotion/styled";
import {
  Details,
  useEnterMarkets,
  useExitMarket,
} from "../hooks/useTransaction";
import { useState } from "react";

import useModalStore from "pages/lending/stores/useModals";
import {
  UserLMPosition,
  UserLMTokenDetails,
} from "pages/lending/config/interfaces";
import { willWithdrawalGoOverLimit } from "pages/lending/utils/supplyWithdrawLimits";
import { enableCollateralButtonAndModalText } from "../utils/modalButtonParams";
import { PrimaryButton } from "global/packages/src";
import { EnableCollateralContainer } from "../components/Styled";
import GlobalLoadingModal from "global/components/modals/loadingModal";
import { CantoTransactionType } from "global/config/transactionTypes";

const APY = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #222;
  padding: 2rem 0;
  color: #666;
  width: 100%;
  p {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  span {
    color: #efefef;
  }
`;

interface Props {
  onClose: (result: boolean) => void;
  decollateralize: boolean;
  position: UserLMPosition;
}

const CollatModal = (props: Props) => {
  const modalStore = useModalStore();
  const token: UserLMTokenDetails = modalStore.activeToken;
  const [userConfirmed, setUserConfirmed] = useState(false);

  const details: Details = {
    name: token.data.underlying.symbol ?? "",
    address: token.data.address ?? "",
    icon: token.data.underlying.icon ?? "",
    amount: "0",
    type: props.decollateralize ? "Decollateralize" : "Collateralize",
  };

  const { state: enterState, send: enterSend } = useEnterMarkets(details);
  const { state: exitState, send: exitSend } = useExitMarket(details);

  const willGoOverLimit80PercentLimit = willWithdrawalGoOverLimit(
    props.position.totalBorrow,
    props.position.totalBorrowLimit,
    token.collateralFactor,
    80,
    token.supplyBalance,
    token.price
  );
  const willGoOverLimit100PercentLimit = willWithdrawalGoOverLimit(
    props.position.totalBorrow,
    props.position.totalBorrowLimit,
    token.collateralFactor,
    100,
    token.supplyBalance,
    token.price
  );
  const [buttonText, modalText, disabled, authorize] =
    enableCollateralButtonAndModalText(
      props.decollateralize,
      token.borrowBalance,
      willGoOverLimit100PercentLimit,
      willGoOverLimit80PercentLimit,
      userConfirmed,
      token.data.underlying.symbol
    );
  return (
    <EnableCollateralContainer>
      {(enterState.status != "None" || exitState.status != "None") && (
        <GlobalLoadingModal
          transactionType={
            enterState.status == "None"
              ? CantoTransactionType.DECOLLATERLIZE
              : CantoTransactionType.COLLATERALIZE
          }
          status={
            enterState.status == "None" ? exitState.status : enterState.status
          }
          tokenName={token.data.underlying.symbol}
          txHash={
            enterState.status == "None"
              ? exitState.transaction?.hash
              : enterState.transaction?.hash
          }
        />
      )}
      <img
        src={token.data.underlying.icon}
        height={50}
        style={{
          marginBottom: "2rem",
        }}
        alt="canto"
      />
      <h2>{token.data.underlying.name}</h2>
      <h2>{modalText}</h2>
      <div
        style={{
          display: "flex",
          marginTop: "2rem",
        }}
      ></div>
      <APY
        style={{
          marginTop: "0rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div>
          <PrimaryButton
            disabled={disabled}
            onClick={() => {
              props.decollateralize
                ? exitSend(token.data.address)
                : enterSend([token.data.address]);
            }}
          >
            {buttonText}
          </PrimaryButton>
          <br />
          {authorize ? (
            <a
              role="button"
              tabIndex={0}
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => setUserConfirmed(true)}
            >
              i understand this transaction will put me over 80% of my borrow
              limit
            </a>
          ) : null}
        </div>
      </APY>
    </EnableCollateralContainer>
  );
};

export default CollatModal;
