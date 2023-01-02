import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { useState } from "react";
import TextSwitch from "../components/TextSwitch";
import BaseStyled from "./layout";

interface Props {
  PageNumber: number;
}

const SelectTokenPage = (props: Props) => {
  return (
    <Styled>
      <Text type="title" size="title2">
        Select Token
      </Text>
      <div>
        <Text type="text" size="title3" bold>
          Please choose the token you&#39;d like to transfer
        </Text>
        <Text type="text" size="text3">
          By choosing a token we can make sure the process goes seamless;
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

export default SelectTokenPage;
