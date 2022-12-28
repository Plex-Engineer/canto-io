import { UserGravityBridgeTokens } from "pages/bridge/config/interfaces";
import { ETHMainnet } from "pages/bridge/config/networks";
import { BridgeInStep } from "../../walkthroughTracker";
import { SwitchNetwork } from "../switchNetwork";

interface BridgeInWalkthroughProps {
  cantoAddress: string;
  currentStep: BridgeInStep;
  bridgeInTokens: UserGravityBridgeTokens[];
}
export const BridgeInWalkthroughManager = (props: BridgeInWalkthroughProps) => {
  return (
    <div>
      <h1>Bridge In Start</h1>
      <p>current step: {props.currentStep}</p>
      {props.currentStep === BridgeInStep.SWTICH_TO_ETH && (
        <SwitchNetwork chainId={ETHMainnet.chainId} />
      )}
    </div>
  );
};
