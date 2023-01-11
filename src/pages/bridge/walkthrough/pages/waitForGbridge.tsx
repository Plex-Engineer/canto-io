import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import BaseStyled from "./layout";

interface WaitProps {
  onPrev: () => void;
  onNext: () => void;
  canContinue: boolean;
  txHash: string | undefined;
  canGoBack: boolean;
}
export const WaitForGbridge = (props: WaitProps) => {
  return (
    <BaseStyled>
      <header>
        <Text type="title" size="title2">
          wait for gbridge
        </Text>
      </header>
      <footer>
        <div className="row">
          <OutlinedButton onClick={props.onPrev} disabled={!props.canGoBack}>
            Prev
          </OutlinedButton>
          <PrimaryButton onClick={props.onNext} disabled={false}>
            Next
          </PrimaryButton>
        </div>
      </footer>
    </BaseStyled>
  );
};
