import Input from "../components/input";
import { ReactNode, useEffect, useState } from "react";
import { truncateNumber } from "global/utils/formattingNumbers";
import SettingsIcon from "assets/settings.svg";
import IconPair from "../components/iconPair";
import { LPConfirmationValues, ModalType } from "../hooks/useModals";
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
import { DexModalContainer, SettingsPopIn } from "../components/Styled";
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

interface Props {
  activePair: UserLPPairInfo;
  onClose: () => void;
  setModalType: (modalType: ModalType) => void;
  setConfirmationValues: (values: LPConfirmationValues) => void;
}
const RemoveModal = ({
  activePair,
  setModalType,
  setConfirmationValues,
}: Props) => {
  const [percentage, setPercentage] = useState("1");
  const [slippage, setSlippage] = useState("1");
  const [deadline, setDeadline] = useState("10");
  const [value1, setValue1] = useState(BigNumber.from(0));
  const [value2, setValue2] = useState(BigNumber.from(0));
  const [openSettings, setOpenSettings] = useState(false);

  const [buttonText, disabled] = getRemoveButtonTextAndOnClick(
    Number(slippage),
    Number(deadline),
    Number(percentage)
  );
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
      <PrimaryButton
        height="big"
        filled
        weight="bold"
        disabled={disabled}
        onClick={() => {
          setConfirmationValues({
            amount1: value1,
            amount2: value2,
            percentage: Number(percentage),
            slippage: Number(slippage),
            deadline: Number(deadline),
          });
          setModalType(ModalType.REMOVE_CONFIRM);
        }}
      >
        {buttonText}
      </PrimaryButton>
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
