import styled from "@emotion/styled";
import BridgeToCanto from "./components/bridgeToCanto";
import EvmToBridge from "./components/evmToBridge";
import ethIcon from "assets/icons/ETH.svg";
import bridgeIcon from "assets/icons/canto-bridge.svg";
import { ConvertTransaction, UserBridgeInToken } from "./config/interfaces";
import { TokenWallet } from "pages/bridge/components/TokenSelect";
import { useBridgeTokenInfo } from "./hooks/useBridgeTokenInfo";
import { SelectedTokens } from "./stores/bridgeTokenStore";
import { EMPTY_BRIDGE_IN_TOKEN } from "./config/interfaces";

interface BridgeInProps {
  ethAddress?: string;
  cantoAddress?: string;
  step2Transactions: ConvertTransaction[];
  ethGBridgeTokens: UserBridgeInToken[];
}
const BridgeIn = (props: BridgeInProps) => {
  return (
    <BridgeStyled>
      <div className="evmToBrige">
        <EvmToBridge
          connected
          from={{
            address: props.ethAddress,
            name: "ethereum",
            icon: ethIcon,
          }}
          to={{
            address: props.cantoAddress,
            name: "canto (bridge)",
            icon: bridgeIcon,
          }}
        />
      </div>
      <div className="bridgeToCanto">
        <BridgeToCanto transactions={props.step2Transactions} />
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
