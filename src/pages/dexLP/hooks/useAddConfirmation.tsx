import { TransactionStatus } from "@usedapp/core";
import { Contract } from "ethers";
import { ERC20Abi } from "global/config/abi";
import { CantoTransactionType } from "global/config/transactionTypes";
import { useAlert } from "global/packages/src";
import { getProvider } from "global/utils/walletConnect/addCantoToWallet";
import { useEnableToken, useSupply } from "pages/lending/hooks/useTransaction";
import { useEffect, useState } from "react";
import { AddConfirmationProps } from "../modals/addConfirmation";
import {
  checkForCantoInPair,
  getCurrentBlockTimestamp,
  getTokenValueFromPercent,
} from "../utils/utils";
import { useAddLiquidity, useAddLiquidityCANTO } from "./useTransactions";

interface ReturnProps {
  confirmSupply: boolean;
  setConfirmSupply: (value: boolean) => void;
  addLiquidity: () => void;
  currentTransactionState: {
    state: TransactionStatus;
    type: CantoTransactionType;
  };
  checkSupplyClose: () => void;
}
export function useAddConfirmation(props: AddConfirmationProps): ReturnProps {
  const tokenNameIconObject = {
    icon: {
      icon1: props.pair.basePairInfo.token1.icon,
      icon2: props.pair.basePairInfo.token2.icon,
    },
    name:
      props.pair.basePairInfo.token1.symbol +
      "/" +
      props.pair.basePairInfo.token2.symbol,
  };
  //alert is used to let the user know if supply LP in lending market failed (id they closed the tab too early)
  const alert = useAlert();
  //confirm supply is to check if the user wants to supply in the lending market in the same tx
  const [confirmSupply, setConfirmSupply] = useState(false);

  const addLiquidityProps = {
    type: CantoTransactionType.ADD_LIQUIDITY,
    address: "",
    amount: "-1",
    ...tokenNameIconObject,
  };

  //states for adding liquidity and supplying
  const { state: addLiquidityState, send: addLiquiditySend } = useAddLiquidity(
    props.chainId,
    addLiquidityProps
  );
  const { state: addLiquidityCANTOState, send: addLiquidityCANTOSend } =
    useAddLiquidityCANTO(props.chainId, addLiquidityProps);

  //states for supplying and allowance for supplying LP token in Lending market
  const { state: supplyLP, send: supplyLPSend } = useSupply({
    name: tokenNameIconObject.name,
    address: props.pair.basePairInfo.cLPaddress,
    icon: props.pair.basePairInfo.token1.icon,
    amount: "-1",
    type: CantoTransactionType.SUPPLY,
  });
  const { state: approveSupply, send: approveSupplySend } = useEnableToken({
    name: tokenNameIconObject.name,
    address: props.pair.basePairInfo.address,
    icon: props.pair.basePairInfo.token1.icon,
    amount: "-1",
    type: CantoTransactionType.ENABLE,
  });

  const [isToken1Canto, isToken2Canto] = checkForCantoInPair(
    props.pair.basePairInfo,
    props.chainId
  );
  const amountMinOut1 = getTokenValueFromPercent(
    props.value1,
    100 - Number(props.slippage)
  );
  const amountMinOut2 = getTokenValueFromPercent(
    props.value2,
    100 - Number(props.slippage)
  );
  async function addLiquidity() {
    if (isToken1Canto) {
      addLiquidityCANTOSend(
        props.pair.basePairInfo.token2.address,
        props.pair.basePairInfo.stable,
        props.value2,
        amountMinOut2,
        amountMinOut1,
        props.account,
        (await getCurrentBlockTimestamp(props.chainId)) +
          Math.floor(Number(props.deadline)) * 60,
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
        (await getCurrentBlockTimestamp(props.chainId)) +
          Math.floor(Number(props.deadline)) * 60,
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
        (await getCurrentBlockTimestamp(props.chainId)) +
          Math.floor(Number(props.deadline)) * 60
      );
    }
  }

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

  async function supplyLPInLending() {
    const provider = getProvider(Number(props.chainId));
    const LPToken = new Contract(
      props.pair.basePairInfo.address,
      ERC20Abi,
      provider
    );
    const lpToSupply = (await LPToken.balanceOf(props.account)).sub(
      props.pair.userSupply.totalLP
    );

    const allowance = await LPToken.allowance(
      props.account,
      props.pair.basePairInfo.cLPaddress
    );

    if (approveSupply.status == "Success" || allowance.gte(lpToSupply)) {
      supplyLPSend(lpToSupply);
    } else {
      if (approveSupply.status == "None")
        approveSupplySend(
          props.pair.basePairInfo.cLPaddress,
          lpToSupply.mul(2)
        );
    }
  }

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
    approveSupply.status,
  ]);

  return {
    confirmSupply,
    setConfirmSupply,
    addLiquidity,
    currentTransactionState:
      supplyLP.status != "None"
        ? { state: supplyLP, type: CantoTransactionType.SUPPLY }
        : approveSupply.status != "None"
        ? {
            state: approveSupply,
            type: CantoTransactionType.ENABLE,
          }
        : checkForCantoInPair(props.pair.basePairInfo, props.chainId)
        ? {
            state: addLiquidityCANTOState,
            type: CantoTransactionType.ADD_LIQUIDITY,
          }
        : {
            state: addLiquidityState,
            type: CantoTransactionType.ADD_LIQUIDITY,
          },
    checkSupplyClose: checkIfSupplyLPClosedTooSoon,
  };
}
