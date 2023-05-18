import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import IconPair from "../components/iconPair";
import { RowCell } from "./removeModal";
import { useEffect, useState } from "react";
import useModals from "../hooks/useModals";
import { truncateNumber } from "global/utils/formattingNumbers";
import {
  calculateExpectedShareIfSupplying,
  getReserveRatioAtoB,
  getTokenValueFromPercent,
} from "../utils/utils";
import { LPTransaction, UserLPPairInfo } from "../config/interfaces";
import { DexModalContainer } from "../components/Styled";
import { PrimaryButton } from "global/packages/src";
import CheckBox from "global/components/checkBox";
import { getExpectedLP } from "../utils/pairCheck";
import { dexLPTx } from "../utils/transactions";
import { useTransactionStore } from "global/stores/transactionStore";
import { useNetworkInfo } from "global/stores/networkInfo";
import { getCurrentBlockTimestamp } from "global/utils/blockInfo";

interface Props {
  activePair: UserLPPairInfo;
  onClose: () => void;
  chainId?: number;
  account?: string;
}

export const AddLiquidityConfirmation = ({
  activePair,
  chainId,
  account,
}: Props) => {
  const [confirmValues] = useModals((state) => [state.confirmationValues]);
  const [expectedLP, setExpectedLP] = useState(BigNumber.from(0));
  const [confirmSupply, setConfirmSupply] = useState(false);
  const txStore = useTransactionStore();
  const networkStore = useNetworkInfo();

  async function setLPExpected() {
    setExpectedLP(
      await getExpectedLP(
        Number(chainId),
        activePair.basePairInfo,
        confirmValues.amount1,
        confirmValues.amount2
      )
    );
  }
  useEffect(() => {
    setLPExpected();
  }, []);

  const displayReserveRatio = getReserveRatioAtoB(
    activePair.totalSupply.ratio.ratio,
    activePair.totalSupply.ratio.aTob,
    activePair.basePairInfo.token1.decimals,
    activePair.basePairInfo.token2.decimals
  );
  return (
    <DexModalContainer>
      <div className="title">
        {activePair.basePairInfo.token1.symbol +
          " / " +
          activePair.basePairInfo.token2.symbol}
      </div>
      <p id="position">you will receive</p>
      <div className="row">
        <IconPair
          iconLeft={activePair.basePairInfo.token1.icon}
          iconRight={activePair.basePairInfo.token2.icon}
        />
      </div>
      <h1>
        {expectedLP.isZero()
          ? "calculating..."
          : truncateNumber(
              formatUnits(expectedLP, activePair.basePairInfo.decimals)
            )}
      </h1>

      <h4>
        {" "}
        {activePair.basePairInfo.token1.symbol +
          "/" +
          activePair.basePairInfo.token2.symbol}{" "}
        liquidity pool tokens
      </h4>
      <div
        className="box"
        style={{
          gap: "1rem",
        }}
      >
        <RowCell
          type={activePair.basePairInfo.token1.symbol + " rate : "}
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
          type={activePair.basePairInfo.token2.symbol + " rate : "}
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
        className="box"
        style={{
          gap: "1rem",
        }}
      >
        <RowCell
          type={activePair.basePairInfo.token1.symbol + " deposited : "}
          value={truncateNumber(
            formatUnits(
              confirmValues.amount1,
              activePair.basePairInfo.token1.decimals
            )
          )}
        />
        <RowCell
          type={activePair.basePairInfo.token2.symbol + " deposited : "}
          value={truncateNumber(
            formatUnits(
              confirmValues.amount2,
              activePair.basePairInfo.token2.decimals
            )
          )}
        />
        <RowCell
          type="share of pool : "
          value={
            truncateNumber(
              calculateExpectedShareIfSupplying(
                activePair.userSupply.percentOwned,
                expectedLP,
                activePair.totalSupply.totalLP
              ).toString()
            ) + "%"
          }
        />
      </div>

      <PrimaryButton
        style={{ marginTop: "1.5rem" }}
        weight="bold"
        height="big"
        filled
        onClick={async () =>
          dexLPTx(
            Number(networkStore.chainId),
            txStore,
            confirmSupply
              ? LPTransaction.ADD_LIQUIDITY_AND_STAKE
              : LPTransaction.ADD_LIQUIDITY,
            activePair,
            BigNumber.from(0),
            confirmValues.amount1,
            confirmValues.amount2,
            getTokenValueFromPercent(
              confirmValues.amount1,
              100 - Number(confirmValues.slippage)
            ),
            getTokenValueFromPercent(
              confirmValues.amount2,
              100 - Number(confirmValues.slippage)
            ),
            account,
            (await getCurrentBlockTimestamp(chainId)) +
              Math.floor(Number(confirmValues.deadline)) * 60
          )
        }
      >
        confirm
      </PrimaryButton>
      <div className="row">
        <div style={{ display: "flex", gap: "1rem" }}>
          <CheckBox
            checked={confirmSupply}
            onChange={() => setConfirmSupply(!confirmSupply)}
          />
          <p>get rewards</p>
        </div>
      </div>
      <a style={{ textAlign: "center" }}>
        ** by checking this box, LP tokens will be supplied in the lending
        market **
      </a>
    </DexModalContainer>
  );
};
