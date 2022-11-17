import Input from "../components/input";
import { useEffect, useState } from "react";
import { noteSymbol, truncateNumber } from "global/utils/utils";
import SettingsIcon from "assets/settings.svg";
import IconPair from "../components/iconPair";
import useModals, { ModalType } from "../hooks/useModals";
import { getRouterAddress, useSetAllowance } from "../hooks/useTransactions";
import { UserLPPairInfo } from "../config/interfaces";
import { BigNumber } from "ethers";
import { getLPOut, getReserveRatioAtoB, valueInNote } from "../utils/utils";
import { formatUnits } from "ethers/lib/utils";
import { PrimaryButton } from "global/packages/src";
import { getRemoveButtonTextAndOnClick } from "../utils/modalButtonParams";
import {
  DexModalContainer,
  DexLoadingOverlay,
  SettingsPopIn,
} from "../components/Styled";
import { TransactionState } from "@usedapp/core";
import GlobalLoadingModal from "global/components/modals/loadingModal";
import { CantoTransactionType } from "global/config/transactionTypes";

interface RowCellProps {
  type: string;
  value?: string;
  color?: string;
}
export const RowCell = (props: RowCellProps) => {
  return (
    <div
      className="rowCell"
      style={{
        display: "flex",
        justifyContent: "space-between",
        color: "white",
        width: "100%",
        padding: "0 1rem",
      }}
    >
      <p>{props.type}</p>&nbsp;
      <p>{props.value}</p>
    </div>
  );
};

interface ConfirmButtonProps {
  pair: UserLPPairInfo;
  percentage: number;
  amount1: BigNumber;
  amount2: BigNumber;
  slippage: number;
  deadline: number;
  chainId?: number;
  status: (val: TransactionState) => void;
}

const ConfirmButton = (props: ConfirmButtonProps) => {
  const [setModalType, setConfirmationValues] = useModals((state) => [
    state.setModalType,
    state.setConfirmationValues,
  ]);

  const { state: addAllowance, send: addAllowanceSend } = useSetAllowance({
    type: CantoTransactionType.ENABLE,
    address: props.pair.basePairInfo.address,
    amount: "-1",
    // TODO? : needs access of iconpair
    icon: props.pair.basePairInfo.token1.icon,
    name:
      props.pair.basePairInfo.token1.symbol +
      "/" +
      props.pair.basePairInfo.token2.symbol,
  });

  const routerAddress = getRouterAddress(props.chainId);
  const LPOut = getLPOut(props.percentage, props.pair.userSupply.totalLP);

  useEffect(() => {
    if (props.pair.allowance.LPtoken.isZero()) {
      setModalType(ModalType.ENABLE);
    }
  }, []);
  useEffect(() => {
    props.status(addAllowance.status);
    if (addAllowance.status == "Success") {
      setTimeout(() => {
        setModalType(ModalType.NONE);
      }, 500);
    }
  }, [addAllowance.status]);

  const [buttonText, buttonOnClick, disabled] = getRemoveButtonTextAndOnClick(
    props.pair.basePairInfo.token1.symbol +
      " / " +
      props.pair.basePairInfo.token2.symbol,
    props.pair.allowance.LPtoken,
    LPOut,
    props.slippage,
    props.deadline,
    props.percentage,
    () =>
      addAllowanceSend(
        routerAddress,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      ),
    () => {
      setConfirmationValues({
        amount1: props.amount1,
        amount2: props.amount2,
        percentage: props.percentage,
        slippage: props.slippage,
        deadline: props.deadline,
      });
      setModalType(ModalType.REMOVE_CONFIRM);
    }
  );

  return (
    <PrimaryButton disabled={disabled} onClick={buttonOnClick}>
      {buttonText}
    </PrimaryButton>
  );
};

