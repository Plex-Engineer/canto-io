import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import BaseStyled from "./layout";

const AmountPage = () => {
  return (
    <Styled>
      <Text type="title" size="title2">
        CHOOSE THE AMOUNT
      </Text>
      <div>
        <Text type="text" size="title3" bold>
          Please set the amount
        </Text>
        <Text type="text" size="text3">
          You need to switch to &quot;Ethereum&quot; for this transaction to be
          possible.
        </Text>
      </div>
      <PrimaryButton>Switch to &quot;Ethereum Network&quot;</PrimaryButton>
      <div className="row">
        <OutlinedButton>Prev</OutlinedButton>
        <PrimaryButton>Next</PrimaryButton>
      </div>
    </Styled>
  );
};

const Styled = styled(BaseStyled)`
  padding: 2rem;
  justify-content: center;
`;

export default AmountPage;
