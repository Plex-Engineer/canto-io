import { PrimaryButton } from "global/packages/src";
import { UserGravityBridgeTokens } from "pages/bridge/config/interfaces";
import { useEffect } from "react";

interface NeedAllowanceProps {
  skipStep: () => void;
  token: UserGravityBridgeTokens;

  txMessage: React.ReactNode;
  allowTx: () => void;
}
export const NeedAllowancePage = (props: NeedAllowanceProps) => {
  useEffect(() => {
    if (props.token.allowance.gt(props.token.balanceOf)) {
      props.skipStep();
    }
  });
  return (
    <div>
      <h1>Need Allowance</h1>
      <p>
        You need to allow the Canto Bridge to transfer your tokens. Please click
        the button below to allow the Canto Bridge to transfer your tokens.
      </p>
      <PrimaryButton onClick={props.allowTx}>Allow</PrimaryButton>
      <p>{props.txMessage}</p>
    </div>
  );
};
