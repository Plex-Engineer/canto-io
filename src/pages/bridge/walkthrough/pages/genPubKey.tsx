import styled from "@emotion/styled";
import { PrimaryButton, Text } from "global/packages/src";
import { ReactNode } from "react";
import BaseStyled from "./layout";

interface PubKeyProps {
  txGenPubKey: () => void;
  txStatus: ReactNode | undefined;
}
export const GenPubKeyWalkthrough = (props: PubKeyProps) => {
  return (
    <Styled>
      {" "}
      <header>
        <Text type="title" size="title2">
          Generate Public Key
        </Text>
        <div>
          <Text type="text" size="text2">
            By clicking &quot;generate&quot; you are creating a public key for
            your account to allow you to make transactions on the Canto network
          </Text>
        </div>
      </header>
      <section>
        <div className="box">
          <Text type="text" size="title3">
            Transaction Type
          </Text>
          <Text type="text" size="title3">
            Generate public key
          </Text>
          <Text type="text" size="title3">
            Transaction Status:
          </Text>
          <Text type="text" size="title3">
            {props.txStatus ?? "None"}
          </Text>
        </div>
        <PrimaryButton
          onClick={props.txGenPubKey}
          disabled={props.txStatus != "None"}
          weight="bold"
        >
          Confirm
        </PrimaryButton>
      </section>
    </Styled>
  );
};

const Styled = styled(BaseStyled)`
  padding: 2rem;
  justify-content: center;

  .box {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    border: 1px solid #222;
    background-color: #111;
    border-radius: 4px;
    grid-gap: 0;
    & > * {
      border: 1px solid #1e1e1e;
      padding: 1rem;
    }
  }
  section {
    align-items: center;
    button {
      width: 16rem;
    }
  }
`;
