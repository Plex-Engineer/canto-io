import { ethers, Contract } from "ethers";
import styled from "@emotion/styled";
import { AllPairInfo } from "../hooks/useTokens";
import { parseUnits } from "ethers/lib/utils";
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
} from "../utils/utils";
import { routerAbi } from "global/config/abi";

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
  pair: AllPairInfo;
  value1: number;
  value2: number;
  slippage: number;
  deadline: number;
  chainId?: number;
  account?: string;
  expectedLP: string;
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

  const amountOut1 = truncateNumber(
    props.value1.toString(),
    props.pair.basePairInfo.token1.decimals
  );
  const amountOut2 = truncateNumber(
    props.value2.toString(),
    props.pair.basePairInfo.token2.decimals
  );

  const amountMinOut1 = truncateNumber(
    ((Number(props.value1) * (100 - Number(props.slippage))) / 100).toString(),
    props.pair.basePairInfo.token1.decimals
  );
  const amountMinOut2 = truncateNumber(
    ((Number(props.value2) * (100 - Number(props.slippage))) / 100).toString(),
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
        {Number(props.expectedLP) == 0
          ? "calculating..."
          : truncateNumber(props.expectedLP)}
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
            (1 / Number(props.pair.totalSupply.ratio)).toFixed(3) +
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
        className="box"
        style={{
          gap: "1rem",
        }}
      >
        <RowCell
          type={props.pair.basePairInfo.token1.symbol + " deposited : "}
          value={Number(props.value1).toFixed(4)}
        />
        <RowCell
          type={props.pair.basePairInfo.token2.symbol + " deposited : "}
          value={Number(props.value2).toFixed(4)}
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
              parseUnits(amountOut2, props.pair.basePairInfo.token2.decimals),
              parseUnits(
                amountMinOut2,
                props.pair.basePairInfo.token2.decimals
              ),
              parseUnits(
                amountMinOut1,
                props.pair.basePairInfo.token1.decimals
              ),
              props.account,
              currentBlockTimeStamp + Number(props.deadline) * 60,
              {
                value: parseUnits(
                  amountOut1,
                  props.pair.basePairInfo.token1.decimals
                ),
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
              parseUnits(amountOut1, props.pair.basePairInfo.token1.decimals),
              parseUnits(amountOut2, props.pair.basePairInfo.token2.decimals),
              parseUnits(
                amountMinOut1,
                props.pair.basePairInfo.token1.decimals
              ),
              parseUnits(
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

export const AddLiquidityConfirmation = (props: Props) => {
  const [confirmValues] = useModals((state) => [state.confirmationValues]);
  const [expectedLP, setExpectedLP] = useState("0");

  const amountOut1 = Number(confirmValues.amount1).toFixed(
    props.value.basePairInfo.token1.decimals
  );
  const amountOut2 = Number(confirmValues.amount2).toFixed(
    props.value.basePairInfo.token2.decimals
  );

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
      props.value.basePairInfo.token1.address,
      props.value.basePairInfo.token2.address,
      props.value.basePairInfo.stable,
      parseUnits(amountOut1, props.value.basePairInfo.token1.decimals),
      parseUnits(amountOut2, props.value.basePairInfo.token2.decimals)
    );
    const formattedLPOut = ethers.utils.formatUnits(
      LPOut.liquidity ?? 0,
      props.value.basePairInfo.decimals
    );
    setExpectedLP(formattedLPOut);
  }
  useEffect(() => {
    getExpectedLP();
  }, []);

  return (
    <div>
      <AddLiquidityButton
        pair={props.value}
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
