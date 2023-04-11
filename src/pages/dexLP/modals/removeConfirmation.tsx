import { BigNumber } from "ethers";
import {
  useRemoveLiquidity,
  useRemoveLiquidityCANTO,
} from "pages/dexLP/hooks/useTransactions";
import { RowCell } from "./removeModal";
import { useEffect } from "react";
import { useState } from "react";
import useModals from "../hooks/useModals";
import { PrimaryButton } from "global/packages/src";
import { truncateNumber } from "global/utils/utils";
import { getReserveRatioAtoB, getTokenValueFromPercent } from "../utils/utils";
import { UserLPPairInfo } from "../config/interfaces";
import { formatUnits } from "ethers/lib/utils";
import { DexModalContainer } from "../components/Styled";
import GlobalLoadingModal from "global/components/modals/loadingModal";
import { CantoTransactionType } from "global/config/transactionTypes";
import { getCurrentBlockTimestamp } from "global/utils/blockInfo";
import { checkForCantoInPair } from "../utils/pairCheck";

interface RemoveConfirmationProps {
  pair: UserLPPairInfo;
  value1: BigNumber;
  value2: BigNumber;
  percentage: number;
  slippage: number;
  deadline: number;
  chainId?: number;
  account?: string;
  onClose: () => void;
}

