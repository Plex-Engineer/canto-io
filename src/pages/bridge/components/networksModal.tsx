import styled from "@emotion/styled";
import {
  BridgeOutNetworks,
  BridgeOutNetworkTokenData,
} from "../config/gravityBridgeTokens";

interface Props {
  onClose: (value?: BridgeOutNetworks) => void;
  networks: BridgeOutNetworkTokenData;
}

const NetworksModal = (props: Props) => {
  return (
    <Styled>
      <div className="network-list">
        {Object.keys(props.networks).map((key, network) => (
          <div
            role="button"
            tabIndex={0}
            key={key}
            className="network-item"
            onClick={() => {
              props.onClose(network);
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
    </Styled>
  );
};

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  width: 310px;
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

export default NetworksModal;
