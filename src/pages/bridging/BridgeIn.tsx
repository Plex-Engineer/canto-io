import styled from "@emotion/styled";
import BridgeToCanto from "./components/bridgeToCanto";
import EvmToBridge from "./components/evmToBridge";
import cantoIcon from "assets/icons/canto-evm.svg";
import ethIcon from "assets/icons/ETH.svg";
import bridgeIcon from "assets/icons/canto-bridge.svg";

const BridgeIn = () => {
  return (
    <BridgeStyled>
      <div className="evmToBrige">
        <EvmToBridge
          connected
          from={{
            address: "0x348984930248298429",
            name: "ethereum",
            icon: ethIcon,
          }}
          to={{
            address: "canto0x348984930248298429",
            name: "canto (bridge)",
            icon: bridgeIcon,
          }}
        />
      </div>
      <div className="bridgeToCanto">
        <BridgeToCanto />
      </div>
    </BridgeStyled>
  );
};

export const BridgeStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding: 60px 0;
  flex-grow: 1;
  width: 100%;
  position: relative;
  @media (max-width: 1000px) {
    br {
      display: none;
    }
  }
`;

export default BridgeIn;
