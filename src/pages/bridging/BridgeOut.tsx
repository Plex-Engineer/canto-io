import { BridgeStyled } from "./BridgeIn";
import Step1TxBox from "./components/step1TxBox";
import {
  BaseToken,
  ConvertTransaction,
  UserConvertToken,
} from "./config/interfaces";

interface BridgeOutProps {
  ethAddress?: string;
  cantoAddress?: string;
  step2Transactions: ConvertTransaction[];
  convertTokens: UserConvertToken[];
  selectedConvertToken: UserConvertToken;
  selectToken: (token: BaseToken) => void;
}
const BridgeOut = (props: BridgeOutProps) => {
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
        />
      </div>
    </BridgeStyled>
  );
};

export default BridgeOut;
