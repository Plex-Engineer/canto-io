import { CantoMainnet } from "global/config/networks";
import {
  allBridgeOutNetworks,
  BridgeOutNetworks,
} from "pages/bridge/config/gravityBridgeTokens";
import {
  BaseToken,
  UserConvertToken,
  UserNativeTokens,
} from "pages/bridge/config/interfaces";
import { SelectedTokens } from "pages/bridge/stores/tokenStore";
import { BridgeOutStep } from "../../walkthroughTracker";
import { SelectToken } from "../selectToken";
import { SwitchNetwork } from "../switchNetwork";

interface BridgeOutWalkthroughProps {
  currentStep: BridgeOutStep;
  convertTokens: UserConvertToken[];
  currentConvertToken: UserConvertToken;
  bridgeOutNetwork: BridgeOutNetworks;
  bridgeOutTokens: UserNativeTokens[];
  currentBridgeOutToken: UserNativeTokens;
  selectToken: (token: BaseToken, from: SelectedTokens) => void;
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
    </div>
  );
};