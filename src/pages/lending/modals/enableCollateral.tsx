import styled from "@emotion/styled";
import { useState } from "react";
import useModalStore from "pages/lending/stores/useModals";
import {
  LendingTransaction,
  UserLMPosition,
} from "pages/lending/config/interfaces";
import { willWithdrawalGoOverLimit } from "pages/lending/utils/supplyWithdrawLimits";
import { enableCollateralButtonAndModalText } from "../utils/modalButtonParams";
import { PrimaryButton } from "global/packages/src";
import { EnableCollateralContainer } from "../components/Styled";
import { useNetworkInfo } from "global/stores/networkInfo";
import { useTransactionStore } from "global/stores/transactionStore";
import { lendingMarketTx } from "../utils/transactions";
import { BigNumber } from "ethers";

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
}

const CollatModal = (props: Props) => {
  const networkStore = useNetworkInfo();
  const txStore = useTransactionStore();
  const token = useModalStore().activeToken;
  const [userConfirmed, setUserConfirmed] = useState(false);

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
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div>
          <PrimaryButton
            disabled={disabled}
            onClick={() =>
              lendingMarketTx(
                Number(networkStore.chainId),
                txStore,
                props.decollateralize
                  ? LendingTransaction.DECOLLATERLIZE
                  : LendingTransaction.COLLATERALIZE,
                token,
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
