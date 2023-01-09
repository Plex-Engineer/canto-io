import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import BaseStyled from "./layout";

interface CompletePageProps {
  bridgeIn: boolean;
  restart: () => void;
}
export const CompletePage = (props: CompletePageProps) => {
  return (
    <BaseStyled>
      <header>
        <Text type="title" size="title2">
          Bridge {props.bridgeIn ? "in" : "out"} proccess complete
        </Text>
      </header>
      <footer>
        <div className="row">
          <OutlinedButton onClick={props.restart}>
            Restart Walkthrough
          </OutlinedButton>
          <PrimaryButton onClick={() => window.open("/bridge", "_self")}>
            Go to Bridge Home
          </PrimaryButton>
        </div>
      </footer>
    </BaseStyled>
  );
};
