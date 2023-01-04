import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";

import BaseStyled from "./layout";

const SelectTokenPage = () => {
  return (
    <Styled>
      <Text type="title" size="title2">
        Bridgin Token
      </Text>
      <div>
        <Text type="text" size="title3" bold>
          Selec the token you'd like to bridge in
        </Text>
        <Text type="text" size="text3">
          Now that you are on the right network. Please select the token you'd
          like to bridge in.
        </Text>
      </div>

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

export default SelectTokenPage;
