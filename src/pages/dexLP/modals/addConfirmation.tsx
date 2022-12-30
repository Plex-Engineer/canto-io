import { ethers, Contract, BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import IconPair from "../components/iconPair";
import { RowCell } from "./removeModal";
import { useEffect, useState } from "react";
import useModals from "../hooks/useModals";
import { CantoMainnet, CantoTestnet } from "global/config/networks";
import {
  useAddLiquidity,
  useAddLiquidityCANTO,
} from "../hooks/useTransactions";
import { truncateNumber } from "global/utils/utils";
import {
  calculateExpectedShareIfSupplying,
  calculateExpectedShareofLP,
  checkForCantoInPair,
  getCurrentBlockTimestamp,
  getReserveRatioAtoB,
} from "../utils/utils";
import { ERC20Abi, routerAbi } from "global/config/abi";
import { UserLPPairInfo } from "../config/interfaces";
import { DexModalContainer } from "../components/Styled";
import { ADDRESSES } from "global/config/addresses";
import { PrimaryButton, useAlert } from "global/packages/src";
import CheckBox from "global/components/checkBox";
import { useSupply } from "pages/lending/hooks/useTransaction";
import GlobalLoadingModal from "global/components/modals/loadingModal";
import { CantoTransactionType } from "global/config/transactionTypes";

interface AddConfirmationProps {
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
  //alert is used to let the user know if supply LP in lending market failed (id they closed the tab too early)
  const alert = useAlert();
  const [confirmSupply, setConfirmSupply] = useState(false);
  const { state: addLiquidityState, send: addLiquiditySend } = useAddLiquidity(
    props.chainId,
    {
      type: CantoTransactionType.ADD_LIQUIDITY,
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
      type: CantoTransactionType.ADD_LIQUIDITY,
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
  const { state: supplyLP, send: supplyLPSend } = useSupply({
    name:
      props.pair.basePairInfo.token1.symbol +
      "/" +
      props.pair.basePairInfo.token2.symbol,
    address: props.pair.basePairInfo.cLPaddress,
    icon: props.pair.basePairInfo.token1.icon,
    amount: "-1",
    type: CantoTransactionType.SUPPLY,
  });

  const [isToken1Canto, isToken2Canto] = checkForCantoInPair(
    props.pair.basePairInfo,
    props.chainId
  );

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
  async function supplyLPInLending() {
    const providerURL =
      CantoTestnet.chainId == props.chainId
        ? CantoTestnet.rpcUrl
        : CantoMainnet.rpcUrl;
    const provider = new ethers.providers.JsonRpcProvider(providerURL);
    const LPToken = new Contract(
      props.pair.basePairInfo.address,
      ERC20Abi,
      provider
    );
    const lpToSupply = (await LPToken.balanceOf(props.account)).sub(
      props.pair.userSupply.totalLP
    );
    supplyLPSend(lpToSupply);
  }

  useEffect(() => {
    blockTimeStamp();
  }, []);

  useEffect(() => {
    if (
      (addLiquidityState.status == "Success" ||
        addLiquidityCANTOState.status == "Success") &&
      confirmSupply &&
      supplyLP.status == "None"
    ) {
      supplyLPInLending();
    }
  }, [
    addLiquidityState.status,
    addLiquidityCANTOState.status,
    supplyLP.status,
  ]);

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

  function checkIfSupplyLPClosedTooSoon() {
    if (
      confirmSupply &&
      supplyLP.status == "None" &&
      (addLiquidityCANTOState.status != "None" ||
        addLiquidityState.status != "None")
    ) {
      alert.show(
        "Failure",
        <div
          onClick={alert.close}
          tabIndex={0}
          role="button"
          style={{ cursor: "pointer" }}
        >
          supply of LP tokens failed, please try again on the lending page
        </div>,
        true
      );
    }
  }

  return (
    <DexModalContainer>
      {(addLiquidityState.status != "None" ||
        addLiquidityCANTOState.status != "None") &&
        supplyLP.status == "None" && (
          <GlobalLoadingModal
            transactionType={CantoTransactionType.ADD_LIQUIDITY}
            status={
              isToken1Canto || isToken2Canto
                ? addLiquidityCANTOState.status
                : addLiquidityState.status
            }
            tokenName={
              props.pair.basePairInfo.token1.symbol +
              " / " +
              props.pair.basePairInfo.token2.symbol +
              " LP"
            }
            txHash={
              isToken1Canto || isToken2Canto
                ? addLiquidityCANTOState.transaction?.hash
                : addLiquidityState.transaction?.hash
            }
            onClose={() => {
              checkIfSupplyLPClosedTooSoon();
              props.onClose();
            }}
            mixPanelEventInfo={mixPanelInfoObject}
            additionalMessage={
              "please stay on this screen until the second Metamask transaction appears on your screen"
            }
          />
        )}
      {supplyLP.status != "None" && (
        <GlobalLoadingModal
          transactionType={CantoTransactionType.SUPPLY}
          status={supplyLP.status}
          tokenName={
            props.pair.basePairInfo.token1.symbol +
            " / " +
            props.pair.basePairInfo.token2.symbol
          }
          txHash={supplyLP.transaction?.hash}
          onClose={() => {
            checkIfSupplyLPClosedTooSoon();
            props.onClose();
          }}
          mixPanelEventInfo={mixPanelInfoObject}
        />
      )}
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
