import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import {
  BridgeOutNetworkInfo,
  BridgeOutNetworks,
  BridgeOutNetworkTokenData,
} from "pages/bridge/config/gravityBridgeTokens";
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
        </div>
      </header>
      <section>
        <div className="network-list">
          {Object.keys(props.networks).map((key, network) => (
            <div
              style={{
                background:
                  props.activeNetwork.name ==
                  props.networks[network as keyof typeof props.networks].name
                    ? "white"
                    : "none",
              }}
              role="button"
              tabIndex={0}
              key={key}
              className="network-item"
              onClick={() => {
                props.onSelect(network);
              }}
            >
              <span>
                <img
                  src={
                    props.networks[network as keyof typeof props.networks].icon
                  }
                  alt=""
                />
                <p>
                  {props.networks[network as keyof typeof props.networks].name}
                </p>
              </span>
            </div>
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
  p {
    font-size: 16px;
    font-weight: 500;
    line-height: 21px;
    letter-spacing: -0.03em;
    color: var(--primary-color);
  }
  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .network-list {
    scrollbar-color: var(--primary-color);
    scroll-behavior: smooth;
    /* width */
    padding: 8px;
    .network-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 400;
      font-size: 18px;
      letter-spacing: -0.02em;
      height: 38px;
      padding: 0 14px;
      outline: none;
      cursor: pointer;
      img {
        margin: 6px;
        height: 18px;
        width: 18px;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }
    }
  }
`;

export default SelectBridgeOutNetwork;
