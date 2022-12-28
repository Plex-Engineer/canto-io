import { TransactionStatus } from "@usedapp/core";
import { formatUnits } from "ethers/lib/utils";
import { chain, convertFee, memo } from "global/config/cosmosConstants";
import { CantoMainnet } from "global/config/networks";
import {
  BaseToken,
  BridgeTransactionType,
  UserConvertToken,
  UserGravityBridgeTokens,
} from "pages/bridge/config/interfaces";
import { ETHMainnet } from "pages/bridge/config/networks";
import { SelectedTokens } from "pages/bridge/stores/tokenStore";
import { BridgeTransactionStatus } from "pages/bridge/stores/transactionStore";
import { performBridgeCosmosTxAndSetStatus } from "pages/bridge/utils/bridgeCosmosTxUtils";
import { txConvertCoin } from "pages/bridge/utils/convertCoin/convertTransactions";
import { convertStringToBigNumber } from "pages/bridge/utils/stringToBigNumber";
import { BridgeInStep } from "../../walkthroughTracker";
import { AmountSelect } from "../amountSelect";
import { ConfirmConvert } from "../confirmConvert";
import { SelectToken } from "../selectToken";
import { SwitchNetwork } from "../switchNetwork";
import { NeedAllowancePage } from "./needAllowance";

interface BridgeInWalkthroughProps {
  skipToWalkthroughStep: (step: BridgeInStep) => void;
  cantoAddress: string;
  currentStep: BridgeInStep;
  bridgeInTokens: UserGravityBridgeTokens[];
  currentBridgeToken: UserGravityBridgeTokens;
  sendApprove: () => void;
  stateApprove: TransactionStatus;
  sendCosmos: () => void;
  stateCosmos: TransactionStatus;
  convertTokens: UserConvertToken[];
  currentConvertToken: UserConvertToken;
  selectToken: (token: BaseToken, from: SelectedTokens) => void;
  amount: string;
  setAmount: (amount: string) => void;
  txMessage: React.ReactNode;
  setTxStatus: (status: BridgeTransactionStatus | undefined) => void;
}
export const BridgeInWalkthroughManager = (props: BridgeInWalkthroughProps) => {
  return (
    <div>
      <h1>Bridge In Start</h1>
      {props.currentStep === BridgeInStep.SWTICH_TO_ETH && (
        <SwitchNetwork chainId={ETHMainnet.chainId} />
      )}
      {props.currentStep === BridgeInStep.SELECT_ERC20_TOKEN && (
        <SelectToken
          tokenList={props.bridgeInTokens}
          activeToken={props.currentBridgeToken}
          onSelect={(token) =>
            props.selectToken(token, SelectedTokens.ETHTOKEN)
          }
          tokenBalance="balanceOf"
        />
      )}
      {props.currentStep == BridgeInStep.NEED_ALLOWANCE && (
        <NeedAllowancePage
          skipStep={() =>
            props.skipToWalkthroughStep(BridgeInStep.SELECT_ERC20_AMOUNT)
          }
          token={props.currentBridgeToken}
          txMessage={props.currentBridgeToken.name}
          allowTx={props.sendApprove}
        />
      )}
      {props.currentStep === BridgeInStep.SELECT_ERC20_AMOUNT && (
        <AmountSelect
          amount={props.amount}
          onChange={props.setAmount}
          max={formatUnits(
            props.currentBridgeToken.balanceOf,
            props.currentBridgeToken.decimals
          )}
        />
      )}
      {props.currentStep === BridgeInStep.SEND_FUNDS_TO_GBRIDGE && (
        <ConfirmConvert
          amount={convertStringToBigNumber(
            props.amount,
            props.currentBridgeToken.decimals
          )}
          token={props.currentBridgeToken}
          convertTx={props.sendCosmos}
        />
      )}
      {props.currentStep === BridgeInStep.WAIT_FOR_GRBIDGE && (
        <h1>Wait for gBridge</h1>
      )}
      {props.currentStep === BridgeInStep.SWITCH_TO_CANTO && (
        <SwitchNetwork chainId={CantoMainnet.chainId} />
      )}
      {props.currentStep === BridgeInStep.SELECT_CONVERT_TOKEN && (
        <SelectToken
          tokenList={props.convertTokens}
          activeToken={props.currentConvertToken}
          onSelect={(token) =>
            props.selectToken(token, SelectedTokens.CONVERTIN)
          }
          tokenBalance="nativeBalance"
        />
      )}
      {props.currentStep === BridgeInStep.SELECT_CONVERT_TOKEN_AMOUNT && (
        <AmountSelect
          amount={props.amount}
          onChange={props.setAmount}
          max={formatUnits(
            props.currentConvertToken.nativeBalance,
            props.currentConvertToken.decimals
          )}
        />
      )}
      {props.currentStep === BridgeInStep.CONVERT && (
        <ConfirmConvert
          amount={convertStringToBigNumber(
            props.amount,
            props.currentConvertToken.decimals
          )}
          token={props.currentConvertToken}
          convertTx={async () =>
            await performBridgeCosmosTxAndSetStatus(
              async () =>
                await txConvertCoin(
                  props.cantoAddress,
                  props.currentConvertToken.nativeName,
                  convertStringToBigNumber(
                    props.amount,
                    props.currentConvertToken.decimals
                  ).toString(),
                  CantoMainnet.cosmosAPIEndpoint,
                  convertFee,
                  chain,
                  memo
                ),
              BridgeTransactionType.CONVERT_IN,
              props.setTxStatus,
              props.currentConvertToken.name,
              props.amount,
              "canto bridge",
              "canto evm"
            )
          }
          txMessage={props.txMessage}
        />
      )}
    </div>
  );
};
