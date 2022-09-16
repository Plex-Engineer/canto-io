import { ethers, Contract, BigNumber } from "ethers";
import styled from "@emotion/styled";
import { formatUnits } from "ethers/lib/utils";
import IconPair from "../components/iconPair";
import { RowCell } from "./removeModal";
import { DexLoadingOverlay } from "./addModal";
import LoadingModal from "./loadingModal";
import { useEffect, useState } from "react";
import useModals, { ModalType } from "../hooks/useModals";

import { TOKENS, ADDRESSES, CantoMainnet, CantoTestnet } from "cantoui";
import {
  useAddLiquidity,
  useAddLiquidityCANTO,
} from "../hooks/useTransactions";
import { truncateNumber } from "global/utils/utils";
import {
  calculateExpectedShareofLP,
  getCurrentBlockTimestamp,
  getReserveRatioAtoB,
} from "../utils/utils";
import { routerAbi } from "global/config/abi";
import { UserLPPairInfo } from "../config/interfaces";

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
  .box {
    width: 80%;
    display: flex;
    flex-direction: column;
  }

  .fields {
    display: flex;
    padding: 1rem;
    gap: 0.3rem;
  }

  .rowCell {
    p:first-child {
      text-transform: lowercase;
      color: #888;
    }
    p:last-child {
      color: white;
    }
  }
  @media (max-width: 1000px) {
    width: 100%;

    .box {
      width: 100%;
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
const DisabledButton = styled(Button)`
  background-color: black;
  color: #939393;
  border: 1px solid #939393;

  &:hover {
    cursor: not-allowed;
    background-color: black;
    color: #939393;
  }
`;

interface AddConfirmationProps {
  pair: UserLPPairInfo;
  value1: BigNumber;
  value2: BigNumber;
  slippage: number;
  deadline: number;
  chainId?: number;
  account?: string;
  expectedLP: BigNumber;
}

const AddLiquidityButton = (props: AddConfirmationProps) => {
  const { state: addLiquidityState, send: addLiquiditySend } = useAddLiquidity(
    props.chainId,
    {
      type: "add",
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
    }
  );
  const { state: addLiquidityCANTOState, send: addLiquidityCANTOSend } =
    useAddLiquidityCANTO(props.chainId, {
      type: "add",
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

  const WCANTO =
    props.chainId == CantoTestnet.chainId
      ? TOKENS.cantoTestnet.WCANTO
      : TOKENS.cantoMainnet.WCANTO;
  const setModalType = useModals((state) => state.setModalType);

  const amountMinOut1 = props.value1.mul(Number(props.slippage)).div(100);
  const amountMinOut2 = props.value2.mul(Number(props.slippage)).div(100);

  const displayReserveRatio = getReserveRatioAtoB(
    props.pair.totalSupply.ratio.ratio,
    props.pair.totalSupply.ratio.aTob,
    props.pair.basePairInfo.token1.decimals,
    props.pair.basePairInfo.token2.decimals
  );

  const [currentBlockTimeStamp, setCurrentBlockTimeStamp] = useState(0);

  async function blockTimeStamp() {
    setCurrentBlockTimeStamp(await getCurrentBlockTimestamp(props.chainId));
  }

  useEffect(() => {
    blockTimeStamp();
  }, []);

  useEffect(() => {
    if (
      addLiquidityState.status == "Success" ||
      addLiquidityCANTOState.status == "Success"
    ) {
      setTimeout(() => {
        setModalType(ModalType.NONE);
      }, 500);
    }
  }, [addLiquidityState.status, addLiquidityCANTOState.status]);
  return (
    <Container>
      <DexLoadingOverlay
        isLoading={["Mining", "PendingSignature", "Success"].includes(
          addLiquidityState.status
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
          type="add"
          status={addLiquidityState.status}
        />
      </DexLoadingOverlay>

      <DexLoadingOverlay
        isLoading={["Mining", "PendingSignature", "Success"].includes(
          addLiquidityCANTOState.status
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
          type="add"
          status={addLiquidityCANTOState.status}
        />
      </DexLoadingOverlay>

      <div className="title">
        {props.pair.basePairInfo.token1.symbol +
          " / " +
          props.pair.basePairInfo.token2.symbol}
      </div>
      <p id="position">you will receive</p>
      <IconPair
        iconLeft={props.pair.basePairInfo.token1.icon}
        iconRight={props.pair.basePairInfo.token2.icon}
      />
      <h1>
        {props.expectedLP.isZero()
          ? "calculating..."
          : truncateNumber(
              formatUnits(props.expectedLP, props.pair.basePairInfo.decimals)
            )}
      </h1>

      <h4>
        {" "}
        {props.pair.basePairInfo.token1.symbol +
          "/" +
          props.pair.basePairInfo.token2.symbol}{" "}
        liquidity pool tokens
      </h4>
      <div
        className="box"
        style={{
          gap: "1rem",
        }}
      >
        <RowCell
          type={props.pair.basePairInfo.token1.symbol + " rate : "}
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
          type={props.pair.basePairInfo.token2.symbol + " rate : "}
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
        className="box"
        style={{
          gap: "1rem",
        }}
      >
        <RowCell
          type={props.pair.basePairInfo.token1.symbol + " deposited : "}
          value={truncateNumber(
            formatUnits(props.value1, props.pair.basePairInfo.token1.decimals)
          )}
        />
        <RowCell
          type={props.pair.basePairInfo.token2.symbol + " deposited : "}
          value={truncateNumber(
            formatUnits(props.value2, props.pair.basePairInfo.token2.decimals)
          )}
        />
        <RowCell
          type="share of pool : "
          value={
            truncateNumber(
              calculateExpectedShareofLP(
                props.expectedLP,
                props.pair.userSupply.totalLP,
                props.pair.totalSupply.totalLP
              ).toString()
            ) + "%"
          }
        />
      </div>

      {currentBlockTimeStamp == 0 ? (
        <DisabledButton>loading</DisabledButton>
      ) : props.pair.basePairInfo.token1.address == WCANTO.address ? (
        <Button
          onClick={() => {
            addLiquidityCANTOSend(
              props.pair.basePairInfo.token2.address,
              props.pair.basePairInfo.stable,
              props.value2,
              amountMinOut2,
              amountMinOut1,
              props.account,
              currentBlockTimeStamp + Number(props.deadline) * 60,
              {
                value: props.value1,
              }
            );
          }}
        >
          confirm
        </Button>
      ) : (
        <Button
          onClick={() => {
            addLiquiditySend(
              props.pair.basePairInfo.token1.address,
              props.pair.basePairInfo.token2.address,
              props.pair.basePairInfo.stable,
              props.value1,
              props.value2,
              amountMinOut1,
              amountMinOut2,
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
  activePair: UserLPPairInfo;
  onClose: () => void;
  chainId?: number;
  account?: string;
}

export const AddLiquidityConfirmation = (props: Props) => {
  const [confirmValues] = useModals((state) => [state.confirmationValues]);
  const [expectedLP, setExpectedLP] = useState(BigNumber.from(0));

  async function getExpectedLP() {
    const providerURL =
      CantoTestnet.chainId == props.chainId
        ? CantoTestnet.rpcUrl
        : CantoMainnet.rpcUrl;
    const provider = new ethers.providers.JsonRpcProvider(providerURL);
    const routerAddress =
      CantoTestnet.chainId == props.chainId
        ? ADDRESSES.testnet.PriceFeed
        : ADDRESSES.cantoMainnet.PriceFeed;
    const RouterContract = new Contract(routerAddress, routerAbi, provider);

    const LPOut = await RouterContract.quoteAddLiquidity(
      props.activePair.basePairInfo.token1.address,
      props.activePair.basePairInfo.token2.address,
      props.activePair.basePairInfo.stable,
      confirmValues.amount1,
      confirmValues.amount2
    );
    setExpectedLP(LPOut.liquidity);
  }
  useEffect(() => {
    getExpectedLP();
  }, []);

  return (
    <div>
      <AddLiquidityButton
        pair={props.activePair}
        value1={confirmValues.amount1}
        value2={confirmValues.amount2}
        slippage={confirmValues.slippage}
        deadline={confirmValues.deadline}
        chainId={props.chainId}
        account={props.account}
        expectedLP={expectedLP}
      ></AddLiquidityButton>
    </div>
  );
};
