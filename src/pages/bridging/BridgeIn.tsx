import styled from "@emotion/styled";
import Step2TxBox from "./components/step2TxBox";
import { NativeTransaction, UserERC20BridgeToken } from "./config/interfaces";
import Step1TxBox from "./components/step1TxBox";
import { useBridgingTransactions } from "./hooks/useBridgingTransactions";
import { ADDRESSES } from "global/config/addresses";
import QBox from "./components/QBox";
import QBoxList from "./components/QBoxList";

interface BridgeInProps {
  ethAddress?: string;
  cantoAddress?: string;
  ethGBridgeTokens: UserERC20BridgeToken[];
  selectedEthToken: UserERC20BridgeToken;
  selectEthToken: (token: UserERC20BridgeToken) => void;
  step2Transactions: NativeTransaction[];
}
const BridgeIn = (props: BridgeInProps) => {
  const transactionHooks = useBridgingTransactions();
  const selectedToken = props.selectedEthToken;
  const needAllowance =
    selectedToken.symbol !== "choose token" &&
    (selectedToken.allowance.lt(selectedToken.erc20Balance) ||
      selectedToken.allowance.isZero());
  return (
    <BridgeStyled>
      <div className="left">
        <QBoxList />
      </div>
      <div className="center">
        <Step1TxBox
          fromAddress={props.ethAddress}
          toAddress={props.cantoAddress}
          bridgeIn={true}
          tokens={props.ethGBridgeTokens}
          selectedToken={props.selectedEthToken}
          selectToken={props.selectEthToken}
          txHook={() => {
            if (needAllowance) {
              return transactionHooks.bridgeIn.approveToken(
                selectedToken.address
              );
            }
            return transactionHooks.bridgeIn.sendToCosmos(
              ADDRESSES.ETHMainnet.GravityBridge,
              selectedToken.address,
              props.cantoAddress ?? ""
            );
          }}
        />
        <Step2TxBox
          bridgeIn
          transactions={props.step2Transactions}
          txHook={(tokenName: string) =>
            transactionHooks.convertCoin.convertTx(
              tokenName,
              props.cantoAddress ?? "",
              true
            )
          }
          cantoAddress={props.cantoAddress ?? ""}
          ethAddress={props.ethAddress ?? ""}
        />
      </div>
      <div className="right"></div>
    </BridgeStyled>
  );
};

export const BridgeStyled = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  width: 100%;
  position: relative;
  & > * {
    width: 100%;
  }

  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    padding: 60px 0;
    flex-grow: 1;
    width: 100%;
    position: relative;
  }
  @media (max-width: 1000px) {
    br {
      display: none;
    }
  }
`;

export default BridgeIn;
