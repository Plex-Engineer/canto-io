import { BigNumber } from "ethers";
import styled from "@emotion/styled";
import {
  useRemoveLiquidity,
  useRemoveLiquidityCANTO,
} from "pages/dexLP/hooks/useTransactions";
import LoadingModal from "./loadingModal";
import { DexLoadingOverlay } from "./addModal";
import { RowCell } from "./removeModal";
import { ModalType } from "../hooks/useModals";
import { useEffect } from "react";
import { useState } from "react";
import useModals from "../hooks/useModals";
import { TOKENS, CantoTestnet, PrimaryButton } from "cantoui";
import { truncateNumber } from "global/utils/utils";
import { getCurrentBlockTimestamp, getReserveRatioAtoB } from "../utils/utils";
import { UserLPPairInfo } from "../config/interfaces";
import { formatUnits } from "ethers/lib/utils";

const Container = styled.div`
  background-color: #040404;
  height: 36rem;
  width: 30rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 0.7rem;

  /* padding: 1rem; */
  .title {
    font-style: normal;
    font-weight: 300;
    font-size: 22px;
    line-height: 130%;
    text-align: center;
    letter-spacing: -0.1em;
    color: var(--primary-color);
    /* margin-top: 0.3rem; */
    width: 100%;
    background-color: #06fc991a;
    padding: 1rem;
    border-bottom: 1px solid var(--primary-color);
    z-index: 2;
  }

  h1 {
    font-size: 30px;
    line-height: 130%;
    font-weight: 400;

    text-align: center;
    letter-spacing: -0.03em;
    color: white;
  }

  h4 {
    font-size: 16px;
    text-align: center;
    font-weight: 500;
    letter-spacing: -0.02em;
    text-transform: lowercase;
    color: #606060;
  }

  #position {
    font-size: 18px;
    line-height: 140%;
    color: #606060;
    text-align: center;
    letter-spacing: -0.03em;
  }
  .line {
    border-bottom: 1px solid #222;
  }
  .logo {
    /* padding: 1rem; */
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--primary-color);
    height: 60px;
    width: 60px;
    border-radius: 50%;
    margin-bottom: 1.2rem;
  }

  .fields {
    display: flex;
    padding: 1rem;
    gap: 0.3rem;
  }

  .rowCell {
    p:first-child {
      /* text-transform: lowercase; */
      color: #888;
    }
    p:last-child {
      color: white;
    }
  }

  .tableName {
    width: 80%;
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 1000px) {
    width: 100%;
    .tableName {
      width: 90%;
    }
  }
`;

interface RemoveConfirmationProps {
  pair: UserLPPairInfo;
  value1: BigNumber;
  value2: BigNumber;
  percentage: number;
  slippage: number;
  deadline: number;
  chainId?: number;
  account?: string;
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
      type: "remove",
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
      type: "remove",
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
  const setModalType = useModals((state) => state.setModalType);

  const WCANTO =
    props.chainId == CantoTestnet.chainId
      ? TOKENS.cantoTestnet.WCANTO
      : TOKENS.cantoMainnet.WCANTO;

  const LPOut =
    props.percentage == 100
      ? props.pair.userSupply.totalLP
      : props.pair.userSupply.totalLP.mul(props.percentage).div(100);

  const amountMinOut1 = props.value1.mul(100 - props.slippage).div(100);
  const amountMinOut2 = props.value2.mul(100 - props.slippage).div(100);

  //getting current block timestamp to add to the deadline that the user inputs
  const [currentBlockTimeStamp, setCurrentBlockTimeStamp] = useState(0);

  async function blockTimeStamp() {
    setCurrentBlockTimeStamp(await getCurrentBlockTimestamp(props.chainId));
  }

  useEffect(() => {
    blockTimeStamp();
  }, []);

  useEffect(() => {
    if (
      removeLiquidityState.status == "Success" ||
      removeLiquidityCANTOState.status == "Success"
    ) {
      setTimeout(() => {
        setModalType(ModalType.NONE);
      }, 500);
    }
  }, [removeLiquidityState.status, removeLiquidityCANTOState.status]);
  return (
    <Container>
      <DexLoadingOverlay
        isLoading={["Mining", "PendingSignature", "Success"].includes(
          removeLiquidityState.status
        )}
      >
        <LoadingModal
          icons={{
            icon1: props.pair.basePairInfo.token1.icon,
            icon2: props.pair.basePairInfo.token2.icon,
          }}
          name={
            props.pair.basePairInfo.token1.symbol +
            " / " +
            props.pair.basePairInfo.token2.symbol
          }
          amount={"0"}
          type="remove"
          status={removeLiquidityState.status}
        />
      </DexLoadingOverlay>
      <DexLoadingOverlay
        isLoading={["Mining", "PendingSignature", "Success"].includes(
          removeLiquidityCANTOState.status
        )}
      >
        <LoadingModal
          icons={{
            icon1: props.pair.basePairInfo.token1.icon,
            icon2: props.pair.basePairInfo.token2.icon,
          }}
          name={
            props.pair.basePairInfo.token1.symbol +
            "/ " +
            props.pair.basePairInfo.token2.symbol
          }
          amount={"0"}
          type="remove"
          status={removeLiquidityCANTOState.status}
        />
      </DexLoadingOverlay>
      <div className="title">
        {props.pair.basePairInfo.token1.symbol +
          " / " +
          props.pair.basePairInfo.token2.symbol}
      </div>
      <p id="position">you will receive</p>
      {/* <IconPair iconLeft={props.pair.basePairInfo.token1.icon} iconRight={props.pair.basePairInfo.token2.icon} /> */}
      <div
        style={{
          gap: "1rem",
          display: "flex",
        }}
      >
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
        size="lg"
        disabled={currentBlockTimeStamp == 0}
        onClick={() => {
          if (props.pair.basePairInfo.token1.address == WCANTO.address) {
            removeLiquidityCANTOSend(
              props.pair.basePairInfo.token2.address,
              props.pair.basePairInfo.stable,
              LPOut,
              amountMinOut2,
              amountMinOut1,
              props.account,
              currentBlockTimeStamp + Number(props.deadline) * 60
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
              currentBlockTimeStamp + Number(props.deadline) * 60
            );
          }
        }}
      >
        confirm
      </PrimaryButton>
    </Container>
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
    ></RemoveLiquidityButton>
  );
};
