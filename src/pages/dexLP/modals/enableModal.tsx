import IconPair from "../components/iconPair";
import useModals, { ModalType } from "../hooks/useModals";
import { getRouterAddress, useSetAllowance } from "../hooks/useTransactions";
import { UserLPPairInfo } from "../config/interfaces";
import { PrimaryButton, Text } from "global/packages/src";
import {
  getEnableButtonTextAndOnClick,
  getEnableTokenText,
} from "../utils/modalButtonParams";
import { DexModalContainer } from "../components/Styled";
import GlobalLoadingModal from "global/components/modals/loadingModal";
import { CantoTransactionType } from "global/config/transactionTypes";
import lockIcon from "assets/icons/lock.svg";
import { BigNumber } from "ethers";

interface AddAllowanceProps {
  pair: UserLPPairInfo;
  chainId: number | undefined;
  addAllowance1: (router: string, amount: string) => void;
  addAllowance2: (router: string, amount: string) => void;
}

interface AddSingleAllowanceProps {
  tokenName: string;
  tokenAllowance: BigNumber;
  chainId: number | undefined;
  addAllowance: (router: string, amount: string) => void;
}
const AddAllowanceButton = (props: AddAllowanceProps) => {
  const routerAddress = getRouterAddress(props.chainId);
  const [buttonText, buttonOnclick] = getEnableButtonTextAndOnClick(
    props.pair.basePairInfo.token1.symbol,
    props.pair.basePairInfo.token2.symbol,
    props.pair.allowance.token1,
    props.pair.allowance.token2,
    () =>
      props.addAllowance1(
        routerAddress,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      ),
    () =>
      props.addAllowance2(
        routerAddress,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      )
  );
  return (
    <PrimaryButton onClick={buttonOnclick} filled height={"big"}>
      <Text color="dark" bold>
        {buttonText}
      </Text>
    </PrimaryButton>
  );
};

const AddSingleAllowanceButton = (props: AddSingleAllowanceProps) => {
  const routerAddress = getRouterAddress(props.chainId);

  return (
    <PrimaryButton
      disabled={props.tokenAllowance.gt(0)}
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
        enable {props.tokenName}
      </Text>
    </PrimaryButton>
  );
};

const RemoveAllowanceButton = (props: AddAllowanceProps) => {
  const routerAddress = getRouterAddress(props.chainId);
  return (
    <PrimaryButton
      onClick={() => {
        props.addAllowance1(
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

const EnableModal = ({ activePair, chainId, onClose }: Props) => {
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
  const isTokenPair = getEnableTokenText(
    activePair.basePairInfo.token1.symbol,
    activePair.basePairInfo.token2.symbol,
    activePair.allowance.token1,
    activePair.allowance.token2
  ).includes("/");

  return (
    <DexModalContainer>
      {addAllowanceA.status != "None" && (
        <GlobalLoadingModal
          transactionType={CantoTransactionType.ENABLE}
          status={addAllowanceA.status}
          tokenName={
            activePair.basePairInfo.token1.symbol +
            " / " +
            activePair.basePairInfo.token2.symbol
          }
          txHash={addAllowanceA.transaction?.hash}
          onClose={onClose}
          mixPanelEventInfo={{
            tokenName:
              activePair.basePairInfo.token1.symbol +
              " / " +
              activePair.basePairInfo.token2.symbol,
          }}
        />
      )}
      {addAllowanceB.status != "None" && (
        <GlobalLoadingModal
          transactionType={CantoTransactionType.ENABLE}
          status={addAllowanceB.status}
          tokenName={
            activePair.basePairInfo.token1.symbol +
            " / " +
            activePair.basePairInfo.token2.symbol
          }
          txHash={addAllowanceB.transaction?.hash}
          onClose={onClose}
          mixPanelEventInfo={{
            tokenName:
              activePair.basePairInfo.token1.symbol +
              " / " +
              activePair.basePairInfo.token2.symbol,
          }}
        />
      )}
      {addLPAllowance.status != "None" && (
        <GlobalLoadingModal
          transactionType={CantoTransactionType.ENABLE}
          status={addLPAllowance.status}
          tokenName={
            activePair.basePairInfo.token1.symbol +
            " / " +
            activePair.basePairInfo.token2.symbol
          }
          txHash={addLPAllowance.transaction?.hash}
          onClose={onClose}
          mixPanelEventInfo={{
            tokenName:
              activePair.basePairInfo.token1.symbol +
              " / " +
              activePair.basePairInfo.token2.symbol,
          }}
        />
      )}

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
            {`You need to ${getEnableTokenText(
              activePair.basePairInfo.token1.symbol,
              activePair.basePairInfo.token2.symbol,
              activePair.allowance.token1,
              activePair.allowance.token2
            )}`}
          </Text>

          <Text
            type="text"
            align="left"
            size="text2"
            style={{
              textAlign: "center",
            }}
          >
            LP needs two tokens to be enabled, which means it’ll trigger two
            transactions
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
            />
            <AddSingleAllowanceButton
              tokenName={activePair.basePairInfo.token2.name}
              tokenAllowance={activePair.allowance.token2}
              chainId={chainId}
              addAllowance={addAllowanceBSend}
            />
          </div>
        ) : (
          <RemoveAllowanceButton
            pair={activePair}
            chainId={chainId}
            addAllowance1={addLPAllowanceSend}
            addAllowance2={addAllowanceASend}
          />
        )}
      </div>
    </DexModalContainer>
  );
};

export default EnableModal;
