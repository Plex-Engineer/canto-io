import { BigNumber, ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { CantoMainnet, ETHMainnet } from "global/config/networks";
import { switchNetwork } from "global/utils/walletConnect/addCantoToWallet";
import {
  BaseToken,
  UserBridgeInToken,
  UserConvertToken,
} from "pages/bridging/config/interfaces";
import { BridgeTransaction } from "pages/bridging/hooks/useBridgingTransactions";
import { SelectedTokens } from "pages/bridging/stores/bridgeTokenStore";
import { convertStringToBigNumber } from "pages/bridging/utils/utils";
import { useState } from "react";
import BarIndicator from "../components/barIndicator";
import AmountPage from "../components/pages/amount";
import { CompletePage } from "../components/pages/complete";
import { ConfirmTransactionPage } from "../components/pages/confirmTxPage";
import SelectTokenPage from "../components/pages/selectToken";
import SwitchNetworkPage from "../components/pages/switchNetwork";
import { WaitForGbridge } from "../components/pages/waitForGbridge";
import { BridgeInStep } from "../config/interfaces";

interface BridgeInManagerProps {
  networkInfo: {
    chainId: number;
    cantoAddress: string;
    needPubKey: boolean;
    canPubKey: boolean;
    gravityAddress: string;
    notEnoughCantoBalance: boolean;
  };
  transactions: {
    approve: BridgeTransaction;
    sendCosmos: BridgeTransaction;
    convertIn: BridgeTransaction;
  };
  currentStep: BridgeInStep;
  canContinue: boolean;
  canGoBack: boolean;
  onPrev: () => void;
  onNext: () => void;
  currentBridgeInToken: UserBridgeInToken;
  bridgeInTokens: UserBridgeInToken[];
  setToken: (token: BaseToken, type: SelectedTokens) => void;
  currentConvertToken: UserConvertToken;
  convertTokens: UserConvertToken[];
  amount: string;
  setAmount: (amount: string) => void;
  restartWalkthrough: () => void;
}
export const BridgeInManager = (props: BridgeInManagerProps) => {
  const [hasAllowance, setHasAllowance] = useState(false);
  return (
    <>
      {props.currentStep === BridgeInStep.SWTICH_TO_ETH && (
        <SwitchNetworkPage
          toChainId={ETHMainnet.chainId}
          fromChainId={props.networkInfo.chainId}
          onClick={() => switchNetwork(ETHMainnet.chainId)}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeInStep.SELECT_ERC20_TOKEN && (
        <SelectTokenPage
          bridgeType="IN"
          tokenList={props.bridgeInTokens}
          activeToken={props.currentBridgeInToken}
          tokenBalance="balanceOf"
          onSelect={(token) => props.setToken(token, SelectedTokens.ETHTOKEN)}
          canContinue={props.canContinue}
          onNext={() => {
            props.onNext();
            if (
              props.currentBridgeInToken.erc20Balance.gt(
                props.currentBridgeInToken.allowance
              )
            )
              setHasAllowance(false);
          }}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep == BridgeInStep.NEED_ALLOWANCE && !hasAllowance && (
        <ConfirmTransactionPage
          amount=""
          notEnoughCantoBalance={false}
          token={props.currentBridgeInToken}
          onTxConfirm={() =>
            props.transactions.approve.send(
              BigNumber.from(ethers.constants.MaxUint256)
            )
          }
          txType={"Enable Token"}
          txShortDesc={`enable ${props.currentBridgeInToken.name}`}
          txCompletedDesc={"this token has been enabled, you may continue"}
          txStatus={props.transactions.approve.state}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeInStep.SELECT_ERC20_AMOUNT && (
        <AmountPage
          amount={props.amount}
          setAmount={props.setAmount}
          selectedToken={props.currentBridgeInToken}
          max={formatUnits(
            props.currentBridgeInToken.erc20Balance,
            props.currentBridgeInToken.decimals
          )}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeInStep.SEND_FUNDS_TO_GBRIDGE && (
        <ConfirmTransactionPage
          amount={props.amount}
          notEnoughCantoBalance={false}
          token={props.currentBridgeInToken}
          onTxConfirm={() => {
            if (
              !(
                props.networkInfo.cantoAddress == undefined ||
                props.networkInfo.cantoAddress.slice(0, 5) != "canto"
              )
            ) {
              props.transactions.sendCosmos.send(
                convertStringToBigNumber(
                  props.amount,
                  props.currentBridgeInToken.decimals
                )
              );
            }
          }}
          txStatus={props.transactions.sendCosmos.state}
          txShortDesc={`send ${props.amount} ${props.currentBridgeInToken.name}`}
          txType={"Ethereum -> Canto Bridge"}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canContinue={props.canContinue}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeInStep.WAIT_FOR_GRBIDGE && (
        <WaitForGbridge
          onNext={props.onNext}
          onPrev={props.onPrev}
          canContinue={props.canContinue}
          txHash={""}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeInStep.SWITCH_TO_CANTO && (
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
      {props.currentStep === BridgeInStep.SELECT_CONVERT_TOKEN && (
        <SelectTokenPage
          bridgeType="IN"
          tokenList={props.convertTokens}
          activeToken={props.currentConvertToken}
          tokenBalance="nativeBalance"
          onSelect={(token) => props.setToken(token, SelectedTokens.CONVERTIN)}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeInStep.CONVERT && (
        <ConfirmTransactionPage
          amount={props.amount}
          notEnoughCantoBalance={props.networkInfo.notEnoughCantoBalance}
          token={props.currentConvertToken}
          onTxConfirm={() => {
            props.transactions.convertIn.send(
              convertStringToBigNumber(
                props.amount,
                props.currentConvertToken.decimals
              ).toString()
            );
          }}
          txType={"Canto Bridge -> Canto EVM"}
          txShortDesc={`send ${props.amount} ${props.currentConvertToken.name}`}
          txStatus={props.transactions.convertIn.state}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canContinue={props.canContinue}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeInStep.COMPLETE && (
        <CompletePage bridgeIn={true} restart={props.restartWalkthrough} />
      )}

      <BarIndicator
        stepAt={6}
        total={Object.keys(BridgeInStep).length / 2}
        current={props.currentStep}
      />
    </>
  );
};
