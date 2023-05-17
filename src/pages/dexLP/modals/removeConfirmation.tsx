import { BigNumber } from "ethers";
import { RowCell } from "./removeModal";
import { useEffect } from "react";
import { useState } from "react";
import useModals from "../hooks/useModals";
import { PrimaryButton } from "global/packages/src";
import { truncateNumber } from "global/utils/formattingNumbers";
import { getReserveRatioAtoB, getTokenValueFromPercent } from "../utils/utils";
import { LPTransaction, UserLPPairInfo } from "../config/interfaces";
import { formatUnits } from "ethers/lib/utils";
import { DexModalContainer } from "../components/Styled";
import { getCurrentBlockTimestamp } from "global/utils/blockInfo";
import { dexLPTx } from "../utils/transactions";
import { useNetworkInfo } from "global/stores/networkInfo";
import { useTransactionStore } from "global/stores/transactionStore";

interface Props {
  activePair: UserLPPairInfo;
  onClose: () => void;
  chainId?: number;
  account?: string;
}

export const RemoveLiquidityConfirmation = ({ activePair }: Props) => {
  const networkStore = useNetworkInfo();
  const txStore = useTransactionStore();
  const [confirmValues] = useModals((state) => [state.confirmationValues]);
  const displayReserveRatio = getReserveRatioAtoB(
    activePair.totalSupply.ratio.ratio,
    activePair.totalSupply.ratio.aTob,
    activePair.basePairInfo.token1.decimals,
    activePair.basePairInfo.token2.decimals
  );
  const LPOut =
    confirmValues.percentage == 100
      ? activePair.userSupply.totalLP
      : getTokenValueFromPercent(
          activePair.userSupply.totalLP,
          confirmValues.percentage
        );

  const amountMinOut1 = getTokenValueFromPercent(
    confirmValues.amount1,
    100 - Number(confirmValues.slippage)
  );
  const amountMinOut2 = getTokenValueFromPercent(
    confirmValues.amount2,
    100 - Number(confirmValues.slippage)
  );
  //getting current block timestamp to add to the deadline that the user inputs
  const [currentBlockTimeStamp, setCurrentBlockTimeStamp] = useState(0);

  async function blockTimeStamp() {
    setCurrentBlockTimeStamp(
      await getCurrentBlockTimestamp(Number(networkStore.chainId))
    );
  }

  useEffect(() => {
    blockTimeStamp();
  }, []);
  return (
    <DexModalContainer>
      <div className="title">
        {activePair.basePairInfo.token1.symbol +
          " / " +
          activePair.basePairInfo.token2.symbol}
      </div>
      <p id="position">you will receive</p>
      {/* <IconPair iconLeft={activePair.basePairInfo.token1.icon} iconRight={activePair.basePairInfo.token2.icon} /> */}
      <div className="row">
        <img src={activePair.basePairInfo.token1.icon} height={50} />
        <img src={activePair.basePairInfo.token2.icon} height={50} />
      </div>
      <h1>{/* {props.expectedLP} */}</h1>

      <h4>
        {" "}
        {activePair.basePairInfo.token1.symbol +
          " and " +
          activePair.basePairInfo.token2.symbol}{" "}
        tokens
      </h4>
      <div
        className="tableName"
        style={{
          gap: "1rem",
        }}
      >
        <RowCell
          type={" rates: "}
          value={
            "1 " +
            activePair.basePairInfo.token1.symbol +
            " = " +
            truncateNumber(displayReserveRatio.toString()) +
            " " +
            activePair.basePairInfo.token2.symbol
          }
        />
        <RowCell
          type={""}
          value={
            "1 " +
            activePair.basePairInfo.token2.symbol +
            " = " +
            truncateNumber((1 / displayReserveRatio).toString()) +
            " " +
            activePair.basePairInfo.token1.symbol
          }
        />
      </div>
      <div
        style={{
          borderBottom: "1px solid #222",
          width: "90%",
        }}
      ></div>
      <div
        className="tableName"
        style={{
          gap: "1rem",
        }}
      >
        <RowCell
          type={activePair.basePairInfo.token1.symbol + " withdrawing: "}
          value={truncateNumber(
            formatUnits(
              confirmValues.amount1,
              activePair.basePairInfo.token1.decimals
            )
          )}
        />
        <RowCell
          type={activePair.basePairInfo.token2.symbol + " withdrawing: "}
          value={truncateNumber(
            formatUnits(
              confirmValues.amount2,
              activePair.basePairInfo.token2.decimals
            )
          )}
        />
        <RowCell
          type={"burned: "}
          value={truncateNumber(
            formatUnits(LPOut, activePair.basePairInfo.decimals)
          )}
        />
      </div>
      <PrimaryButton
        style={{ marginTop: "1.5rem" }}
        filled
        height="big"
        weight="bold"
        disabled={currentBlockTimeStamp == 0}
        onClick={() =>
          dexLPTx(
            txStore,
            networkStore,
            LPTransaction.REMOVE_LIQUIDITY,
            activePair,
            LPOut,
            BigNumber.from(0),
            BigNumber.from(0),
            amountMinOut1,
            amountMinOut2,
            networkStore.account,
            currentBlockTimeStamp +
              Math.floor(Number(confirmValues.deadline)) * 60
          )
        }
      >
        confirm
      </PrimaryButton>
    </DexModalContainer>
  );
};
