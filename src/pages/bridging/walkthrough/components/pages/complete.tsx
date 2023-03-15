import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { useNavigate } from "react-router-dom";
import BaseStyled from "../layout";

interface CompletePageProps {
  bridgeIn: boolean;
  restart: () => void;
}
export const CompletePage = (props: CompletePageProps) => {
  const navigate = useNavigate();
  return (
    <Styled>
      <header>
        <Text type="title" size="title2">
          Bridge {props.bridgeIn ? "in" : "out"} completed
        </Text>
      </header>
      <section>
        <Text type="text">
          you have completed the bridge {props.bridgeIn ? "in" : "out"}{" "}
          proccess. you may return to the bridge walkthrough home to bridge
          again, or go to the bridge page to see your transactions
        </Text>
      </section>
      <footer>
        <div className="row">
          <OutlinedButton onClick={props.restart}>
            Restart Walkthrough
          </OutlinedButton>
          <PrimaryButton onClick={() => navigate("/bridge")}>
            Go to Bridge Home
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
