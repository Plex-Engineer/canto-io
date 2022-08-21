import styled from "styled-components";
import { useToken } from "../../providers/activeTokenContext";
import { Details, useEnterMarkets, useExitMarket } from "../../hooks/useTransaction";
import { useEffect } from "react";
import { DisabledButton } from "../../components/reactiveButton";
import LoadingModal from "../../components/modals/loadingModal";
const Container = styled.div`
  background-color: #040404;
  padding: 2rem;
  height: 60vh;
  max-height: 45.6rem;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h2 {
    font-weight: 300;
    font-size: 18px;
    line-height: 130%;
    text-align: center;
    color: var(--off-white-color);
  }
  .tabs {
    margin: 16px;
  }

  .tablist {
    list-style: none;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--primary-color);
    padding: 0;
    color: #efefef;
    font-weight: 400;
    .tab {
      flex: 1;
      cursor: pointer;
      padding: 0.5rem;
      text-align: center;
      transition: all 0.2s ease-in-out;
      &:hover:not(.selected) {
        background: #a7efd218;
      }
      &:focus {
        outline: none;
        /* border: 1px solid var(--primary-color); */
      }
    }
  }

  .selected {
    background: rgba(6, 252, 153, 0.15);
    border-radius: 1px;
    color: var(--primary-color);
  }
`;

const Button = styled.button`
  font-weight: 300;
  font-size: 18px;
  background-color: black;
  color: var(--primary-color);
  padding: 0.2rem 2rem;
  border: 1px solid var(--primary-color);
  /* margin: 3rem auto; */
  display: flex;
  align-self: center;

  &:hover {
    background-color: var(--primary-color-dark);
    color: black;
    cursor: pointer;
  }
`;

const APY = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #222;
  padding: 2rem 0;
  color: #666;
  width: 100%;
  p {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  span {
    color: #efefef;
  }
`;

interface Props {
  onClose: (result: boolean) => void;
  decollateralize?: boolean;
}

const CollatModal = (props: Props) => {
  const tokenState = useToken();
  // console.log("token is this ", tokenState);

  const token = tokenState[0].token;
  const stats = tokenState[0].stats;


const details: Details = {
  name: token.data.underlying.symbol,
  address: token.data.address,
  icon: token.data.underlying.icon,
  amount: "0",
  type: props.decollateralize ? "Decollateralize" : "Collateralize",
};

  const { state: enterState, send: enterSend } = useEnterMarkets(details);
  const { state: exitState, send: exitSend } = useExitMarket(details);
  const LoadingOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: black;
`;

  useEffect(() => {
    // console.log(enterState)
    if (
      ["Success", "Fail", "Exception"].includes(enterState.status) ||
      ["Success", "Fail", "Exception"].includes(exitState.status)
    ) {
        setTimeout(props.onClose, 500);
    }
  }, [enterState.status, exitState.status]);
  if (
    ["Mining", "PendingSignature", "Success"].includes(enterState.status) ||
    ["Mining", "PendingSignature", "Success"].includes(exitState.status)
  ) {  
      return (
        <Container>
        <LoadingOverlay>
        <LoadingModal
          isLoading={true}
          status={["Mining", "PendingSignature", "Success"].includes(enterState.status) ? enterState.status : exitState.status}
          modalText={""}
        />
        </LoadingOverlay>
        </Container>
        // <Container>
        //   <h1>{enterState.status !== "None" ? enterState.status : null} </h1>
        //   <h1>{exitState.status !== "None" ? exitState.status : null}</h1>
        // </Container>
      );
  }
  function withdrawAmount() {
    return (
      (stats.totalBorrowLimit - stats.totalBorrowLimitUsed / 0.8) /
      token.price /
      token.collateralFactor
    );
  }
  function ifLimit(){
    return  withdrawAmount() < token.supplyBalance
  }
  return (
    <Container>
      <img
        src={token.data.underlying.icon}
        height={50}
        style={{
          marginBottom: "2rem",
        }}
        alt="canto"
      />
      <h2>{token.data.underlying.name}</h2>

      <h2>{
        (token.borrowBalance > 0) ? `you cannot uncollateralize an asset that is currently being borrowed. please repay all ${token.data.underlying.name.toLowerCase()} before uncollateralizing.` : (ifLimit() && props.decollateralize) ? "80% of your borrow limit will be used. please repay borrows or increase supply." :    
        props.decollateralize ? "disabling an asset as collateral will remove it from your borrowing limit, and no longer subject it to liquidation" :
        "enabling an asset as collateral increases your borrowing limit, but subjects the asset to liquidation"}
      </h2>
      <div
        style={{
          display: "flex",
          marginTop: "2rem",
        }}
      ></div>

      <APY
        style={{
          marginTop: "0rem",
        }}
      >
        {
          (token.borrowBalance > 0 || ifLimit()) && props.decollateralize ? <DisabledButton>
            {token.borrowBalance > 0 ? `currently borrowing ${token.data.underlying.symbol.toLowerCase()}` : `80% borrow limit will be reached`}
          </DisabledButton> : <Button
          onClick={() => {
            props.decollateralize
              ? exitSend(token.data.address)
              : enterSend([token.data.address]);

            // props.onClose();
          }}
          style={{
            margin: "0rem auto",
          }}
        >
          {props.decollateralize
            ? `disable ${token.data.underlying.symbol.toLowerCase()} as collateral`
            : `use ${token.data.underlying.symbol.toLowerCase()} as collateral`}
        </Button>
        }
        
      </APY>
    </Container>
  );
};

export default CollatModal;
