import styled from "@emotion/styled";
import { useState } from "react";
import {
  UserLMPosition,
  UserLMTokenDetails,
} from "pages/lending/config/interfaces";
import { willWithdrawalGoOverLimit } from "pages/lending/utils/supplyWithdrawLimits";
import { enableCollateralButtonAndModalText } from "../utils/modalButtonParams";
import { PrimaryButton } from "global/packages/src";
import { EnableCollateralContainer } from "../components/Styled";
import { lendingMarketTx } from "../utils/transactions";
import { BigNumber } from "ethers";
import { CantoTransactionType } from "global/config/interfaces/transactionTypes";
import { TransactionStore } from "global/stores/transactionStoreWithRetry";

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
  decollateralize: boolean;
  position: UserLMPosition;
  activeToken: UserLMTokenDetails;
  chainId: number;
  txStore: TransactionStore;
}

const CollatModal = (props: Props) => {
  const [userConfirmed, setUserConfirmed] = useState(false);

  const willGoOverLimit80PercentLimit = willWithdrawalGoOverLimit(
    props.position.totalBorrow,
    props.position.totalBorrowLimit,
    props.activeToken.collateralFactor,
    80,
    props.activeToken.supplyBalance,
    props.activeToken.price
  );
  const willGoOverLimit100PercentLimit = willWithdrawalGoOverLimit(
    props.position.totalBorrow,
    props.position.totalBorrowLimit,
    props.activeToken.collateralFactor,
    100,
    props.activeToken.supplyBalance,
    props.activeToken.price
  );
  const [buttonText, modalText, disabled, authorize] =
    enableCollateralButtonAndModalText(
      props.decollateralize,
      props.activeToken.borrowBalance,
      willGoOverLimit100PercentLimit,
      willGoOverLimit80PercentLimit,
      userConfirmed,
      props.activeToken.data.underlying.symbol
    );
  return (
    <EnableCollateralContainer>
      <img
        src={props.activeToken.data.underlying.icon}
        height={50}
        style={{
          marginBottom: "2rem",
        }}
        alt="canto"
      />
      <h2>{props.activeToken.data.underlying.name}</h2>
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
            onClick={() =>
              lendingMarketTx(
                props.chainId,
                props.txStore,
                props.decollateralize
                  ? CantoTransactionType.DECOLLATERLIZE
                  : CantoTransactionType.COLLATERALIZE,
                props.activeToken,
                BigNumber.from("0")
              )
            }
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
