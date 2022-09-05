import styled from "@emotion/styled";
import Input from "../components/input";
import { AllPairInfo } from "../hooks/useTokens";
import { useEffect, useState } from "react";
import { noteSymbol, truncateNumber } from "global/utils/utils";
import LoadingModal from "./loadingModal";
import { DexLoadingOverlay, PopIn } from "./addModal";
import SettingsIcon from "assets/settings.svg";
import IconPair from "../components/iconPair";
import useModals, { ModalType } from "../hooks/useModals";
import { getRouterAddress, useSetAllowance } from "../hooks/useTransactions";

const Container = styled.div`
  background-color: #040404;
  height: 36rem;
  width: 30rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 1rem;
  /* padding: 1rem; */
  .title {
    font-style: normal;
    font-weight: 300;
    font-size: 22px;
    line-height: 130%;
    text-align: center;
    letter-spacing: -0.1em;
    color: var(--primary-color);
    /* margin-top: 0.3rem; */
    width: 100%;
    background-color: #06fc991a;
    padding: 1rem;
    border-bottom: 1px solid var(--primary-color);
    z-index: 5;
  }

  .tokenBox {
    margin: 0 2rem !important;
    background-color: #131313;
    border: 1px solid #606060;
    padding: 1rem;
  }

  .line {
    border-bottom: 1px solid #222;
  }
  .logo {
    /* padding: 1rem; */
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--primary-color);
    height: 60px;
    width: 60px;
    border-radius: 50%;
    margin-bottom: 1.2rem;
  }

  .fields {
    display: flex;
    padding: 1rem;
    gap: 0.3rem;
  }

  .rowCell {
    p:first-child {
      text-transform: lowercase;
      color: #888;
    }
    p:last-child {
      color: white;
    }
  }
  @media (max-width: 1000px) {
    width: 100%;
  }
`;

const Button = styled.button`
  font-weight: 400;
  width: 18rem;
  font-size: 22px;
  color: black;
  background-color: var(--primary-color);
  padding: 0.6rem;
  border: 1px solid var(--primary-color);
  margin: 2rem auto;
  /* margin: 3rem auto; */

  &:hover {
    background-color: var(--primary-color-dark);
    color: black;
    cursor: pointer;
  }
`;

const DisabledButton = styled(Button)`
  background-color: #222;
  color: #666;
  border: none;
  &:hover {
    color: #eee;
    cursor: default;
    background-color: #222;
  }
`;
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
  pair: AllPairInfo;
  percentage: number;
  amount1: number;
  amount2: number;
  slippage: number;
  deadline: number;
  chainId?: number;
  status: (val: string) => void;
}

const ConfirmButton = (props: ConfirmButtonProps) => {
  const [setModalType, setConfirmationValues] = useModals((state) => [
    state.setModalType,
    state.setConfirmationValues,
  ]);

  const { state: addAllowance, send: addAllowanceSend } = useSetAllowance({
    type: "Enable",
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
  const LPOut = (
    (Number(props.pair.userSupply.totalLP) * Number(props.percentage)) /
    100
  ).toFixed(props.pair.basePairInfo.decimals);

  const needLPTokenAllowance =
    Number(LPOut) > Number(props.pair.allowance.LPtoken);

  useEffect(() => {
    if (Number(props.pair.allowance.LPtoken) == 0) {
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

  if (needLPTokenAllowance) {
    return (
      <Button
        onClick={() => {
          addAllowanceSend(
            routerAddress,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          );
        }}
      >
        Enable {props.pair.basePairInfo.token1.symbol} /{" "}
        {props.pair.basePairInfo.token2.symbol}
      </Button>
    );
  } else if (
    Number(props.percentage) > 100 ||
    Number(props.percentage) <= 0 ||
    isNaN(Number(props.percentage))
  ) {
    return <DisabledButton>enter percentage</DisabledButton>;
  } else if (Number(props.slippage) <= 0 || Number(props.deadline) <= 1) {
    return <DisabledButton>invalid settings</DisabledButton>;
  } else {
    return (
      <Button
        onClick={() => {
          setConfirmationValues({
            amount1: props.amount1,
            amount2: props.amount2,
            percentage: props.percentage,
            slippage: props.slippage,
            deadline: props.deadline,
          });
          setModalType(ModalType.REMOVE_CONFIRM);
        }}
      >
        remove liquidity
      </Button>
    );
  }
};

interface Props {
  value: AllPairInfo;
  onClose: () => void;
  chainId?: number;
  account?: string;
}
const RemoveModal = ({ value, onClose, chainId, account }: Props) => {
  const [percentage, setPercentage] = useState("1");

  const [slippage, setSlippage] = useState("1");
  const [deadline, setDeadline] = useState("10");
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);
  const [openSettings, setOpenSettings] = useState(false);

  const [tokenAllowanceStatus, setTokenAllowanceStatus] = useState("None");

  useEffect(() => {
    setValue1(
      isNaN(Number(percentage))
        ? 0
        : (Number(percentage) * Number(value.userSupply.token1)) / 100
    );
    setValue2(
      isNaN(Number(percentage))
        ? 0
        : (Number(percentage) * Number(value.userSupply.token2)) / 100
    );
  }, [percentage]);
  return (
    <Container>
      <DexLoadingOverlay
        isLoading={["Mining", "PendingSignature", "Success"].includes(
          tokenAllowanceStatus
        )}
      >
        <LoadingModal
          icons={{
            icon1: value.basePairInfo.token1.icon,
            icon2: value.basePairInfo.token2.icon,
          }}
          name={
            value.basePairInfo.token1.symbol +
            " / " +
            value.basePairInfo.token2.symbol
          }
          amount={"0"}
          type="remove"
          status={tokenAllowanceStatus}
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
        <img
          src={SettingsIcon}
          height="30px"
          style={{
            cursor: "pointer",
            zIndex: "5",
          }}
          onClick={() => {
            setOpenSettings(!openSettings);
          }}
        />
      </div>
      <div
        style={{
          marginTop: "1rem",
        }}
      >
        <IconPair
          iconLeft={value.basePairInfo.token1.icon}
          iconRight={value.basePairInfo.token2.icon}
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
            // setValue1(isNaN(Number(percentage)) ? 0 : (Number(percentage) * Number(value.userSupply.token1) / 100))
            // setValue2(isNaN(Number(percentage)) ? 0 : (Number(percentage) * Number(value.userSupply.token2) / 100))
          }}
        />
      </div>
      <div style={{ color: "white" }}>
        1 {value.basePairInfo.token1.symbol} ={" "}
        {truncateNumber((1 / value.totalSupply.ratio).toString())}{" "}
        {value.basePairInfo.token2.symbol}
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
            truncateNumber(value1.toString()) +
            " " +
            value.basePairInfo.token1.symbol
          }
          value={
            noteSymbol +
            truncateNumber((value1 * Number(value.prices.token1)).toString())
          }
        />
        <RowCell
          type={
            truncateNumber(value2.toString()) +
            " " +
            value.basePairInfo.token2.symbol
          }
          value={
            noteSymbol +
            truncateNumber((value2 * Number(value.prices.token2)).toString())
          }
        />
      </div>
      <ConfirmButton
        status={setTokenAllowanceStatus}
        pair={value}
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
        <PopIn
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
          {Number(slippage) <= 0 || Number(deadline) <= 0 ? (
            <DisabledButton>save settings</DisabledButton>
          ) : (
            <Button onClick={() => setOpenSettings(false)}>
              save settings
            </Button>
          )}
        </PopIn>
      </div>
    </Container>
  );
};

export default RemoveModal;
