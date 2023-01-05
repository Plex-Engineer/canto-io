import { OutlinedButton, PrimaryButton } from "global/packages/src";
import { UserGravityBridgeTokens } from "pages/bridge/config/interfaces";

interface NeedAllowanceProps {
  token: UserGravityBridgeTokens;
  txMessage: React.ReactNode;
  allowTx: () => void;
  canContinue: boolean;
  onPrev: () => void;
  onNext: () => void;
  canGoBack: boolean;
}
export const NeedAllowancePage = (props: NeedAllowanceProps) => {
  return (
    <div>
      <h1>Need Allowance</h1>
      <p>
        You need to allow the Canto Bridge to transfer your tokens. Please click
        the button below to allow the Canto Bridge to transfer your tokens.
      </p>
      <PrimaryButton disabled={props.canContinue} onClick={props.allowTx}>
        Allow
      </PrimaryButton>
      <p>{props.txMessage}</p>
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
    </div>
  );
};