interface Props {
  activePair: UserLPPairInfo;
  onClose: () => void;
  chainId?: number;
  account?: string;
}
const RemoveModal = ({ activePair, chainId, onClose }: Props) => {
  const [percentage, setPercentage] = useState("1");
  const [slippage, setSlippage] = useState("1");
  const [deadline, setDeadline] = useState("10");
  const [value1, setValue1] = useState(BigNumber.from(0));
  const [value2, setValue2] = useState(BigNumber.from(0));
  const [openSettings, setOpenSettings] = useState(false);

  const [tokenAllowanceStatus, setTokenAllowanceStatus] =
    useState<TransactionState>("None");
  const displayReserveRatio = getReserveRatioAtoB(
    activePair.totalSupply.ratio.ratio,
    activePair.totalSupply.ratio.aTob,
    activePair.basePairInfo.token1.decimals,
    activePair.basePairInfo.token2.decimals
  );

  useEffect(() => {
    if (isNaN(Number(percentage)) || Number(percentage) <= 0) {
      setValue1(BigNumber.from(0));
      setValue2(BigNumber.from(0));
    } else {
      setValue1(activePair.userSupply.token1.mul(Number(percentage)).div(100));
      setValue2(activePair.userSupply.token2.mul(Number(percentage)).div(100));
    }
  }, [percentage]);
  return (
    <DexModalContainer>
      <DexLoadingOverlay
        show={["Mining", "PendingSignature", "Success"].includes(
          tokenAllowanceStatus
        )}
      >
        <GlobalLoadingModal
          transactionType={CantoTransactionType.ENABLE}
          tokenName={
            activePair.basePairInfo.token1.symbol +
            " / " +
            activePair.basePairInfo.token2.symbol
          }
          status={tokenAllowanceStatus}
          onClose={onClose}
        />
      </DexLoadingOverlay>
      <div className="title">
        {openSettings ? "Transaction Settings" : "Remove Liquidity"}
      </div>
      {/* <div className="logo">
        <img src={logo} height={30} />
      </div> */}
      <div
        style={{
          position: "absolute",
          left: "10px",
          top: "15px",
          zIndex: "10",
        }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            setOpenSettings(!openSettings);
          }}
        >
          <img
            src={SettingsIcon}
            height="30px"
            style={{
              cursor: "pointer",
              zIndex: "5",
            }}
          />
        </div>
      </div>
      <div
        style={{
          marginTop: "1rem",
        }}
      >
        <IconPair
          iconLeft={activePair.basePairInfo.token1.icon}
          iconRight={activePair.basePairInfo.token2.icon}
        />
      </div>
      <div
        className="field"
        style={{ width: "100%", padding: "0 2rem", marginTop: "1rem" }}
      >
        <Input
          name="percent to remove"
          value={percentage}
          onChange={(percentage) => {
            setPercentage(percentage);
          }}
        />
      </div>
      <div style={{ color: "white" }}>
        1 {activePair.basePairInfo.token1.symbol} ={" "}
        {truncateNumber(displayReserveRatio.toString())}{" "}
        {activePair.basePairInfo.token2.symbol}
      </div>

      <div className="tokenBox">
        <p
          style={{
            color: "white",
            textAlign: "center",
            width: "18rem",
            marginBottom: "1rem",
          }}
        >
          you&apos;ll receive
        </p>
        <RowCell
          type={
            truncateNumber(
              formatUnits(value1, activePair.basePairInfo.token1.decimals)
            ) +
            " " +
            activePair.basePairInfo.token1.symbol
          }
          value={
            noteSymbol +
            truncateNumber(
              formatUnits(valueInNote(value1, activePair.prices.token1))
            )
          }
        />
        <RowCell
          type={
            truncateNumber(
              formatUnits(value2, activePair.basePairInfo.token2.decimals)
            ) +
            " " +
            activePair.basePairInfo.token2.symbol
          }
          value={
            noteSymbol +
            truncateNumber(
              formatUnits(valueInNote(value2, activePair.prices.token2))
            )
          }
        />
      </div>
      <ConfirmButton
        status={setTokenAllowanceStatus}
        pair={activePair}
        percentage={Number(percentage)}
        amount1={value1}
        amount2={value2}
        slippage={Number(slippage)}
        deadline={Number(deadline)}
        chainId={chainId}
      />
      <div
        className="fields"
        style={{
          flexDirection: "column",
          width: "100%",
          gap: "1rem",
        }}
      >
        <SettingsPopIn
          show={openSettings}
          style={!openSettings ? { zIndex: "-1" } : { marginBottom: "-15px" }}
        >
          <div className="field">
            <Input
              name="slippage tolerance %"
              value={slippage}
              onChange={(s) => setSlippage(s)}
            />
          </div>
          <div className="field">
            <Input
              name="transaction deadline (minutes)"
              value={deadline}
              onChange={(d) => setDeadline(d)}
            />
          </div>
          <PrimaryButton
            disabled={Number(slippage) <= 0 || Number(deadline) <= 0}
            onClick={() => setOpenSettings(false)}
          >
            save settings
          </PrimaryButton>
        </SettingsPopIn>
      </div>
    </DexModalContainer>
  );
};

export default RemoveModal;
