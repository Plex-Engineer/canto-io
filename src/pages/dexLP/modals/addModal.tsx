import styled from "@emotion/styled";
import Field from "../components/field";
import Input from "../components/input";
import { AllPairInfo } from "../hooks/useTokens";
import { useEffect, useState } from "react";
import LoadingModal from "./loadingModal";
import SettingsIcon from "assets/settings.svg"
import IconPair from "../components/iconPair";
import { getTokenAFromB, getTokenBFromA } from "pages/dexLP/utils/utils";
import useModals, { ModalType } from "../hooks/useModals";
import { getRouterAddress, useSetAllowance } from "../hooks/useTransactions";
import { truncateNumber } from "global/utils/utils";

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
    z-index: 2;
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
    gap : .3rem;
  }
`;

const Button = styled.button`
  font-weight: 400;
  width: 18rem;
  font-size: 20px;
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
  background-color: black;
  color: #939393;
  border: 1px solid #939393;
  &:hover {
    color: #eee;
    cursor: default;
    background-color: #222;
  }
`;

interface AddAllowanceProps {
  pair: AllPairInfo,
  value1: string,
  value2: string,
  slippage: number,
  deadline: number,
  chainId: number | undefined,
  status1: (val : string)=>void,
  status2 : (val : string)=>void
}

const AddAllowanceButton = (props: AddAllowanceProps) => {
  const [setModalType, setConfirmationValues, activePair] = useModals(state => [state.setModalType, state.setConfirmationValues, state.activePair]);

  const routerAddress = getRouterAddress(props.chainId);
  const needToken1Allowance = Number(props.value1) > Number(props.pair.allowance.token1);
  const needToken2Allowance = Number(props.value2) > Number(props.pair.allowance.token2);
  const { state: addAllowanceA, send: addAllowanceASend } = useSetAllowance({
    type: "Enable",
    address : props.pair.basePairInfo.token1.address,
    amount : "-1",
    icon : props.pair.basePairInfo.token1.icon,
    name : props.pair.basePairInfo.token1.symbol
  });
  const { state: addAllowanceB, send: addAllowanceBSend } = useSetAllowance({
    type : "Enable",
    address : props.pair.basePairInfo.token2.address,
    amount : "-1",
    icon : props.pair.basePairInfo.token2.icon,
    name : props.pair.basePairInfo.token2.symbol
  });

  useEffect(()=>{
    if(Number(props.pair.allowance.token1) == 0 || Number(props.pair.allowance.token2) == 0)
    {
      setModalType(ModalType.ENABLE);
    }
  },[])

  useEffect(()=>{
    props.status1(addAllowanceA.status)
    if (addAllowanceA.status == "Success") {
      setTimeout(() => {
          setModalType(ModalType.NONE);
      }, 500)
  }
  },[addAllowanceA.status])
  useEffect(()=>{
    props.status2(addAllowanceB.status)
    if (addAllowanceB.status == "Success") {
      setTimeout(() => {
          setModalType(ModalType.NONE);
      }, 500)
  }
  },[addAllowanceB.status])
  if (needToken1Allowance && needToken2Allowance) {
    return (
      <Button onClick={() => {
        addAllowanceASend(routerAddress, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        addAllowanceBSend(routerAddress, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
      }}>{"enable" + props.pair.basePairInfo.token1.symbol + " & " + props.pair.basePairInfo.token2.symbol}
      </Button>
    )
  } else if (needToken1Allowance && !needToken2Allowance) {
    return (
      <Button onClick={() => {
        addAllowanceASend(routerAddress, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
      }}>
        enable {props.pair.basePairInfo.token1.symbol}
      </Button>
    )
  } else if (!needToken1Allowance && needToken2Allowance) {
    return (
      <Button onClick={() => {
        addAllowanceBSend(routerAddress, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
      }}>
        enable For {props.pair.basePairInfo.token2.symbol}
      </Button>
    )
  } else {
    if (isNaN(Number(props.value1)) || isNaN(Number(props.value2))) {
      return <DisabledButton>enter valid amount</DisabledButton>;
    } else if (
      Number(props.value1) > Number(props.pair.balances.token1) ||
      Number(props.value2) > Number(props.pair.balances.token2)
    ) {
      return <DisabledButton>no funds</DisabledButton>;
    } else if (Number(props.slippage) <= 0 || Number(props.deadline) <= 0) {
      return <DisabledButton>invalid settings</DisabledButton>;
    } else if (
      !(props.value1 && props.value2)
    ) {
      return <DisabledButton>enter amount</DisabledButton>;
    } else {
      return <Button onClick={() => {

        setConfirmationValues({
          amount1 : props.value1,
          amount2 : props.value2,
          slippage : props.slippage,
          deadline : props.deadline,
          percentage : 0
        })
        setModalType(ModalType.ADD_CONFIRM)
      }}
      >add liquidity</Button>
    }
  }
}

interface Props {
  value: AllPairInfo;
  onClose: () => void;
  chainId?: number;
  account?: string;
}

interface StyleProps {
  isLoading : boolean;
}
 export const DexLoadingOverlay = styled.div<StyleProps>`
 display: ${props => props.isLoading ? "block" : "none"};
position: absolute;
top: 0%;
bottom: 0%;
width: 100%;
max-height: 45.6rem;
z-index: 2;
background-color: black;
@media (max-width: 1000px) {
width: 99vw;
}
`;

interface showProps {
  show : boolean;
}
export const PopIn = styled.div<showProps>`
  opacity: ${showProps => showProps.show ? "100" : "0"};
  transition: all .2s;
  height: 100%;
  position: absolute;
  background-color: black;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  justify-content: center;
  top: 0;
  left: 0;
  z-index: 1;
  
