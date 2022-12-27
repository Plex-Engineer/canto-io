import { formatUnits } from "ethers/lib/utils";
import cantoIcon from "assets/icons/canto-evm.svg";
import { chain, convertFee, ibcFee, memo } from "global/config/cosmosConstants";
import { CantoMainnet } from "global/config/networks";
import SwitchBridging from "pages/bridge/components/SwitchBridging";
import { BridgeOutNetworkInfo } from "pages/bridge/config/gravityBridgeTokens";
import {
  BaseToken,
  BridgeTransactionType,
  UserConvertToken,
  UserNativeTokens,
} from "pages/bridge/config/interfaces";
import { SelectedTokens } from "pages/bridge/stores/tokenStore";
import { BridgeTransactionStatus } from "pages/bridge/stores/transactionStore";
import { performBridgeCosmosTxAndSetStatus } from "pages/bridge/utils/bridgeCosmosTxUtils";
import { txConvertERC20 } from "pages/bridge/utils/convertCoin/convertTransactions";
import { convertStringToBigNumber } from "pages/bridge/utils/stringToBigNumber";
import { BridgeOutStep } from "../../walkthroughTracker";
import { AmountSelect } from "../amountSelect";
import { ConfirmConvert } from "../confirmConvert";
import { SelectToken } from "../selectToken";
import { SwitchNetwork } from "../switchNetwork";
import { txIBCTransfer } from "pages/bridge/utils/IBC/IBCTransfer";

interface BridgeOutWalkthroughProps {
  cantoAddress: string;
  currentStep: BridgeOutStep;
  convertTokens: UserConvertToken[];
  currentConvertToken: UserConvertToken;
  bridgeOutNetwork: BridgeOutNetworkInfo;
  bridgeOutTokens: UserNativeTokens[];
  currentBridgeOutToken: UserNativeTokens;
  selectToken: (token: BaseToken, from: SelectedTokens) => void;
  amount: string;
  setAmount: (amount: string) => void;
  txMessage: React.ReactNode;
  setTxStatus: (status: BridgeTransactionStatus | undefined) => void;
}
export const BridgeOutWalkthroughManager = (
  props: BridgeOutWalkthroughProps
) => {
  return (
    <div>
      <h1>Bridge Out Start</h1>
      <p>current step: {props.currentStep}</p>
      {props.currentStep === BridgeOutStep.SWITCH_TO_CANTO && (
        <SwitchNetwork chainId={CantoMainnet.chainId} />
      )}
      {props.currentStep === BridgeOutStep.SELECT_CONVERT_TOKEN && (
        <SelectToken
          tokenList={props.convertTokens}
          activeToken={props.currentConvertToken}
          onSelect={(token) =>
            props.selectToken(token, SelectedTokens.CONVERTOUT)
          }
          tokenBalance="erc20Balance"
        />
      )}
      {props.currentStep === BridgeOutStep.SELECT_CONVERT_TOKEN_AMOUNT && (
        <AmountSelect
          amount={props.amount}
          onChange={props.setAmount}
          max={formatUnits(
            props.currentConvertToken.erc20Balance,
            props.currentConvertToken.decimals
          )}
        />
      )}
      {props.currentStep === BridgeOutStep.CONVERT_COIN && (
        <ConfirmConvert
          amount={convertStringToBigNumber(
            props.amount,
            props.currentConvertToken.decimals
          )}
          token={props.currentConvertToken}
          toERC20={false}
          convertTx={async () =>
            await performBridgeCosmosTxAndSetStatus(
              async () =>
                await txConvertERC20(
                  props.currentConvertToken.address,
                  convertStringToBigNumber(
                    props.amount,
                    props.currentConvertToken.decimals
                  ).toString(),
                  props.cantoAddress,
                  CantoMainnet.cosmosAPIEndpoint,
                  convertFee,
                  chain,
                  memo
                ),
              BridgeTransactionType.CONVERT_OUT,
              props.setTxStatus,
              props.currentConvertToken.name,
              props.amount,
              "canto evm",
              "canto bridge"
            )
          }
          txMessage={props.txMessage}
        />
      )}
      {props.currentStep === BridgeOutStep.SELECT_BRIDGE_OUT_NETWORK && (
        <SwitchBridging
          left={{ icon: cantoIcon, name: "EVM" }}
          right={{
            icon: props.bridgeOutNetwork.icon,
            name: props.bridgeOutNetwork.name,
            height: 48,
            selectable: true,
          }}
        />
      )}
      {props.currentStep === BridgeOutStep.SELECT_NATIVE_TOKEN && (
        <SelectToken
          tokenList={props.bridgeOutTokens}
          activeToken={props.currentBridgeOutToken}
          onSelect={(token) =>
            props.selectToken(token, SelectedTokens.BRIDGEOUT)
          }
          tokenBalance="nativeBalance"
        />
      )}
      {props.currentStep === BridgeOutStep.SELECT_NATIVE_TOKEN_AMOUNT && (
        <AmountSelect
          amount={props.amount}
          onChange={props.setAmount}
          max={formatUnits(
            props.currentBridgeOutToken.nativeBalance,
            props.currentBridgeOutToken.decimals
          )}
        />
      )}
      {props.currentStep === BridgeOutStep.SEND_TO_GRBIDGE && (
        <ConfirmConvert
          amount={convertStringToBigNumber(
            props.amount,
            props.currentBridgeOutToken.decimals
          )}
          token={props.currentBridgeOutToken}
          toERC20={false}
          convertTx={async () =>
            await performBridgeCosmosTxAndSetStatus(
              async () =>
                await txIBCTransfer(
                  props.cantoAddress,
                  props.bridgeOutNetwork.channel,
                  convertStringToBigNumber(
                    props.amount,
                    props.currentBridgeOutToken.decimals
                  ).toString(),
                  props.currentBridgeOutToken.nativeName,
                  CantoMainnet.cosmosAPIEndpoint,
                  props.bridgeOutNetwork.endpoint,
                  ibcFee,
                  chain,
                  memo
                ),
              BridgeTransactionType.BRIDGE_OUT,
              props.setTxStatus,
              props.currentBridgeOutToken.name,
              props.amount,
              "canto bridge",
              props.bridgeOutNetwork.name
            )
          }
          txMessage={props.txMessage}
        />
      )}
    </div>
  );
};
