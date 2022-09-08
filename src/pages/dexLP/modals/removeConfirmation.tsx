import { ethers } from "ethers";
import styled from "@emotion/styled";
import { AllPairInfo } from "../hooks/useTokens";
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
import { TOKENS, CantoTestnet } from "cantoui";
import { truncateNumber } from "global/utils/utils";
import { getCurrentBlockTimestamp } from "../utils/utils";

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

const Button = styled.button`
  font-weight: 400;
  width: 18rem;
  font-size: 22px;
  color: black;
  background-color: var(--primary-color);
  padding: 0.6rem;
  border: 1px solid var(--primary-color);
  margin: 2rem;
  /* margin: 3rem auto; */

  &:hover {
    background-color: var(--primary-color-dark);
    color: black;
    cursor: pointer;
  }
`;

const DisabledButton = styled.button`
  font-weight: 300;
  font-size: 18px;
  background-color: black;
  color: #939393;
  padding: 0.2rem 2rem;
  border: 1px solid #939393;
  margin: 2rem auto;
  margin-bottom: 0;
  display: flex;
  align-self: center;
`;

interface RemoveConfirmationProps {
  pair: AllPairInfo;
  value1: number;
  value2: number;
  percentage: number;
  slippage: number;
  deadline: number;
  chainId?: number;
  account?: string;
}

export const RemoveLiquidityButton = (props: RemoveConfirmationProps) => {
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
      : truncateNumber(
          (
            (Number(props.pair.userSupply.totalLP) * Number(props.percentage)) /
            100
          ).toString(),
          props.pair.basePairInfo.decimals
        );
  const amountMinOut1 = truncateNumber(
    ((Number(props.value1) * (100 - Number(props.slippage))) / 100).toString(),
    props.pair.basePairInfo.token1.decimals
  );
  const amountMinOut2 = truncateNumber(
    ((Number(props.value2) * (100 - Number(props.slippage))) / 100).toString(),
    props.pair.basePairInfo.token2.decimals
  );

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
            (1 / Number(props.pair.totalSupply.ratio)).toFixed(3) +
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
            Number(props.pair.totalSupply.ratio).toFixed(3) +
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
          value={truncateNumber(props.value1.toString())}
        />
        <RowCell
          type={props.pair.basePairInfo.token2.symbol + " withdrawing: "}
          value={truncateNumber(props.value2.toString())}
        />
        <RowCell type={"burned: "} value={truncateNumber(LPOut.toString())} />
        {/* <RowCell type="share of pool : " value={calculateExpectedShareofLP(props.expectedLP, props.pair.userSupply.totalLP, props.pair.totalSupply.totalLP).toFixed(8) + "%"} /> */}
      </div>
      {currentBlockTimeStamp == 0 ? (
        <DisabledButton>loading...</DisabledButton>
      ) : props.pair.basePairInfo.token1.address == WCANTO.address ? (
        <Button
          onClick={() => {
            // console.log(props);
            // console.log(((Number((props.pair.userSupply.totalLP)) * Number(props.percentage)) / 100).toFixed(18).toString())
            removeLiquidityCANTOSend(
              props.pair.basePairInfo.token2.address,
              props.pair.basePairInfo.stable,
              ethers.utils.parseUnits(LPOut, props.pair.basePairInfo.decimals),
              ethers.utils.parseUnits(
                amountMinOut2,
                props.pair.basePairInfo.token2.decimals
              ),
              ethers.utils.parseUnits(
                amountMinOut1,
                props.pair.basePairInfo.token1.decimals
              ),
              props.account,
              currentBlockTimeStamp + Number(props.deadline) * 60
            );
          }}
        >
          confirm
        </Button>
      ) : (
        <Button
          onClick={() => {
            removeLiquiditySend(
              props.pair.basePairInfo.token1.address,
              props.pair.basePairInfo.token2.address,
              props.pair.basePairInfo.stable,
              ethers.utils.parseUnits(LPOut, props.pair.basePairInfo.decimals),
              ethers.utils.parseUnits(
                amountMinOut1,
                props.pair.basePairInfo.token1.decimals
              ),
              ethers.utils.parseUnits(
                amountMinOut2,
                props.pair.basePairInfo.token2.decimals
              ),
              props.account,
              currentBlockTimeStamp + Number(props.deadline) * 60
            );
          }}
        >
          confirm
        </Button>
      )}
    </Container>
  );
};

interface Props {
  value: AllPairInfo;
  onClose: () => void;
  chainId?: number;
  account?: string;
}

export const RemoveLiquidityConfirmation = (props: Props) => {
  const [confirmValues] = useModals((state) => [state.confirmationValues]);

  return (
    <RemoveLiquidityButton
      pair={props.value}
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
