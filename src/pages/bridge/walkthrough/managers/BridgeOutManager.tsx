import { useEthers } from "@usedapp/core";
import { formatUnits } from "ethers/lib/utils";
import { CantoMainnet } from "global/config/networks";
import {
  BaseToken,
  UserConvertToken,
  UserNativeTokens,
} from "pages/bridge/config/interfaces";
import { SelectedTokens, useTokenStore } from "pages/bridge/stores/tokenStore";
import { useEffect, useState } from "react";
import AmountPage from "../pages/amount";
import SelectTokenPage from "../pages/selectToken";
import SwitchNetworkPage from "../pages/switchNetwork";
import { BridgeOutStep } from "../walkthroughTracker";

interface BridgeOutManagerProps {
  chainId: number;
  currentStep: BridgeOutStep;
  canContinue: boolean;
  onPrev: () => void;
  onNext: () => void;
  currentConvertToken: UserConvertToken;
  convertTokens: UserConvertToken[];
  currentBridgeOutToken: UserNativeTokens;
  bridgeOutTokens: UserNativeTokens[];
  setToken: (token: BaseToken, type: SelectedTokens) => void;
  amount: string;
  setAmount: (amount: string) => void;
}
export const BridgeOutManager = (props: BridgeOutManagerProps) => {
  const { switchNetwork } = useEthers();
  const [selectedToken, setSelectedToken] = useState<BaseToken>();

  useEffect(() => {
    console.log(selectedToken);
  }, [selectedToken]);
  return (
    <div>
      {(props.currentStep === BridgeOutStep.SWITCH_TO_CANTO ||
        props.currentStep === BridgeOutStep.SWITCH_TO_CANTO_2) && (
        <SwitchNetworkPage
          toChainId={CantoMainnet.chainId}
          fromChainId={props.chainId}
          onClick={() => switchNetwork(CantoMainnet.chainId)}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
        />
      )}
      {props.currentStep === BridgeOutStep.SELECT_CONVERT_TOKEN && (
        <SelectTokenPage
          bridgeType="OUT"
          tokenList={props.convertTokens}
          activeToken={props.currentConvertToken}
          tokenBalance="erc20Balance"
          onSelect={(token) => {
            setSelectedToken(token);
            return props.setToken(token, SelectedTokens.CONVERTOUT);
          }}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
        />
      )}
      {props.currentStep === BridgeOutStep.SELECT_CONVERT_TOKEN_AMOUNT &&
        selectedToken != undefined && (
          <AmountPage
            amount={props.amount}
            setAmount={props.setAmount}
            selectedToken={selectedToken}
            max={formatUnits(
              props.currentConvertToken.erc20Balance,
              props.currentConvertToken.decimals
            )}
            canContinue={props.canContinue}
            onNext={props.onNext}
            onPrev={props.onPrev}
          />
        )}

      {/* {props.currentStep === BridgeOutStep.CONVERT_COIN && (
        <ConfirmConvert
          amount={convertStringToBigNumber(
            props.amount,
            props.currentConvertToken.decimals
          )}
          token={props.currentConvertToken}
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
      )} */}

      {/* {props.currentStep === BridgeOutStep.SELECT_BRIDGE_OUT_NETWORK && (
        <SwitchNetworkPage
          toChainId={CantoMainnet.chainId}
          fromChainId={props.chainId}
          onClick={() => switchNetwork(CantoMainnet.chainId)}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
        />
      )} */}
      {props.currentStep === BridgeOutStep.SELECT_NATIVE_TOKEN && (
        <SelectTokenPage
          bridgeType="OUT"
          tokenList={props.bridgeOutTokens}
          activeToken={props.currentBridgeOutToken}
          tokenBalance="nativeBalance"
          onSelect={(token) => {
            setSelectedToken(token);
            props.setToken(token, SelectedTokens.BRIDGEOUT);
          }}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
        />
      )}
      {props.currentStep === BridgeOutStep.SELECT_NATIVE_TOKEN_AMOUNT &&
        selectedToken != undefined && (
          <AmountPage
            amount={props.amount}
            setAmount={props.setAmount}
            selectedToken={selectedToken}
            max={formatUnits(
              props.currentBridgeOutToken.nativeBalance,
              props.currentBridgeOutToken.decimals
            )}
            canContinue={props.canContinue}
            onNext={props.onNext}
            onPrev={props.onPrev}
          />
        )}
      {/* {props.currentStep === BridgeOutStep.SEND_TO_GRBIDGE && (
        <ConfirmConvert
          amount={convertStringToBigNumber(
            props.amount,
            props.currentBridgeOutToken.decimals
          )}
          token={props.currentBridgeOutToken}
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
      )} */}
    </div>
  );
};
