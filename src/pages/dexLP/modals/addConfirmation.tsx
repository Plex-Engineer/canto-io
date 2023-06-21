import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import IconPair from "../components/iconPair";
import { RowCell } from "./removeModal";
import { useEffect, useState } from "react";
import { LPConfirmationValues } from "../hooks/useModals";
import { truncateNumber } from "global/utils/formattingNumbers";
import {
  calculateExpectedShareIfSupplying,
  getReserveRatioAtoB,
  getTokenValueFromPercent,
} from "../utils/utils";
import { LPTransaction, UserLPPairInfo } from "../config/interfaces";
import { DexModalContainer } from "../components/Styled";
import { PrimaryButton, Text } from "global/packages/src";
import CheckBox from "global/components/checkBox";
import { getExpectedLP } from "../utils/pairCheck";
import { dexLPTx } from "../utils/transactions";
import { getCurrentBlockTimestamp } from "global/utils/blockInfo";
import { TransactionStore } from "global/stores/transactionStore";
import styled from "@emotion/styled";

interface Props {
  activePair: UserLPPairInfo;
  onClose: () => void;
  txStore: TransactionStore;
  confirmValues: LPConfirmationValues;
  chainId?: number;
  account?: string;
}

export const AddLiquidityConfirmation = ({
  activePair,
  chainId,
  account,
  txStore,
  confirmValues,
}: Props) => {
  const [expectedLP, setExpectedLP] = useState(BigNumber.from(0));
  const [confirmSupply, setConfirmSupply] = useState(false);

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
    <ConfirmationStyled>
      <Text type="title" size="title3">
        you will receive
      </Text>
      <div className="center-item">
        <IconPair
          iconLeft={activePair.basePairInfo.token1.icon}
          iconRight={activePair.basePairInfo.token2.icon}
        />
      </div>
      <Text type="title" size="title2">
        {expectedLP.isZero()
          ? "calculating..."
          : truncateNumber(
              formatUnits(expectedLP, activePair.basePairInfo.decimals)
            )}
      </Text>

      <Text color="white">
        {activePair.basePairInfo.token1.symbol +
          "/" +
          activePair.basePairInfo.token2.symbol}{" "}
        liquidity pool tokens
      </Text>
      <div
        className="box"
        style={{
          gap: "1rem",
        }}
      >
        <RowCell
          type={activePair.basePairInfo.token1.symbol + " rate"}
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
          type={activePair.basePairInfo.token2.symbol + " rate"}
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
          type={activePair.basePairInfo.token1.symbol + " deposited"}
          value={truncateNumber(
            formatUnits(
              confirmValues.amount1,
              activePair.basePairInfo.token1.decimals
            )
          )}
        />
        <RowCell
          type={activePair.basePairInfo.token2.symbol + " deposited"}
          value={truncateNumber(
            formatUnits(
              confirmValues.amount2,
              activePair.basePairInfo.token2.decimals
            )
          )}
        />
        <RowCell
          type="share of pool"
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
            chainId,
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
      <div className="getRewards">
        <CheckBox
          checked={confirmSupply}
          onChange={() => setConfirmSupply(!confirmSupply)}
        />
        <p>get rewards</p>
      </div>
      <Text size="text4">
        ** by checking this box, LP tokens will be supplied in the lending
        market **
      </Text>
    </ConfirmationStyled>
  );
};

const ConfirmationStyled = styled(DexModalContainer)`
  .row {
    display: flex;
    justify-content: space-between;
  }

  .center-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: min-content;
  }
  .box {
    display: flex;
    border: 1px solid #222;
    padding: 1rem;
  }

  .getRewards {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
  }
`;
