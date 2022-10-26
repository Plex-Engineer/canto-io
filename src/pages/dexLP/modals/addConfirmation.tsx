import { ethers, Contract, BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import IconPair from "../components/iconPair";
import { RowCell } from "./removeModal";
import LoadingModal from "./loadingModal";
import { useEffect, useState } from "react";
import useModals, { ModalType } from "../hooks/useModals";
import { CantoMainnet, CantoTestnet } from "global/config/networks";
import {
  useAddLiquidity,
  useAddLiquidityCANTO,
} from "../hooks/useTransactions";
import { truncateNumber } from "global/utils/utils";
import {
  calculateExpectedShareofLP,
  checkForCantoInPair,
  getCurrentBlockTimestamp,
  getReserveRatioAtoB,
} from "../utils/utils";
import { routerAbi } from "global/config/abi";
import { UserLPPairInfo } from "../config/interfaces";
import { DexModalContainer, DexLoadingOverlay } from "../components/Styled";
import { ADDRESSES } from "global/config/addresses";
import { PrimaryButton } from "global/packages/src";

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

  const [isToken1Canto, isToken2Canto] = checkForCantoInPair(
    props.pair.basePairInfo,
    props.chainId
  );
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
    <DexModalContainer>
      <DexLoadingOverlay
        show={
          ["Mining", "PendingSignature", "Success"].includes(
            addLiquidityState.status
          ) ||
          ["Mining", "PendingSignature", "Success"].includes(
            addLiquidityCANTOState.status
          )
        }
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
          status={
            isToken1Canto || isToken2Canto
              ? addLiquidityCANTOState.status
              : addLiquidityState.status
          }
          account={props.account}
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

      <PrimaryButton
        disabled={currentBlockTimeStamp == 0}
        style={{ marginTop: "1.5rem" }}
        size="lg"
        onClick={() => {
          if (isToken1Canto) {
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
          } else if (isToken2Canto) {
            addLiquidityCANTOSend(
              props.pair.basePairInfo.token1.address,
              props.pair.basePairInfo.stable,
              props.value1,
              amountMinOut1,
              amountMinOut2,
              props.account,
              currentBlockTimeStamp + Number(props.deadline) * 60,
              {
                value: props.value2,
              }
            );
          } else {
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
