import { useEffect, useState } from "react";
import LoadingModal from "./loadingModal";
import IconPair from "../components/iconPair";
import useModals, { ModalType } from "../hooks/useModals";
import { getRouterAddress, useSetAllowance } from "../hooks/useTransactions";
import { UserLPPairInfo } from "../config/interfaces";
import { PrimaryButton } from "global/packages/src";
import { getEnableButtonTextAndOnClick } from "../utils/modalButtonParams";
import { DexLoadingOverlay, DexModalContainer } from "../components/Styled";

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
  const [buttonText, buttonOnclick] = getEnableButtonTextAndOnClick(
    props.pair.basePairInfo.token1.symbol,
    props.pair.basePairInfo.token2.symbol,
    props.pair.allowance.token1,
    props.pair.allowance.token2,
    () =>
      addAllowanceASend(
        routerAddress,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      ),
    () =>
      addAllowanceBSend(
        routerAddress,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      )
  );

  return <PrimaryButton onClick={buttonOnclick}>{buttonText}</PrimaryButton>;
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
    <PrimaryButton
      onClick={() => {
        addLPAllowanceSend(
          routerAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );
      }}
    >
      enable {props.pair.basePairInfo.token1.symbol}/
      {props.pair.basePairInfo.token2.symbol}_LP
    </PrimaryButton>
  );
};

interface Props {
  activePair: UserLPPairInfo;
  onClose: () => void;
  chainId?: number;
  account?: string;
}

const EnableModal = ({ activePair, chainId, account }: Props) => {
  const [token1AllowanceStatus, setToken1AllowanceStatus] = useState("None");
  const [token2AllowanceStatus, setToken2AllowanceStatus] = useState("None");

  const prevModalType = useModals((state) => state.prevModalType);
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
          type="enable"
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
            " / " +
            activePair.basePairInfo.token2.symbol
          }
          amount={"0"}
          type="enable"
          status={token2AllowanceStatus}
          account={account}
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
    </DexModalContainer>
  );
};

export default EnableModal;
