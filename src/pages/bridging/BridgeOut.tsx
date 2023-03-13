import { BridgeStyled } from "./BridgeIn";
import IBCOut from "./components/ibcOut";
import Step1TxBox from "./components/step1TxBox";
import {
  BaseToken,
  ConvertTransaction,
  UserConvertToken,
} from "./config/interfaces";
import { useBridgingTransactions } from "./hooks/useBridgingTransactions";

interface BridgeOutProps {
  ethAddress?: string;
  cantoAddress?: string;
  step2Transactions: ConvertTransaction[];
  convertTokens: UserConvertToken[];
  selectedConvertToken: UserConvertToken;
  selectToken: (token: BaseToken) => void;
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
          tokens={props.convertTokens}
          selectedToken={props.selectedConvertToken}
          selectToken={props.selectToken}
          tokenBalanceProp="erc20Balance"
          txHook={() =>
            transactionHooks.convertCoin.convertTx(
              props.selectedConvertToken.address,
              props.cantoAddress ?? "",
              false
            )
          }
          needAllowance={false}
        />
      </div>
      <div className="bridgeToCanto">
        <IBCOut
          transactions={props.step2Transactions}
          txHook={(tokenName, cosmosAddress, bridgeOutNetwork) =>
            transactionHooks.bridgeOut.ibcOut(
              tokenName,
              cosmosAddress,
              bridgeOutNetwork
            )
          }
        />
      </div>
    </BridgeStyled>
  );
};

export default BridgeOut;
