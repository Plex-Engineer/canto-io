import { TransactionStatus } from "@usedapp/core";
import { BigNumber, ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { chain, convertFee, memo } from "global/config/cosmosConstants";
import { CantoMainnet } from "global/config/networks";
import { switchNetwork } from "global/utils/walletConnect/addCantoToWallet";
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
import BarIndicator from "../components/barIndicator";
import AmountPage from "../pages/amount";
import { CompletePage } from "../pages/complete";
import { ConfirmTransactionPage } from "../pages/confirmTxPage";
import SelectTokenPage from "../pages/selectToken";
import SwitchNetworkPage from "../pages/switchNetwork";
import { WaitForGbridge } from "../pages/waitForGbridge";
import { BridgeInStep } from "../walkthroughTracker";

interface BridgeInManagerProps {
  chainId: number;
  cantoAddress: string;
  currentStep: BridgeInStep;
  canContinue: boolean;
  canGoBack: boolean;
  onPrev: () => void;
  onNext: () => void;
  currentBridgeInToken: UserGravityBridgeTokens;
  bridgeInTokens: UserGravityBridgeTokens[];
  setToken: (token: BaseToken, type: SelectedTokens) => void;
  sendApprove: (gravityAddress: string, amount: BigNumber) => void;
  stateApprove: TransactionStatus;
  gravityAddress: string;
  sendCosmos: (
    tokenAddress: string,
    cantoAddress: string,
    amount: BigNumber
  ) => void;
  stateCosmos: TransactionStatus;
  currentConvertToken: UserConvertToken;
  convertTokens: UserConvertToken[];
  amount: string;
  setAmount: (amount: string) => void;
  cosmosTxStatus: BridgeTransactionStatus | undefined;
  setCosmosTxStatus: (status: BridgeTransactionStatus | undefined) => void;
  restartWalkthrough: () => void;
}
export const BridgeInManager = (props: BridgeInManagerProps) => {
  return (
    <>
      {props.currentStep === BridgeInStep.SWTICH_TO_ETH && (
        <SwitchNetworkPage
          toChainId={ETHMainnet.chainId}
          fromChainId={props.chainId}
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
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep == BridgeInStep.NEED_ALLOWANCE && (
        <ConfirmTransactionPage
          amount=""
          token={props.currentBridgeInToken}
          onTxConfirm={() =>
            props.sendApprove(
              props.gravityAddress,
              BigNumber.from(ethers.constants.MaxUint256)
            )
          }
          txType={"Enable Token"}
          txShortDesc={`enable ${props.currentBridgeInToken.name}`}
          txStatus={props.stateApprove.status}
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
            props.currentBridgeInToken.balanceOf,
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
          token={props.currentBridgeInToken}
          onTxConfirm={() =>
            props.sendCosmos(
              props.currentBridgeInToken.address,
              props.cantoAddress,
              convertStringToBigNumber(
                props.amount,
                props.currentBridgeInToken.decimals
              )
            )
          }
          txStatus={props.stateCosmos.status}
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
          txHash={props.stateCosmos.transaction?.hash}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeInStep.SWITCH_TO_CANTO && (
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
      {props.currentStep === BridgeInStep.SELECT_CONVERT_TOKEN_AMOUNT && (
        <AmountPage
          amount={props.amount}
          setAmount={props.setAmount}
          selectedToken={props.currentConvertToken}
          max={formatUnits(
            props.currentConvertToken.nativeBalance,
            props.currentConvertToken.decimals
          )}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeInStep.CONVERT && (
        <ConfirmTransactionPage
          amount={props.amount}
          token={props.currentConvertToken}
          onTxConfirm={async () =>
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
              props.setCosmosTxStatus,
              props.currentConvertToken.name,
              props.amount,
              "canto bridge",
              "canto evm"
            )
          }
          txType={"Canto Bridge -> Canto EVM"}
          txShortDesc={`send ${props.amount} ${props.currentConvertToken.name}`}
          txStatus={props.cosmosTxStatus?.status}
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
