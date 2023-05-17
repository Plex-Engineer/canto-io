import Field from "../components/field";
import Input from "../components/input";
import { useEffect, useState } from "react";
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
import { truncateNumber } from "global/utils/formattingNumbers";
import { UserLPPairInfo } from "../config/interfaces";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { getAddButtonTextAndOnClick } from "../utils/modalButtonParams";
import {
  DexModalContainer,
  SettingsPopIn,
  DexLoadingOverlay,
} from "../components/Styled";
import { PrimaryButton, Text } from "global/packages/src";
import GlobalLoadingModal from "global/components/modals/loadingModal";
import { CantoTransactionType } from "global/config/interfaces/transactionTypes";
import { TransactionState } from "@usedapp/core";
interface AddAllowanceProps {
  pair: UserLPPairInfo;
  value1: string;
  value2: string;
  slippage: number;
  deadline: number;
  chainId: number | undefined;
  status1: (val: TransactionState) => void;
  status2: (val: TransactionState) => void;
}

const AddAllowanceButton = (props: AddAllowanceProps) => {
  const [setModalType, setConfirmationValues] = useModals((state) => [
    state.setModalType,
    state.setConfirmationValues,
  ]);
  let bnValue1: BigNumber;
  let bnValue2: BigNumber;
  if (
    !props.value1 ||
    isNaN(Number(props.value1)) ||
    !props.value2 ||
    isNaN(Number(props.value2))
  ) {
    bnValue1 = BigNumber.from(0);
    bnValue2 = BigNumber.from(0);
  } else {
    bnValue1 = parseUnits(
      truncateNumber(props.value1, props.pair.basePairInfo.token1.decimals),
      props.pair.basePairInfo.token1.decimals
    );
    bnValue2 = parseUnits(
      truncateNumber(props.value2, props.pair.basePairInfo.token2.decimals),
      props.pair.basePairInfo.token2.decimals
    );
  }

  useEffect(() => {
    if (
      props.pair.allowance.token1.lt(props.pair.balances.token1) ||
      props.pair.allowance.token2.lt(props.pair.balances.token2) ||
      props.pair.allowance.token1.isZero() ||
      props.pair.allowance.token2.isZero()
    ) {
      setModalType(ModalType.ENABLE);
    }
  }, []);

  const [buttonText, disabled] = getAddButtonTextAndOnClick(
    props.pair.balances.token1,
    props.pair.balances.token2,
    bnValue1,
    bnValue2,
    props.slippage,
    props.deadline
  );

  return (
    <PrimaryButton
      disabled={disabled}
      height="big"
      filled
      onClick={() => {
        setConfirmationValues({
          amount1: bnValue1,
          amount2: bnValue2,
          slippage: props.slippage,
          deadline: props.deadline,
          percentage: 0,
        });
        setModalType(ModalType.ADD_CONFIRM);
      }}
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

const AddModal = ({ activePair, chainId, onClose }: Props) => {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [slippage, setSlippage] = useState("1");
  const [deadline, setDeadline] = useState("10");
  const [token1AllowanceStatus, setToken1AllowanceStatus] =
    useState<TransactionState>("None");
  const [token2AllowanceStatus, setToken2AllowanceStatus] =
    useState<TransactionState>("None");
  const [openSettings, setOpenSettings] = useState(false);
  const displayReserveRatio = getReserveRatioAtoB(
    activePair.totalSupply.ratio.ratio,
    activePair.totalSupply.ratio.aTob,
    activePair.basePairInfo.token1.decimals,
    activePair.basePairInfo.token2.decimals
  );
  const mixPanelInfoObject = {
    tokenName:
      activePair.basePairInfo.token1.symbol +
      " / " +
      activePair.basePairInfo.token2.symbol +
      " LP",
    LPPrice: formatUnits(
      activePair.prices.LP,
      36 - activePair.basePairInfo.decimals
    ),
    token1Amount: value1,
    token1Price: formatUnits(
      activePair.prices.token1,
      36 - activePair.basePairInfo.token1.decimals
    ),
    token2Amount: value2,
    token2Price: formatUnits(
      activePair.prices.token2,
      36 - activePair.basePairInfo.token2.decimals
    ),
  };

  return (
    <DexModalContainer>
      <DexLoadingOverlay
        show={["Mining", "PendingSignature", "Success"].includes(
          token1AllowanceStatus
        )}
      >
        <GlobalLoadingModal
          transactionType={CantoTransactionType.ENABLE}
          tokenName={
            activePair.basePairInfo.token1.symbol +
            " / " +
            activePair.basePairInfo.token2.symbol
          }
          status={token1AllowanceStatus}
          onClose={onClose}
          mixPanelEventInfo={mixPanelInfoObject}
        />
      </DexLoadingOverlay>
      <DexLoadingOverlay
        show={["Mining", "PendingSignature", "Success"].includes(
          token2AllowanceStatus
        )}
      >
        <GlobalLoadingModal
          transactionType={CantoTransactionType.ENABLE}
          tokenName={
            activePair.basePairInfo.token1.symbol +
            " / " +
            activePair.basePairInfo.token2.symbol
          }
          status={token2AllowanceStatus}
          onClose={onClose}
          mixPanelEventInfo={mixPanelInfoObject}
        />
      </DexLoadingOverlay>
      {/* <div className="title">
        {openSettings ? "Transaction Settings" : "Add Liquidity"}
      </div> */}
      {/* <div className="logo">
        <img src={logo} height={30} />
      </div> */}
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
      <AddAllowanceButton
        status1={setToken1AllowanceStatus}
        status2={setToken2AllowanceStatus}
        pair={activePair}
        value1={value1}
        value2={value2}
        chainId={chainId}
        deadline={Number(deadline)}
        slippage={Number(slippage)}
      />
    </DexModalContainer>
  );
};

export default AddModal;