`
const AddModal = ({ value, onClose, chainId, account }: Props) => {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [slippage, setSlippage] = useState("1");
  const [deadline, setDeadline] = useState("10");
  const [token1AllowanceStatus, setToken1AllowanceStatus] = useState("None");
  const [token2AllowanceStatus, setToken2AllowanceStatus] = useState("None");
  const [openSettings, setOpenSettings] = useState(false);

  function getToken1Limit() {
    if ((Number(value.balances.token2) * value.totalSupply.ratio) > Number(value.balances.token1)) {
      return truncateNumber(value.balances.token1)
    } else {
      return truncateNumber((Number(value.balances.token2) * value.totalSupply.ratio).toString())
    }
  }
  function getToken2Limit() {
    if ((Number(value.balances.token1) / value.totalSupply.ratio) > Number(value.balances.token2)) {
      return truncateNumber(value.balances.token2)
    } else {
      return truncateNumber((Number(value.balances.token1) / value.totalSupply.ratio).toString())
    }
  }

  return (
    <Container>
          <DexLoadingOverlay isLoading={["Mining", "PendingSignature", "Success"].includes(token1AllowanceStatus)} >
        <LoadingModal
        icons={
          {
            icon1 : value.basePairInfo.token1.icon,
            icon2 : value.basePairInfo.token2.icon
          }
        }
        name={
          value.basePairInfo.token1.symbol + " / " + value.basePairInfo.token2.symbol
        }
        amount={"0"}
        type="add"
          status={token1AllowanceStatus}
        />
        </DexLoadingOverlay>
        <DexLoadingOverlay isLoading={["Mining", "PendingSignature", "Success"].includes(token2AllowanceStatus)} >
        <LoadingModal
        icons={
          {
            icon1 : value.basePairInfo.token1.icon,
            icon2 : value.basePairInfo.token2.icon
          }
        }
        name={
          value.basePairInfo.token1.symbol + "/ " + value.basePairInfo.token2.symbol
        }
        amount={"0"}
        type="add"
          status={token2AllowanceStatus}
        />
        </DexLoadingOverlay>
      <div className="title">{openSettings ? "Transaction Settings" : "Add Liquidity"}</div>
      {/* <div className="logo">
        <img src={logo} height={30} />
      </div> */}
      <div style={{
  marginTop : "1rem"
}}>
<IconPair iconLeft={value.basePairInfo.token1.icon} iconRight={value.basePairInfo.token2.icon}/>

</div>
      <div style={{position: "absolute", left:"10px",top : "15px", zIndex: "10"}}>
      <img src={SettingsIcon} height="30px" style={{
        cursor: "pointer",
        zIndex : "5"
      }} onClick={()=> {setOpenSettings(!openSettings)}}/>
      </div>
      <div className="fields">
        <div className="field">
          <Field
            token={value.basePairInfo.token1.symbol}
            icon={value.basePairInfo.token1.icon}
            remaining = {Number(value.balances.token1)}
            balance={Number(value.balances.token1)}
            limit={Number(getToken1Limit())}
            placeholder="0.00"
            value={value1}
            onChange={(val) => {
              setValue1(val);
              setValue2(truncateNumber(getTokenBFromA(Number(val), value.totalSupply.ratio).toString()).toString());
            }}
          />
        </div>
        <div className="field">
          <Field
          icon={value.basePairInfo.token2.icon}
            token={value.basePairInfo.token2.symbol}
            remaining = {Number(value.balances.token2)}
            balance={Number(value.balances.token2)}
            limit={Number(getToken2Limit())}
            placeholder="0.00"
            value={value2}
            onChange={(val) => {
              setValue2(val);
              setValue1(truncateNumber(getTokenAFromB(Number(val), value.totalSupply.ratio).toString()).toString());
            }}
          />
        </div>
      </div>
      <div style={{ color: "white" }}>
         {<p style={{textAlign: "right"}}><a>reserve ratio: </a> 1   {value.basePairInfo.token1.symbol} =   {truncateNumber((1 / value.totalSupply.ratio).toString())} {value.basePairInfo.token2.symbol}</p> }
         <br/>
         {value.basePairInfo.stable ? 
         <p style={{textAlign: "right"}}><a style={{textAlign: "left"}}>price: </a> 1   {value.basePairInfo.token1.symbol} =   {truncateNumber(value.prices.token2)} {value.basePairInfo.token2.symbol}</p> 
        : ""}
      </div>
      <div className="fields" style={{
        flexDirection: "column",
        width: "100%",
        gap: "1rem"
      }}>
        <PopIn show={openSettings} style={!openSettings ? { zIndex: "-1" } : {marginBottom: "-15px"}}>
        <div className="field">
          <Input name="slippage tolerance %" value={slippage} onChange={(s) => setSlippage(s)} />
        </div>
        <div className="field">
          <Input name="transaction deadline (minutes)" value={deadline} onChange={(d) => setDeadline(d)} />
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
      <AddAllowanceButton status1={setToken1AllowanceStatus} status2={setToken2AllowanceStatus} pair={value} value1={value1} value2={value2} chainId={chainId} deadline={Number(deadline)} slippage={Number(slippage)}/>


    </Container>
  );
}; 

export default AddModal;

