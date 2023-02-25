import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { CInput } from "global/packages/src/components/atoms/Input";
import {
  BridgeOutNetworkInfo,
  BridgeOutNetworks,
  BridgeOutNetworkData,
} from "pages/bridge/config/bridgeOutNetworks";
import TextSwitch from "../components/TextSwitch";
import BaseStyled from "./layout";

interface SelectBridgeProps {
  networks: BridgeOutNetworkData;
  activeNetwork: BridgeOutNetworkInfo;
  onSelect: (network: BridgeOutNetworks) => void;
  canContinue: boolean;
  canGoBack: boolean;
  onPrev: () => void;
  onNext: () => void;
  userCosmosSend: {
    address: string;
    setAddress: (s: string) => void;
  };
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
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Text type="title" align="left">
            Enter the wallet address :
          </Text>
          <CInput
            className="address-input"
            placeholder={
              props.activeNetwork.name == "gravity bridge"
                ? "Enter gravity bridge address"
                : "Enter cosmos hub address"
            }
            value={props.userCosmosSend.address}
            onChange={(e) => props.userCosmosSend.setAddress(e.target.value)}
          />
          <Text type="text" align="left" size="text4">
            this is the address that will recieve the funds on the{" "}
            {props.activeNetwork.name} chain
          </Text>
        </div>
      </section>
      <footer>
        <div className="row">
          <OutlinedButton onClick={props.onPrev} disabled={!props.canGoBack}>
            Prev
          </OutlinedButton>
          <PrimaryButton
            onClick={props.onNext}
            disabled={!props.canContinue}
            weight="bold"
          >
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
  .address-input {
    background-color: #111;
    border: 1px solid #333;
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
