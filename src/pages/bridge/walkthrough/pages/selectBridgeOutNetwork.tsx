import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import {
  BridgeOutNetworkInfo,
  BridgeOutNetworks,
  BridgeOutNetworkTokenData,
} from "pages/bridge/config/gravityBridgeTokens";
import TextSwitch from "../components/TextSwitch";
import BaseStyled from "./layout";

interface SelectBridgeProps {
  networks: BridgeOutNetworkTokenData;
  activeNetwork: BridgeOutNetworkInfo;
  onSelect: (network: BridgeOutNetworks) => void;
  canContinue: boolean;
  canGoBack: boolean;
  onPrev: () => void;
  onNext: () => void;
}
const SelectBridgeOutNetwork = (props: SelectBridgeProps) => {
  return (
    <Styled>
      <header>
        <Text type="title" size="title2">
          Select Bridge Out Network
        </Text>
        <div>
          <Text type="text" size="title3" bold>
            Select the network you&#39;d like to bridge out to
          </Text>
          <Text type="text" size="text3">
            The funds will be sent the network you&#39;d like to bridge out.
          </Text>
        </div>
      </header>
      <section>
        <div className="network-list">
          {Object.keys(props.networks).map((key, network) => (
            <TextSwitch
              key={key}
              text=""
              onClick={() => props.onSelect(network)}
              active={
                props.activeNetwork.name ==
                props.networks[network as keyof typeof props.networks].name
              }
            >
              <span>
                <img
                  src={
                    props.networks[network as keyof typeof props.networks].icon
                  }
                  alt=""
                  height={30}
                />
                <Text type="text">
                  {props.networks[network as keyof typeof props.networks].name}
                </Text>
              </span>
            </TextSwitch>
          ))}
        </div>
      </section>
      <footer>
        <div className="row">
          <OutlinedButton onClick={props.onPrev} disabled={!props.canGoBack}>
            Prev
          </OutlinedButton>
          <PrimaryButton onClick={props.onNext} disabled={!props.canContinue}>
            Next
          </PrimaryButton>
        </div>
      </footer>
    </Styled>
  );
};

const Styled = styled(BaseStyled)`
  padding: 2rem;
  justify-content: center;

  span {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .network-list {
    padding: 8px;
    flex-grow: 1;
    display: flex;
    gap: 2rem;
    align-items: center;
  }
`;

export default SelectBridgeOutNetwork;
