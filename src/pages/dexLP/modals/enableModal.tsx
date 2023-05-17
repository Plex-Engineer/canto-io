import IconPair from "../components/iconPair";
import useModals, { ModalType } from "../hooks/useModals";
import { getRouterAddress, useSetAllowance } from "../hooks/useTransactions";
import { UserLPPairInfo } from "../config/interfaces";
import { PrimaryButton, Text } from "global/packages/src";
import { DexModalContainer } from "../components/Styled";
import { CantoTransactionType } from "global/config/interfaces/transactionTypes";
import lockIcon from "assets/icons/lock.svg";
import { BigNumber } from "ethers";
import { TransactionState } from "@usedapp/core";
import { getShortTxStatusFromState } from "global/utils/formatTxDetails";
import { useEffect } from "react";

interface AddSingleAllowanceProps {
  tokenName: string;
  tokenAllowance: BigNumber;
  chainId: number | undefined;
  addAllowance: (router: string, amount: string) => void;
  state: TransactionState;
  tokenBalance: BigNumber;
}

const AddSingleAllowanceButton = (props: AddSingleAllowanceProps) => {
  const routerAddress = getRouterAddress(props.chainId);

  return (
    <PrimaryButton
      disabled={
        props.tokenAllowance.gte(props.tokenBalance) &&
        !props.tokenAllowance.isZero()
      }
      onClick={() =>
        props.addAllowance(
          routerAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        )
      }
      filled
      height={"big"}
    >
      <Text color="dark" bold>
        {props.state == "None"
          ? `enable ${props.tokenName}`
          : getShortTxStatusFromState(props.state)}
      </Text>
    </PrimaryButton>
  );
};

interface Props {
  activePair: UserLPPairInfo;
  onClose: () => void;
  chainId?: number;
  account?: string;
  setModal: (modalType: ModalType) => void;
}

const EnableModal = ({ activePair, chainId, setModal }: Props) => {
  const { state: addAllowanceA, send: addAllowanceASend } = useSetAllowance({
    type: CantoTransactionType.ENABLE,
    address: activePair.basePairInfo.token1.address,
    amount: "-1",
    icon: activePair.basePairInfo.token1.icon,
    name: activePair.basePairInfo.token1.symbol,
  });
  const { state: addAllowanceB, send: addAllowanceBSend } = useSetAllowance({
    type: CantoTransactionType.ENABLE,
    address: activePair.basePairInfo.token2.address,
    amount: "-1",
    icon: activePair.basePairInfo.token2.icon,
    name: activePair.basePairInfo.token2.symbol,
  });
  const { state: addLPAllowance, send: addLPAllowanceSend } = useSetAllowance({
    type: CantoTransactionType.ENABLE,
    address: activePair.basePairInfo.address,
    amount: "-1",
    // TODO? : needs access of iconpair
    icon: activePair.basePairInfo.token1.icon,
    name:
      activePair.basePairInfo.token1.symbol +
      "/" +
      activePair.basePairInfo.token2.symbol,
  });

  const prevModalType = useModals((state) => state.prevModalType);

  function doneAllowance(
    allowance: BigNumber,
    balance: BigNumber,
    status: TransactionState
  ) {
    return (
      (allowance.gte(balance) && !allowance.isZero()) || status == "Success"
    );
  }

  //bring us to the next modal if we are done enabling
  useEffect(() => {
    if (prevModalType == ModalType.ADD) {
      if (
        doneAllowance(
          activePair.allowance.token1,
          activePair.balances.token1,
          addAllowanceA.status
        ) &&
        doneAllowance(
          activePair.allowance.token2,
          activePair.balances.token2,
          addAllowanceB.status
        )
      ) {
        setModal(ModalType.NONE);
      }
    } else if (
      prevModalType == ModalType.REMOVE &&
      doneAllowance(
        activePair.allowance.LPtoken,
        activePair.userSupply.totalLP,
        addLPAllowance.status
      )
    ) {
      setModal(ModalType.NONE);
    }
  }, [addAllowanceA.status, addAllowanceB.status, addLPAllowance.status]);

  return (
    <DexModalContainer>
      <div className="content">
        <div
          style={{
            marginTop: "1rem",
          }}
        ></div>
        <div className="locked">
          <img src={lockIcon} alt="token locked" />
          <span className="icons">
            <IconPair
              iconLeft={activePair.basePairInfo.token1.icon}
              iconRight={activePair.basePairInfo.token2.icon}
            />
          </span>
        </div>
        <div className="info">
          <Text
            type="title"
            align="left"
            size="title2"
            style={{
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            {`You need to enable ${
              activePair.basePairInfo.token1.symbol +
              " / " +
              activePair.basePairInfo.token2.symbol +
              "_LP"
            }`}
          </Text>
        </div>
      </div>

      <div
        style={{
          paddingBottom: "3rem",
          width: "100%",
        }}
      >
        {prevModalType == ModalType.ADD ? (
          <div className="dual-button">
            <AddSingleAllowanceButton
              addAllowance={addAllowanceASend}
              chainId={chainId}
              tokenName={activePair.basePairInfo.token1.name}
              tokenAllowance={activePair.allowance.token1}
              state={addAllowanceA.status}
              tokenBalance={activePair.balances.token1}
            />
            <AddSingleAllowanceButton
              addAllowance={addAllowanceBSend}
              chainId={chainId}
              tokenName={activePair.basePairInfo.token2.name}
              tokenAllowance={activePair.allowance.token2}
              state={addAllowanceB.status}
              tokenBalance={activePair.balances.token2}
            />
          </div>
        ) : (
          <AddSingleAllowanceButton
            addAllowance={addLPAllowanceSend}
            chainId={chainId}
            tokenName={
              activePair.basePairInfo.token1.symbol +
              " / " +
              activePair.basePairInfo.token2.symbol +
              "_LP"
            }
            tokenAllowance={activePair.allowance.LPtoken}
            state={addLPAllowance.status}
            tokenBalance={activePair.userSupply.totalLP}
          />
        )}
      </div>
    </DexModalContainer>
  );
};

export default EnableModal;
