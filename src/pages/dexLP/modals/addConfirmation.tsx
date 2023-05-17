import { ethers, Contract, BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import IconPair from "../components/iconPair";
import { RowCell } from "./removeModal";
import { useEffect, useState } from "react";
import useModals from "../hooks/useModals";
import { CantoMainnet, CantoTestnet } from "global/config/networks";
import { truncateNumber } from "global/utils/formattingNumbers";
import {
  calculateExpectedShareIfSupplying,
  getReserveRatioAtoB,
} from "../utils/utils";
import { routerAbi } from "global/config/abi";
import { UserLPPairInfo } from "../config/interfaces";
import { DexModalContainer } from "../components/Styled";
import { ADDRESSES } from "global/config/addresses";
import { PrimaryButton } from "global/packages/src";
import CheckBox from "global/components/checkBox";
import GlobalLoadingModal from "global/components/modals/loadingModal";
import { useAddConfirmation } from "../hooks/useAddConfirmation";

export interface AddConfirmationProps {
  pair: UserLPPairInfo;
  value1: BigNumber;
  value2: BigNumber;
  slippage: number;
  deadline: number;
  chainId?: number;
  account?: string;
  expectedLP: BigNumber;
  onClose: () => void;
}

const AddLiquidityButton = (props: AddConfirmationProps) => {
  const {
    confirmSupply,
    setConfirmSupply,
    addLiquidity,
    currentTransactionState,
    checkSupplyClose,
  } = useAddConfirmation(props);

  const displayReserveRatio = getReserveRatioAtoB(
    props.pair.totalSupply.ratio.ratio,
    props.pair.totalSupply.ratio.aTob,
    props.pair.basePairInfo.token1.decimals,
    props.pair.basePairInfo.token2.decimals
  );

  const mixPanelInfoObject = {
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
  };

  return (
    <DexModalContainer>
      {currentTransactionState.state.status != "None" && (
        <GlobalLoadingModal
          transactionType={currentTransactionState.type}
          status={currentTransactionState.state.status}
          tokenName={
            props.pair.basePairInfo.token1.symbol +
            " / " +
            props.pair.basePairInfo.token2.symbol +
            " LP"
          }
          txHash={currentTransactionState.state.transaction?.hash}
          onClose={() => {
            checkSupplyClose();
            props.onClose();
          }}
          mixPanelEventInfo={mixPanelInfoObject}
          additionalMessage={
            confirmSupply
              ? "please stay on this screen until all transactions are completed"
              : null
          }
        />
      )}
      <div className="title">
        {props.pair.basePairInfo.token1.symbol +
          " / " +
          props.pair.basePairInfo.token2.symbol}
      </div>
      <p id="position">you will receive</p>
      <div className="row">
        <IconPair
          iconLeft={props.pair.basePairInfo.token1.icon}
          iconRight={props.pair.basePairInfo.token2.icon}
        />
      </div>
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
              calculateExpectedShareIfSupplying(
                props.pair.userSupply.percentOwned,
                props.expectedLP,
                props.pair.totalSupply.totalLP
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
        onClick={addLiquidity}
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
        onClose={props.onClose}
      ></AddLiquidityButton>
    </div>
  );
};
