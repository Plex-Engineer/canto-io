import { formatUnits } from "ethers/lib/utils";
import { chain, convertFee, ibcFee, memo } from "global/config/cosmosConstants";
import { CantoMainnet } from "global/config/networks";
import { switchNetwork } from "global/utils/walletConnect/addCantoToWallet";
import {
  BridgeOutNetworkInfo,
  BridgeOutNetworks,
  BridgeOutNetworkTokenData,
} from "pages/bridge/config/gravityBridgeTokens";
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
import { txIBCTransfer } from "pages/bridge/utils/IBC/IBCTransfer";
import { convertStringToBigNumber } from "pages/bridge/utils/stringToBigNumber";
import BarIndicator from "../components/barIndicator";
import AmountPage from "../pages/amount";
import { ConfirmTransactionPage } from "../pages/confirmTxPage";
import SelectBridgeOutNetwork from "../pages/selectBridgeOutNetwork";
import SelectTokenPage from "../pages/selectToken";
import SwitchNetworkPage from "../pages/switchNetwork";
import { BridgeOutStep } from "../walkthroughTracker";

interface BridgeOutManagerProps {
  chainId: number;
  cantoAddress: string;
  currentStep: BridgeOutStep;
  canContinue: boolean;
  canGoBack: boolean;
  onPrev: () => void;
  onNext: () => void;
  currentConvertToken: UserConvertToken;
  convertTokens: UserConvertToken[];
  currentBridgeOutToken: UserNativeTokens;
  bridgeOutTokens: UserNativeTokens[];
  currentBridgeOutNetwork: BridgeOutNetworkInfo;
  bridgeOutNetworks: BridgeOutNetworkTokenData;
  setBridgeOutNetwork: (network: BridgeOutNetworks) => void;
  setToken: (token: BaseToken, type: SelectedTokens) => void;
  amount: string;
  setAmount: (amount: string) => void;
  cosmosTxStatus: BridgeTransactionStatus | undefined;
  setCosmosTxStatus: (status: BridgeTransactionStatus | undefined) => void;
}
export const BridgeOutManager = (props: BridgeOutManagerProps) => {
  return (
    <>
      {(props.currentStep === BridgeOutStep.SWITCH_TO_CANTO ||
        props.currentStep === BridgeOutStep.SWITCH_TO_CANTO_2) && (
        <SwitchNetworkPage
          toChainId={CantoMainnet.chainId}
          fromChainId={props.chainId}
          onClick={() => switchNetwork(CantoMainnet.chainId)}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeOutStep.SELECT_CONVERT_TOKEN && (
        <SelectTokenPage
          bridgeType="OUT"
          tokenList={props.convertTokens}
          activeToken={props.currentConvertToken}
          tokenBalance="erc20Balance"
          onSelect={(token) => props.setToken(token, SelectedTokens.CONVERTOUT)}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeOutStep.SELECT_CONVERT_TOKEN_AMOUNT && (
        <AmountPage
          amount={props.amount}
          setAmount={props.setAmount}
          selectedToken={props.currentConvertToken}
          max={formatUnits(
            props.currentConvertToken.erc20Balance,
            props.currentConvertToken.decimals
          )}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}

      {props.currentStep === BridgeOutStep.CONVERT_COIN && (
        <ConfirmTransactionPage
          amount={props.amount}
          token={props.currentConvertToken}
          onTxConfirm={async () =>
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
              props.setCosmosTxStatus,
              props.currentConvertToken.name,
              props.amount,
              "canto evm",
              "canto bridge"
            )
          }
          txType={"CONVERT OUT"}
          txStatus={props.cosmosTxStatus?.status}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}

      {props.currentStep === BridgeOutStep.SELECT_BRIDGE_OUT_NETWORK && (
        <SelectBridgeOutNetwork
          networks={props.bridgeOutNetworks}
          activeNetwork={props.currentBridgeOutNetwork}
          onSelect={(net) => props.setBridgeOutNetwork(net)}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeOutStep.SELECT_NATIVE_TOKEN && (
        <SelectTokenPage
          bridgeType="OUT"
          tokenList={props.bridgeOutTokens}
          activeToken={props.currentBridgeOutToken}
          tokenBalance="nativeBalance"
          onSelect={(token) => props.setToken(token, SelectedTokens.BRIDGEOUT)}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeOutStep.SELECT_NATIVE_TOKEN_AMOUNT && (
        <AmountPage
          amount={props.amount}
          setAmount={props.setAmount}
          selectedToken={props.currentBridgeOutToken}
          max={formatUnits(
            props.currentBridgeOutToken.nativeBalance,
            props.currentBridgeOutToken.decimals
          )}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeOutStep.SEND_TO_GRBIDGE && (
        <ConfirmTransactionPage
          amount={props.amount}
          token={props.currentBridgeOutToken}
          onTxConfirm={async () =>
            await performBridgeCosmosTxAndSetStatus(
              async () =>
                await txIBCTransfer(
                  props.cantoAddress,
                  props.currentBridgeOutNetwork.channel,
                  convertStringToBigNumber(
                    props.amount,
                    props.currentBridgeOutToken.decimals
                  ).toString(),
                  props.currentBridgeOutToken.nativeName,
                  CantoMainnet.cosmosAPIEndpoint,
                  props.currentBridgeOutNetwork.endpoint,
                  ibcFee,
                  chain,
                  memo
                ),
              BridgeTransactionType.BRIDGE_OUT,
              props.setCosmosTxStatus,
              props.currentBridgeOutToken.name,
              props.amount,
              "canto bridge",
              props.currentBridgeOutNetwork.name
            )
          }
          txType={"SEND TO GBRIDGE"}
          txStatus={props.cosmosTxStatus?.status}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
          canContinue={props.canContinue}
        />
      )}
      <BarIndicator
        total={Object.keys(BridgeOutStep).length / 2}
        current={props.currentStep}
      />
    </>
  );
};
