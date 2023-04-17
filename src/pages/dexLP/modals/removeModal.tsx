import Input from "../components/input";
import { ReactNode, useEffect, useState } from "react";
import { truncateNumber } from "global/utils/utils";
import SettingsIcon from "assets/settings.svg";
import IconPair from "../components/iconPair";
import useModals, { ModalType } from "../hooks/useModals";
import { getRouterAddress, useSetAllowance } from "../hooks/useTransactions";
import { UserLPPairInfo } from "../config/interfaces";
import { BigNumber } from "ethers";

import {
  getReserveRatioAtoB,
  getTokenValueFromPercent,
  valueInNote,
} from "../utils/utils";
import { formatUnits } from "ethers/lib/utils";
import { PrimaryButton, Text } from "global/packages/src";
import { getRemoveButtonTextAndOnClick } from "../utils/modalButtonParams";
import {
  DexModalContainer,
  DexLoadingOverlay,
  SettingsPopIn,
} from "../components/Styled";
import { TransactionState } from "@usedapp/core";
import GlobalLoadingModal from "global/components/modals/loadingModal";
import { CantoTransactionType } from "global/config/transactionTypes";
import NoteSymbol from "global/packages/src/components/atoms/NoteSymbol";

interface RowCellProps {
  type: string;
  value?: ReactNode;
  color?: string;
}
export const RowCell = (props: RowCellProps) => {
  return (
    <div className="row">
      <Text className="header">{props.type} :</Text>
      <Text type="title" className="value">
        {props.value}
      </Text>
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
  const LPOut = getTokenValueFromPercent(
    props.pair.userSupply.totalLP,
    props.percentage
  );

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
    <PrimaryButton
      height="big"
      filled
      weight="bold"
      disabled={disabled}
      onClick={buttonOnClick}
    >
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
    setValue1(
      getTokenValueFromPercent(activePair.userSupply.token1, Number(percentage))
    );
    setValue2(
      getTokenValueFromPercent(activePair.userSupply.token2, Number(percentage))
    );
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
          mixPanelEventInfo={{
            tokenName:
              activePair.basePairInfo.token1.symbol +
              " / " +
              activePair.basePairInfo.token2.symbol,
          }}
        />
      </DexLoadingOverlay>

      <div
        className="center"
        style={{
          justifyContent: "start",
          gap: "1rem",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "60px",
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
          <div className="row">
            <IconPair
              iconLeft={activePair.basePairInfo.token1.icon}
              iconRight={activePair.basePairInfo.token2.icon}
            />
          </div>
        </div>
        <div className="field" style={{ width: "100%", marginTop: "1rem" }}>
          <Input
            name="percent to remove"
            value={percentage}
            onChange={(percentage) => {
              setPercentage(percentage);
            }}
          />
        </div>
        <Text type="title">
          1 {activePair.basePairInfo.token1.symbol} ={" "}
          {truncateNumber(displayReserveRatio.toString())}{" "}
          {activePair.basePairInfo.token2.symbol}
        </Text>

        <div className="tokenBox">
          <Text
            // type="title"
            color="white"
            style={{
              marginBottom: "1rem",
            }}
          >
            You will receive
          </Text>
          <RowCell
            type={
              truncateNumber(
                formatUnits(value1, activePair.basePairInfo.token1.decimals)
              ) +
              " " +
              activePair.basePairInfo.token1.symbol
            }
            value={
              <>
                <NoteSymbol token="note" />
                {truncateNumber(
                  formatUnits(valueInNote(value1, activePair.prices.token1))
                )}
              </>
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
              <>
                <NoteSymbol token="note" />
                {truncateNumber(
                  formatUnits(valueInNote(value2, activePair.prices.token2))
                )}
              </>
            }
          />
        </div>
        {/* <div className="style" style={{ height: "100%" }}>
        {" "}
      </div> */}
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
          style={
            !openSettings
              ? { zIndex: "-1" }
              : { marginBottom: "-15px", zIndex: 2 }
          }
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
            height="big"
            weight="bold"
            filled
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
