import { formatUnits } from "ethers/lib/utils";
import { CantoMainnet } from "global/config/networks";
import { switchNetwork } from "global/utils/walletConnect/addCantoToWallet";
import BarIndicator from "../components/barIndicator";
import AmountPage from "../components/pages/amount";
import { CompletePage } from "../components/pages/complete";
import { ConfirmTransactionPage } from "../components/pages/confirmTxPage";
import SelectTokenPage from "../components/pages/selectToken";
import SwitchNetworkPage from "../components/pages/switchNetwork";
import { BridgeTransaction } from "pages/bridging/walkthrough/hooks/useBridgingTransactions";
import { BridgeOutStep } from "../config/interfacesSteps";
import {
  BridgeOutNetworkInfo,
  CantoMainBridgeOutNetworks,
  UserERC20BridgeToken,
  UserNativeToken,
} from "pages/bridging/walkthrough/config/interfaces";
import { convertStringToBigNumber } from "global/utils/formattingNumbers";
import SelectBridgeOutNetwork from "../components/pages/selectBridgeOutNetwork";
import { WalkthroughSelectedTokens } from "../store/customUseWalkthrough";

interface BridgeOutManagerProps {
  networkInfo: {
    chainId: number;
    cantoAddress: string;
    needPubKey: boolean;
    canPubKey: boolean;
    gravityAddress: string;
    notEnoughCantoBalance: boolean;
  };
  transactions: {
    convertOut: BridgeTransaction;
    ibcOut: BridgeTransaction;
  };
  userInputs: {
    amount: string;
    setAmount: (amount: string) => void;
    address: string;
    setAddress: (s: string) => void;
    selectedNetwork: BridgeOutNetworkInfo;
    setNetwork: (network: CantoMainBridgeOutNetworks) => void;
  };
  currentStep: BridgeOutStep;
  canContinue: boolean;
  canGoBack: boolean;
  onPrev: () => void;
  onNext: () => void;
  currentConvertToken: UserERC20BridgeToken;
  convertTokens: UserERC20BridgeToken[];
  currentBridgeOutToken: UserNativeToken;
  bridgeOutTokens: UserNativeToken[];
  setToken: (token: string, type: WalkthroughSelectedTokens) => void;
  restartWalkthrough: () => void;
}
export const BridgeOutManager = (props: BridgeOutManagerProps) => {
  return (
    <>
      {(props.currentStep === BridgeOutStep.SWITCH_TO_CANTO ||
        props.currentStep === BridgeOutStep.SWITCH_TO_CANTO_2) && (
        <SwitchNetworkPage
          toChainId={CantoMainnet.chainId}
          fromChainId={props.networkInfo.chainId}
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
          balanceString="erc20Balance"
          onSelect={(token) =>
            props.setToken(token.address, WalkthroughSelectedTokens.CONVERT_OUT)
          }
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeOutStep.SELECT_CONVERT_TOKEN_AMOUNT && (
        <AmountPage
          amount={props.userInputs.amount}
          setAmount={props.userInputs.setAmount}
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
          amount={props.userInputs.amount}
          notEnoughCantoBalance={props.networkInfo.notEnoughCantoBalance}
          token={props.currentConvertToken}
          onTxConfirm={() => {
            props.transactions.convertOut.send(
              convertStringToBigNumber(
                props.userInputs.amount,
                props.currentConvertToken.decimals
              ).toString()
            );
          }}
          txType={"Canto EVM -> Canto Bridge"}
          txShortDesc={`send ${props.userInputs.amount} ${props.currentConvertToken.name}`}
          txStatus={props.transactions.convertOut.state}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}

      {props.currentStep === BridgeOutStep.SELECT_BRIDGE_OUT_NETWORK && (
        <SelectBridgeOutNetwork
          activeNetwork={props.userInputs.selectedNetwork}
          onSelect={(net) => props.userInputs.setNetwork(net)}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
          userCosmosSend={{
            setAddress: props.userInputs.setAddress,
            address: props.userInputs.address,
          }}
        />
      )}
      {props.currentStep === BridgeOutStep.SELECT_NATIVE_TOKEN && (
        <SelectTokenPage
          bridgeType="OUT"
          tokenList={props.bridgeOutTokens}
          activeToken={props.currentBridgeOutToken}
          balanceString="nativeBalance"
          onSelect={(token) =>
            props.setToken(token.address, WalkthroughSelectedTokens.BRIDGE_OUT)
          }
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeOutStep.SEND_TO_GRBIDGE && (
        <ConfirmTransactionPage
          amount={props.userInputs.amount}
          notEnoughCantoBalance={props.networkInfo.notEnoughCantoBalance}
          token={props.currentBridgeOutToken}
          onTxConfirm={() => {
            props.transactions.ibcOut.send(
              convertStringToBigNumber(
                props.userInputs.amount,
                props.currentBridgeOutToken.decimals
              ).toString(),
              props.userInputs.address,
              props.userInputs.selectedNetwork
            );
          }}
          txType={"Canto Bridge -> " + props.userInputs.selectedNetwork.name}
          txShortDesc={`send ${props.userInputs.amount} ${props.currentBridgeOutToken.name} to ${props.userInputs.address}`}
          txStatus={props.transactions.ibcOut.state}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
          canContinue={props.canContinue}
        />
      )}
      {props.currentStep === BridgeOutStep.COMPLETE && (
        <CompletePage bridgeIn={false} restart={props.restartWalkthrough} />
      )}

      <BarIndicator
        stepAt={4}
        total={Object.keys(BridgeOutStep).length / 2}
        current={props.currentStep}
      />
    </>
  );
};