export const RemoveLiquidityButton = (props: RemoveConfirmationProps) => {
  const displayReserveRatio = getReserveRatioAtoB(
    props.pair.totalSupply.ratio.ratio,
    props.pair.totalSupply.ratio.aTob,
    props.pair.basePairInfo.token1.decimals,
    props.pair.basePairInfo.token2.decimals
  );
  const { state: removeLiquidityState, send: removeLiquiditySend } =
    useRemoveLiquidity(props.chainId, {
      type: CantoTransactionType.REMOVE_LIQUIDITY,
      address: "",
      amount: "-1",
      icon: {
        icon1: props.pair.basePairInfo.token1.icon,
        icon2: props.pair.basePairInfo.token2.icon,
      },
      name:
        props.pair.basePairInfo.token1.symbol +
        "/" +
        props.pair.basePairInfo.token2.symbol,
    });
  const { state: removeLiquidityCANTOState, send: removeLiquidityCANTOSend } =
    useRemoveLiquidityCANTO(props.chainId, {
      type: CantoTransactionType.REMOVE_LIQUIDITY,
      address: "",
      amount: "-1",
      icon: {
        icon1: props.pair.basePairInfo.token1.icon,
        icon2: props.pair.basePairInfo.token2.icon,
      },
      name:
        props.pair.basePairInfo.token1.symbol +
        "/" +
        props.pair.basePairInfo.token2.symbol,
    });
  const [isToken1Canto, isToken2Canto] = checkForCantoInPair(
    props.pair.basePairInfo,
    props.chainId
  );

  const LPOut =
    props.percentage == 100
      ? props.pair.userSupply.totalLP
      : getTokenValueFromPercent(
          props.pair.userSupply.totalLP,
          props.percentage
        );

  const amountMinOut1 = getTokenValueFromPercent(
    props.value1,
    100 - Number(props.slippage)
  );
  const amountMinOut2 = getTokenValueFromPercent(
    props.value2,
    100 - Number(props.slippage)
  );

  //getting current block timestamp to add to the deadline that the user inputs
  const [currentBlockTimeStamp, setCurrentBlockTimeStamp] = useState(0);

  async function blockTimeStamp() {
    setCurrentBlockTimeStamp(await getCurrentBlockTimestamp(props.chainId));
  }

  useEffect(() => {
    blockTimeStamp();
  }, []);

  return (
    <DexModalContainer>
      {(removeLiquidityState.status != "None" ||
        removeLiquidityCANTOState.status != "None") && (
        <GlobalLoadingModal
          transactionType={CantoTransactionType.REMOVE_LIQUIDITY}
          status={
            isToken1Canto || isToken2Canto
              ? removeLiquidityCANTOState.status
              : removeLiquidityState.status
          }
          tokenName={
            props.pair.basePairInfo.token1.symbol +
            " / " +
            props.pair.basePairInfo.token2.symbol +
            " LP"
          }
          txHash={
            isToken1Canto || isToken2Canto
              ? removeLiquidityCANTOState.transaction?.hash
              : removeLiquidityState.transaction?.hash
          }
          onClose={props.onClose}
          mixPanelEventInfo={{
            tokenName:
              props.pair.basePairInfo.token1.symbol +
              " / " +
              props.pair.basePairInfo.token2.symbol +
              " LP",
            LPPrice: formatUnits(
              props.pair.prices.LP,
              36 - props.pair.basePairInfo.decimals
            ),
            token1Amount: formatUnits(
              props.value1,
              props.pair.basePairInfo.token1.decimals
            ),
            token1Price: formatUnits(
              props.pair.prices.token1,
              36 - props.pair.basePairInfo.token1.decimals
            ),
            token2Amount: formatUnits(
              props.value2,
              props.pair.basePairInfo.token2.decimals
            ),
            token2Price: formatUnits(
              props.pair.prices.token2,
              36 - props.pair.basePairInfo.token2.decimals
            ),
          }}
        />
      )}
      <div className="title">
        {props.pair.basePairInfo.token1.symbol +
          " / " +
          props.pair.basePairInfo.token2.symbol}
      </div>
      <p id="position">you will receive</p>
      {/* <IconPair iconLeft={props.pair.basePairInfo.token1.icon} iconRight={props.pair.basePairInfo.token2.icon} /> */}
      <div className="row">
        <img src={props.pair.basePairInfo.token1.icon} height={50} />
        <img src={props.pair.basePairInfo.token2.icon} height={50} />
      </div>
      <h1>{/* {props.expectedLP} */}</h1>

      <h4>
        {" "}
        {props.pair.basePairInfo.token1.symbol +
          " and " +
          props.pair.basePairInfo.token2.symbol}{" "}
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
            props.pair.basePairInfo.token1.symbol +
            " = " +
            truncateNumber(displayReserveRatio.toString()) +
            " " +
            props.pair.basePairInfo.token2.symbol
          }
        />
        <RowCell
          type={""}
          value={
            "1 " +
            props.pair.basePairInfo.token2.symbol +
            " = " +
            truncateNumber((1 / displayReserveRatio).toString()) +
            " " +
            props.pair.basePairInfo.token1.symbol
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
          type={props.pair.basePairInfo.token1.symbol + " withdrawing: "}
          value={truncateNumber(
            formatUnits(props.value1, props.pair.basePairInfo.token1.decimals)
          )}
        />
        <RowCell
          type={props.pair.basePairInfo.token2.symbol + " withdrawing: "}
          value={truncateNumber(
            formatUnits(props.value2, props.pair.basePairInfo.token2.decimals)
          )}
        />
        <RowCell
          type={"burned: "}
          value={truncateNumber(
            formatUnits(LPOut, props.pair.basePairInfo.decimals)
          )}
        />
        {/* <RowCell type="share of pool : " value={calculateExpectedShareofLP(props.expectedLP, props.pair.userSupply.totalLP, props.pair.totalSupply.totalLP).toFixed(8) + "%"} /> */}
      </div>
      <PrimaryButton
        style={{ marginTop: "1.5rem" }}
        filled
        height="big"
        weight="bold"
        disabled={currentBlockTimeStamp == 0}
        onClick={() => {
          if (isToken1Canto) {
            removeLiquidityCANTOSend(
              props.pair.basePairInfo.token2.address,
              props.pair.basePairInfo.stable,
              LPOut,
              amountMinOut2,
              amountMinOut1,
              props.account,
              currentBlockTimeStamp + Math.floor(Number(props.deadline)) * 60
            );
          } else if (isToken2Canto) {
            removeLiquidityCANTOSend(
              props.pair.basePairInfo.token1.address,
              props.pair.basePairInfo.stable,
              LPOut,
              amountMinOut1,
              amountMinOut2,
              props.account,
              currentBlockTimeStamp + Math.floor(Number(props.deadline)) * 60
            );
          } else {
            removeLiquiditySend(
              props.pair.basePairInfo.token1.address,
              props.pair.basePairInfo.token2.address,
              props.pair.basePairInfo.stable,
              LPOut,
              amountMinOut1,
              amountMinOut2,
              props.account,
              currentBlockTimeStamp + Math.floor(Number(props.deadline)) * 60
            );
          }
        }}
      >
        confirm
      </PrimaryButton>
    </DexModalContainer>
  );
};

interface Props {
  activePair: UserLPPairInfo;
  onClose: () => void;
  chainId?: number;
  account?: string;
}

export const RemoveLiquidityConfirmation = (props: Props) => {
  const [confirmValues] = useModals((state) => [state.confirmationValues]);

  return (
    <RemoveLiquidityButton
      pair={props.activePair}
      value1={confirmValues.amount1}
      value2={confirmValues.amount2}
      percentage={confirmValues.percentage}
      slippage={confirmValues.slippage}
      deadline={confirmValues.deadline}
      chainId={props.chainId}
      account={props.account}
      onClose={props.onClose}
    ></RemoveLiquidityButton>
  );
};
