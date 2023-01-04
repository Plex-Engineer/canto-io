import styled from "@emotion/styled";
import { CantoMainnet } from "global/config/networks";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { useNetworkInfo } from "global/stores/networkInfo";
import { ETHMainnet } from "pages/bridge/config/networks";
import { BridgeStep, useBridgeWalkthroughStore } from "../store/useWalkthough";
import BaseStyled from "./layout";

const SwitchNetworkPage = () => {
  const [popPage, pushPage, bridgeType, bridgeStep] = useBridgeWalkthroughStore(
    (state) => [
      state.popStepTracker,
      state.pushStepTracker,
      state.BridgeType,
      state.BridgeStep,
    ]
  );
  const currentChainID = useNetworkInfo((state) => state.chainId);

  const requriedChainID = getRequiredNetworkChainID();

  function getRequiredNetworkChainID() {
    if (bridgeType == "IN" && bridgeStep == "FIRST") {
      //ETH_TO_GBRIDGE
      return ETHMainnet.chainId;
    }
    if (bridgeType == "IN" && bridgeStep == "LAST") {
      //GBRIDGE_TO_CANTO
      return CantoMainnet.chainId;
    }
    if (bridgeType == "OUT" && bridgeStep == "FIRST") {
      //CANTO_TO_GBRIDGE
      return CantoMainnet.chainId;
    }
    if (bridgeType == "IN" && bridgeStep == "LAST") {
      //GBRIDGE_TO_OUT
      return CantoMainnet.chainId;
    }
    return undefined;
  }
  const rightNetwork = currentChainID == requriedChainID;

  return (
    <Styled>
      {requriedChainID == undefined &&
        "Something went wrong please start over."}
      <Text type="title" size="title2">
        Switch Network
      </Text>
      <div>
        <Text type="text" size="title3" bold>
          {rightNetwork
            ? "Looks like you are on the right network"
            : "Looks like you are not on the right network"}
        </Text>
        <Text type="text" size="text3">
          You need to be on &quot;
          {requriedChainID == ETHMainnet.chainId ? "Ethereum" : "Canto"}{" "}
          Network&quot; for this transaction to be possible.
        </Text>
      </div>
      <PrimaryButton disabled={rightNetwork} weight="bold">
        {!rightNetwork
          ? "Switch to " +
            (requriedChainID == ETHMainnet.chainId ? "Ethereum" : "Canto")
          : "You are on right network"}
      </PrimaryButton>
      <div className="row">
        <OutlinedButton onClick={() => popPage()}>Prev</OutlinedButton>
        <PrimaryButton onClick={() => pushPage(BridgeStep.CHOOSE_TOKEN)}>
          Next
        </PrimaryButton>
      </div>
    </Styled>
  );
};

const Styled = styled(BaseStyled)`
  padding: 2rem;
  justify-content: center;
`;

export default SwitchNetworkPage;
