import styled from "@emotion/styled";
import {
  Details,
  useEnterMarkets,
  useExitMarket,
} from "../hooks/useTransaction";
import { useEffect, useState } from "react";

import LoadingModal from "../modals/loadingModal";
import useModalStore from "pages/lending/stores/useModals";
import {
  UserLMPosition,
  UserLMTokenDetails,
} from "pages/lending/config/interfaces";
import { willWithdrawalGoOverLimit } from "pages/lending/utils/supplyWithdrawLimits";
import { enableCollateralButtonAndModalText } from "../utils/modalButtonParams";
import { PrimaryButton } from "cantoui";
import { EnableCollateralContainer } from "../components/Styled";

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
  const LoadingOverlay = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: black;
  `;

  useEffect(() => {
    // console.log(enterState)
    if (
      ["Success", "Fail", "Exception"].includes(enterState.status) ||
      ["Success", "Fail", "Exception"].includes(exitState.status)
    ) {
      setTimeout(props.onClose, 500);
    }
  }, [enterState.status, exitState.status]);
  if (
    ["Mining", "PendingSignature", "Success"].includes(enterState.status) ||
    ["Mining", "PendingSignature", "Success"].includes(exitState.status)
  ) {
    return (
      <EnableCollateralContainer>
        <LoadingOverlay>
          <LoadingModal
            isLoading={true}
            status={
              ["Mining", "PendingSignature", "Success"].includes(
                enterState.status
              )
                ? enterState.status
                : exitState.status
            }
            modalText={""}
          />
        </LoadingOverlay>
      </EnableCollateralContainer>
      // <Container>
      //   <h1>{enterState.status !== "None" ? enterState.status : null} </h1>
      //   <h1>{exitState.status !== "None" ? exitState.status : null}</h1>
      // </Container>
    );
  }
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
