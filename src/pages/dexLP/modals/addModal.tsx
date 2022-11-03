import Field from "../components/field";
import Input from "../components/input";
import { useEffect, useState } from "react";
import LoadingModal from "./loadingModal";
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
import { getRouterAddress, useSetAllowance } from "../hooks/useTransactions";
import { truncateNumber } from "global/utils/utils";
import { UserLPPairInfo } from "../config/interfaces";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { getAddButtonTextAndOnClick } from "../utils/modalButtonParams";
import {
  DexModalContainer,
  SettingsPopIn,
  DexLoadingOverlay,
} from "../components/Styled";
import { PrimaryButton } from "global/packages/src";
interface AddAllowanceProps {
  pair: UserLPPairInfo;
  value1: string;
  value2: string;
  slippage: number;
  deadline: number;
  chainId: number | undefined;
  status1: (val: string) => void;
  status2: (val: string) => void;
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

  const routerAddress = getRouterAddress(props.chainId);

  const { state: addAllowanceA, send: addAllowanceASend } = useSetAllowance({
    type: "Enable",
    address: props.pair.basePairInfo.token1.address,
    amount: "-1",
    icon: props.pair.basePairInfo.token1.icon,
    name: props.pair.basePairInfo.token1.symbol,
  });
  const { state: addAllowanceB, send: addAllowanceBSend } = useSetAllowance({
    type: "Enable",
    address: props.pair.basePairInfo.token2.address,
    amount: "-1",
    icon: props.pair.basePairInfo.token2.icon,
    name: props.pair.basePairInfo.token2.symbol,
  });

  useEffect(() => {
    if (
      props.pair.allowance.token1.isZero() ||
      props.pair.allowance.token2.isZero()
    ) {
      setModalType(ModalType.ENABLE);
    }
  }, []);

  useEffect(() => {
    props.status1(addAllowanceA.status);
    if (addAllowanceA.status == "Success") {
      setTimeout(() => {
        setModalType(ModalType.NONE);
      }, 500);
    }
  }, [addAllowanceA.status]);
  useEffect(() => {
    props.status2(addAllowanceB.status);
    if (addAllowanceB.status == "Success") {
      setTimeout(() => {
        setModalType(ModalType.NONE);
      }, 500);
    }
  }, [addAllowanceB.status]);

  const [buttonText, buttonOnClick, disabled] = getAddButtonTextAndOnClick(
    props.pair.basePairInfo.token1.symbol,
    props.pair.basePairInfo.token2.symbol,
    props.pair.allowance.token1,
    props.pair.allowance.token2,
    props.pair.balances.token1,
    props.pair.balances.token2,
    bnValue1,
    bnValue2,
    props.slippage,
    props.deadline,
    () =>
      addAllowanceASend(
        routerAddress,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      ),
    () =>
      addAllowanceBSend(
        routerAddress,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      ),
    () => {
      setConfirmationValues({
        amount1: bnValue1,
        amount2: bnValue2,
        slippage: props.slippage,
        deadline: props.deadline,
        percentage: 0,
      });
      setModalType(ModalType.ADD_CONFIRM);
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

const AddModal = ({ activePair, chainId, account }: Props) => {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [slippage, setSlippage] = useState("1");
  const [deadline, setDeadline] = useState("10");
  const [token1AllowanceStatus, setToken1AllowanceStatus] = useState("None");
  const [token2AllowanceStatus, setToken2AllowanceStatus] = useState("None");
  const [openSettings, setOpenSettings] = useState(false);
  const displayReserveRatio = getReserveRatioAtoB(
    activePair.totalSupply.ratio.ratio,
    activePair.totalSupply.ratio.aTob,
    activePair.basePairInfo.token1.decimals,
    activePair.basePairInfo.token2.decimals
  );

  return (
    <DexModalContainer>
      <DexLoadingOverlay
        show={["Mining", "PendingSignature", "Success"].includes(
          token1AllowanceStatus
        )}
      >
        <LoadingModal
          icons={{
            icon1: activePair.basePairInfo.token1.icon,
            icon2: activePair.basePairInfo.token2.icon,
          }}
          name={
            activePair.basePairInfo.token1.symbol +
            " / " +
            activePair.basePairInfo.token2.symbol
          }
          amount={"0"}
          type="add"
          status={token1AllowanceStatus}
          account={account}
        />
      </DexLoadingOverlay>
      <DexLoadingOverlay
        show={["Mining", "PendingSignature", "Success"].includes(
          token2AllowanceStatus
        )}
      >
        <LoadingModal
          icons={{
            icon1: activePair.basePairInfo.token1.icon,
            icon2: activePair.basePairInfo.token2.icon,
          }}
          name={
            activePair.basePairInfo.token1.symbol +
            "/ " +
            activePair.basePairInfo.token2.symbol
          }
          amount={"0"}
          type="add"
          status={token2AllowanceStatus}
          account={account}
        />
      </DexLoadingOverlay>
      <div className="title">
        {openSettings ? "Transaction Settings" : "Add Liquidity"}
      </div>
      {/* <div className="logo">
        <img src={logo} height={30} />
      </div> */}
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
      <div className="fields">
        <div className="field">
          <Field
            token={activePair.basePairInfo.token1.symbol}
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
                  )
                );
              }
            }}
          />
        </div>
      </div>
      <div style={{ color: "white" }}>
        {
          <p style={{ textAlign: "right" }}>
            <a>reserve ratio: </a> 1 {activePair.basePairInfo.token1.symbol} ={" "}
            {truncateNumber(displayReserveRatio.toString())}{" "}
            {activePair.basePairInfo.token2.symbol}
          </p>
        }
        <br />
        {activePair.basePairInfo.stable ? (
          <p style={{ textAlign: "right" }}>
            <a style={{ textAlign: "left" }}>price: </a> 1{" "}
            {activePair.basePairInfo.token1.symbol} ={" "}
            {truncateNumber(
              formatUnits(
                valueInNote(
                  parseUnits("1", activePair.basePairInfo.token2.decimals),
                  activePair.prices.token2
                )
              )
            )}{" "}
            {activePair.basePairInfo.token2.symbol}
          </p>
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
