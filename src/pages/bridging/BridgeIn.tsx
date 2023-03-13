import styled from "@emotion/styled";
import BridgeToCanto from "./components/bridgeToCanto";
import EvmToBridge from "./components/evmToBridge";
import {
  BaseToken,
  ConvertTransaction,
  UserBridgeInToken,
} from "./config/interfaces";
import Step1TxBox from "./components/step1TxBox";
import { useBridgingTransactions } from "./hooks/useBridgingTransactions";
import { ADDRESSES } from "global/config/addresses";

interface BridgeInProps {
  ethAddress?: string;
  cantoAddress?: string;
  step2Transactions: ConvertTransaction[];
  ethGBridgeTokens: UserBridgeInToken[];
  selectedEthToken: UserBridgeInToken;
  selectEthToken: (token: BaseToken) => void;
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
      <div className="evmToBrige">
        <Step1TxBox
          fromAddress={props.ethAddress}
          toAddress={props.cantoAddress}
          bridgeIn={true}
          tokens={props.ethGBridgeTokens}
          selectedToken={props.selectedEthToken}
          selectToken={props.selectEthToken}
          tokenBalanceProp="erc20Balance"
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
          needAllowance
        />
      </div>
      <div className="bridgeToCanto">
        <BridgeToCanto
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
    </BridgeStyled>
  );
};

export const BridgeStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding: 60px 0;
  flex-grow: 1;
  width: 100%;
  position: relative;
  @media (max-width: 1000px) {
    br {
      display: none;
    }
  }
`;

export default BridgeIn;
