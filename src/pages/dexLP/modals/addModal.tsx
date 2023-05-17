import Field from "../components/field";
import Input from "../components/input";
import { useState } from "react";
import SettingsIcon from "assets/settings.svg";
import IconPair from "../components/iconPair";
import {
  getReserveRatioAtoB,
  getToken1Limit,
  getToken2Limit,
  getTokenAFromB,
  getTokenBFromA,
  valueInNote,
} from "pages/dexLP/utils/utils";
import useModals, { ModalType } from "../hooks/useModals";
import {
  convertStringToBigNumber,
  truncateNumber,
} from "global/utils/formattingNumbers";
import { UserLPPairInfo } from "../config/interfaces";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { getAddButtonTextAndOnClick } from "../utils/modalButtonParams";
import { DexModalContainer, SettingsPopIn } from "../components/Styled";
import { PrimaryButton, Text } from "global/packages/src";

interface Props {
  activePair: UserLPPairInfo;
  onClose: () => void;
  chainId?: number;
  account?: string;
}

const AddModal = ({ activePair }: Props) => {
  const [setModalType, setConfirmationValues] = useModals((state) => [
    state.setModalType,
    state.setConfirmationValues,
  ]);
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [slippage, setSlippage] = useState("1");
  const [deadline, setDeadline] = useState("10");
  const [openSettings, setOpenSettings] = useState(false);

  const displayReserveRatio = getReserveRatioAtoB(
    activePair.totalSupply.ratio.ratio,
    activePair.totalSupply.ratio.aTob,
    activePair.basePairInfo.token1.decimals,
    activePair.basePairInfo.token2.decimals
  );
  const bnValue1 = convertStringToBigNumber(
    value1,
    activePair.basePairInfo.token1.decimals
  );
  const bnValue2 = convertStringToBigNumber(
    value2,
    activePair.basePairInfo.token2.decimals
  );

  const [buttonText, disabled] = getAddButtonTextAndOnClick(
    activePair.balances.token1,
    activePair.balances.token2,
    bnValue1,
    bnValue2,
    Number(slippage),
    Number(deadline)
  );

  return (
    <DexModalContainer>
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconPair
          iconLeft={activePair.basePairInfo.token1.icon}
          iconRight={activePair.basePairInfo.token2.icon}
        />
      </div>

      <div
        className="row"
        style={{
          marginBottom: "2rem",
        }}
      >
        <Text type="title">{activePair.basePairInfo.token1.symbol}</Text>
        <Text type="title">/</Text>
        <Text type="title">{activePair.basePairInfo.token2.symbol}</Text>
      </div>
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
      <div className="fields">
        <div className="field">
          <Field
            token={activePair.basePairInfo.token1.symbol}
            tokenDecimals={activePair.basePairInfo.token1.decimals}
            icon={activePair.basePairInfo.token1.icon}
            balance={formatUnits(
              activePair.balances.token1,
              activePair.basePairInfo.token1.decimals
            )}
            limit={formatUnits(
              getToken1Limit(
                activePair.balances.token1,
                activePair.balances.token2,
                activePair.totalSupply.ratio.ratio,
                activePair.totalSupply.ratio.aTob
              ),
              activePair.basePairInfo.token1.decimals
            )}
            placeholder="0.00"
            value={value1}
            onChange={(val) => {
              setValue1(val);
              if (!val || isNaN(Number(val))) {
                setValue2("");
              } else {
                const truncatedVal = truncateNumber(
                  val,
                  activePair.basePairInfo.token1.decimals
                );
                setValue2(
                  truncateNumber(
                    formatUnits(
                      getTokenBFromA(
                        parseUnits(
                          truncatedVal,
                          activePair.basePairInfo.token1.decimals
                        ),
                        activePair.totalSupply.ratio.ratio,
                        activePair.totalSupply.ratio.aTob
                      ),
                      activePair.basePairInfo.token2.decimals
                    ),
                    6
                  )
                );
              }
            }}
          />
        </div>
        <div className="field">
          <Field
            icon={activePair.basePairInfo.token2.icon}
            token={activePair.basePairInfo.token2.symbol}
            tokenDecimals={activePair.basePairInfo.token2.decimals}
            balance={formatUnits(
              activePair.balances.token2,
              activePair.basePairInfo.token2.decimals
            )}
            limit={formatUnits(
              getToken2Limit(
                activePair.balances.token1,
                activePair.balances.token2,
                activePair.totalSupply.ratio.ratio,
                activePair.totalSupply.ratio.aTob
              ),
              activePair.basePairInfo.token2.decimals
            )}
            placeholder="0.00"
            value={value2}
            onChange={(val) => {
              setValue2(val);
              if (!val || isNaN(Number(val))) {
                setValue1("");
              } else {
                const truncatedVal = truncateNumber(
                  val,
                  activePair.basePairInfo.token2.decimals
                );
                setValue1(
                  truncateNumber(
                    formatUnits(
                      getTokenAFromB(
                        parseUnits(
                          truncatedVal,
                          activePair.basePairInfo.token2.decimals
                        ),
                        activePair.totalSupply.ratio.ratio,
                        activePair.totalSupply.ratio.aTob
                      ),
                      activePair.basePairInfo.token1.decimals
                    ),
                    6
                  )
                );
              }
            }}
          />
        </div>
      </div>
      <div style={{ color: "white", marginTop: "4rem" }}>
        {
          <div className="row">
            <Text type="title">reserve ratio : </Text>
            <Text color="white">
              1 {activePair.basePairInfo.token1.symbol} ={" "}
              {truncateNumber(displayReserveRatio.toString())}{" "}
              {activePair.basePairInfo.token2.symbol}
            </Text>
          </div>
        }
        <br />
        {activePair.basePairInfo.stable ? (
          <div className="row">
            <Text style={{ textAlign: "left" }} type="title">
              price :
            </Text>{" "}
            <Text style={{ textAlign: "right" }} color="white">
              1 {activePair.basePairInfo.token1.symbol} ={" "}
              {truncateNumber(
                formatUnits(
                  valueInNote(
                    parseUnits("1", activePair.basePairInfo.token2.decimals),
                    activePair.prices.token2
                  )
                )
              )}{" "}
              {activePair.basePairInfo.token2.symbol}
            </Text>
          </div>
        ) : (
          ""
        )}
      </div>
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
      <PrimaryButton
        disabled={disabled}
        height="big"
        filled
        onClick={() => {
          setConfirmationValues({
            amount1: bnValue1,
            amount2: bnValue2,
            slippage: Number(slippage),
            deadline: Number(deadline),
            percentage: 0,
          });
          setModalType(ModalType.ADD_CONFIRM);
        }}
      >
        {buttonText}
      </PrimaryButton>
    </DexModalContainer>
  );
};

export default AddModal;
