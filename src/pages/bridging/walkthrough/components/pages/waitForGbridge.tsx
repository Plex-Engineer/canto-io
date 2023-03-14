import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import BaseStyled from "../layout";

interface WaitProps {
  onPrev: () => void;
  onNext: () => void;
  canContinue: boolean;
  txHash: string | undefined;
  canGoBack: boolean;
}
export const WaitForGbridge = (props: WaitProps) => {
  return (
    <Styled>
      <header>
        <Text type="title" size="title2">
          wait for funds to arrive on canto
        </Text>
      </header>
      <section>
        <Text type="text">
          this transaction could take up to 30 minutes to complete. to track the
          progress, please go to the bridge page and check the transactions tab
        </Text>
        <Text type="text">
          once the transaction is complete, please select &quot;bridge in&quot;
          on the walkthrough home and select &quot;yes&quot; when asked if the
          gravity bridge transaction has completed. this will bring you to the
          next step
        </Text>
      </section>
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
    </Styled>
  );
};

const Styled = styled(BaseStyled)`
  padding: 2rem;
  justify-content: center;
  section {
    align-items: center;
    button {
      width: 16rem;
    }
  }
`;
