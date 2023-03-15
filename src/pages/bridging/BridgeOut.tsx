import { BridgeStyled } from "./BridgeIn";
import Step1TxBox from "./components/step1TxBox";
import Step2TxBox from "./components/step2TxBox";
import { NativeTransaction, UserERC20BridgeToken } from "./config/interfaces";
import { useBridgingTransactions } from "./hooks/useBridgingTransactions";

interface BridgeOutProps {
  ethAddress?: string;
  cantoAddress?: string;
  bridgeOutTokens: UserERC20BridgeToken[];
  selectedBridgeOutToken: UserERC20BridgeToken;
  selectToken: (token: UserERC20BridgeToken) => void;
  step2Transactions: NativeTransaction[];
}
const BridgeOut = (props: BridgeOutProps) => {
  const transactionHooks = useBridgingTransactions();

  return (
    <BridgeStyled>
      <div className="evmToBrige">
        <Step1TxBox
          fromAddress={props.ethAddress}
          toAddress={props.cantoAddress}
          bridgeIn={false}
          tokens={props.bridgeOutTokens}
          selectedToken={props.selectedBridgeOutToken}
          selectToken={props.selectToken}
          txHook={() =>
            transactionHooks.convertCoin.convertTx(
              props.selectedBridgeOutToken.address,
              props.cantoAddress ?? "",
              false
            )
          }
        />
      </div>
      <div className="bridgeToCanto">
        <Step2TxBox
          bridgeIn={false}
          transactions={props.step2Transactions}
          txHook={(tokenName) => transactionHooks.bridgeOut.ibcOut(tokenName)}
          cantoAddress={props.cantoAddress ?? ""}
          ethAddress={props.ethAddress ?? ""}
        />
      </div>
    </BridgeStyled>
  );
};

export default BridgeOut;
