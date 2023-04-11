import styled from "@emotion/styled";
import { ETHMainnet } from "global/config/networks";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import BaseStyled from "../layout";

interface SwtichNetworkProps {
  toChainId: number;
  fromChainId: number;
  onClick: () => void;
  canContinue: boolean;
  onNext: () => void;
  onPrev: () => void;
  canGoBack: boolean;
}
const SwitchNetworkPage = (props: SwtichNetworkProps) => {
  const rightNetwork = props.fromChainId == props.toChainId;
  return (
    <Styled>
      <header>
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
            {props.toChainId == ETHMainnet.chainId ? "Ethereum" : "Canto"}{" "}
            Network&quot; for this transaction to be possible.
          </Text>
        </div>
      </header>
      <section>
        <PrimaryButton
          disabled={rightNetwork}
          weight="bold"
          onClick={props.onClick}
        >
          {!rightNetwork
            ? "Switch to " +
              (props.toChainId == ETHMainnet.chainId ? "Ethereum" : "Canto")
            : "You are on right network"}
        </PrimaryButton>
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
`;

export default SwitchNetworkPage;
