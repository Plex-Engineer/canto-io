import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import LoadingModal from "./loadingModal";
import IconPair from "../components/iconPair";
import useModals, { ModalType } from "../hooks/useModals";
import { getRouterAddress, useSetAllowance } from "../hooks/useTransactions";
import { UserLPPairInfo } from "../config/interfaces";

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
    gap: 0.3rem;
  }

  @media (max-width: 1000px) {
    width: 100%;
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
  margin: 2rem;
  /* margin: 3rem auto; */

  &:hover {
    background-color: var(--primary-color-dark);
    color: black;
    cursor: pointer;
  }
`;

interface AddAllowanceProps {
  pair: UserLPPairInfo;
  chainId: number | undefined;
  status1: (val: string) => void;
  status2: (val: string) => void;
}

const AddAllowanceButton = (props: AddAllowanceProps) => {
  const [setModalType] = useModals((state) => [state.setModalType]);

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
    props.status1(addAllowanceA.status);
    if (
      addAllowanceA.status == "Success" &&
      (addAllowanceB.status == "None" || addAllowanceB.status == "Success")
    ) {
      setTimeout(() => {
        setModalType(ModalType.NONE);
      }, 500);
    }
  }, [addAllowanceA.status]);

  useEffect(() => {
    props.status2(addAllowanceB.status);
    if (
      addAllowanceB.status == "Success" &&
      (addAllowanceA.status == "None" || addAllowanceA.status == "Success")
    ) {
      setTimeout(() => {
        setModalType(ModalType.NONE);
      }, 500);
    }
  }, [addAllowanceB.status]);

  if (
    props.pair.allowance.token1.isZero() &&
    props.pair.allowance.token2.isZero()
  ) {
    return (
      <Button
        onClick={() => {
          addAllowanceASend(
            routerAddress,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          );
          addAllowanceBSend(
            routerAddress,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          );
        }}
      >
        enable {props.pair.basePairInfo.token1.symbol} {" & "}
        {props.pair.basePairInfo.token2.symbol}
      </Button>
    );
  } else if (props.pair.allowance.token1.isZero()) {
    return (
      <Button
        onClick={() => {
          addAllowanceASend(
            routerAddress,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          );
        }}
      >
        enable {props.pair.basePairInfo.token1.symbol}
      </Button>
    );
  } else {
    return (
      <Button
        onClick={() => {
          addAllowanceBSend(
            routerAddress,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          );
        }}
      >
        enable {props.pair.basePairInfo.token2.symbol}
      </Button>
    );
  }
};

const RemoveAllowanceButton = (props: AddAllowanceProps) => {
  const [setModalType] = useModals((state) => [state.setModalType]);

  const routerAddress = getRouterAddress(props.chainId);
  const { state: addLPAllowance, send: addLPAllowanceSend } = useSetAllowance({
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

  useEffect(() => {
    props.status1(addLPAllowance.status);
    if (addLPAllowance.status == "Success") {
      setTimeout(() => {
        setModalType(ModalType.NONE);
      }, 500);
    }
  }, [addLPAllowance.status]);

  return (
    <Button
      onClick={() => {
        addLPAllowanceSend(
          routerAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );
      }}
    >
      enable {props.pair.basePairInfo.token1.symbol}/
      {props.pair.basePairInfo.token2.symbol}_LP
    </Button>
  );
};

interface Props {
  activePair: UserLPPairInfo;
  onClose: () => void;
  chainId?: number;
  account?: string;
}

interface StyleProps {
  isLoading: boolean;
}
export const DexLoadingOverlay = styled.div<StyleProps>`
  display: ${(props) => (props.isLoading ? "block" : "none")};
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
  show: boolean;
}
export const PopIn = styled.div<showProps>`
  opacity: ${(showProps) => (showProps.show ? "100" : "0")};
  transition: all 0.2s;
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
`;
const EnableModal = ({ activePair, chainId }: Props) => {
  const [token1AllowanceStatus, setToken1AllowanceStatus] = useState("None");
  const [token2AllowanceStatus, setToken2AllowanceStatus] = useState("None");

  const prevModalType = useModals((state) => state.prevModalType);
  return (
    <Container>
      <DexLoadingOverlay
        isLoading={["Mining", "PendingSignature", "Success"].includes(
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
          type="enable"
          status={token1AllowanceStatus}
        />
      </DexLoadingOverlay>
      <DexLoadingOverlay
        isLoading={["Mining", "PendingSignature", "Success"].includes(
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
            " / " +
            activePair.basePairInfo.token2.symbol
          }
          amount={"0"}
          type="enable"
          status={token2AllowanceStatus}
        />
      </DexLoadingOverlay>
      <div className="title">{"Enable Token"}</div>
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
      <p
        style={{
          padding: "2rem",
          textAlign: "center",
        }}
      >
        enable your tokens to be transfered in the canto lp interface
      </p>
      {prevModalType == ModalType.ADD ? (
        <AddAllowanceButton
          status1={setToken1AllowanceStatus}
          status2={setToken2AllowanceStatus}
          pair={activePair}
          chainId={chainId}
        />
      ) : (
        <RemoveAllowanceButton
          status1={setToken1AllowanceStatus}
          status2={setToken2AllowanceStatus}
          pair={activePair}
          chainId={chainId}
        />
      )}
    </Container>
  );
};

export default EnableModal;
