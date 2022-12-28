import { PrimaryButton } from "global/packages/src";
import { UserConvertToken } from "pages/bridge/config/interfaces";

interface AskToSkipAheadProps {
  convertTokens: UserConvertToken[];
  skipStep: () => void;
  setUserSkipped: () => void;
}
export const AskToSkipAhead = (props: AskToSkipAheadProps) => {
  return (
    <div>
      <h1>Ask To Skip Ahead</h1>
      <p>Token: {props.convertTokens[0].name}</p>
      <PrimaryButton onClick={props.setUserSkipped}>DONT SKIP</PrimaryButton>
      <PrimaryButton
        onClick={() => {
          props.skipStep();
          props.setUserSkipped();
        }}
      >
        SKIP
      </PrimaryButton>
    </div>
  );
};
