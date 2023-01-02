import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { useState } from "react";
import TextSwitch from "../components/TextSwitch";
import BaseStyled from "./layout";

interface Props {
  PageNumber: number;
}

const SwitchNetworkPage = (props: Props) => {
  return (
    <Styled>
      <Text type="title" size="title2">
        Switch Network
      </Text>
      <div>
        <Text type="text" size="title3" bold>
          Looks like you are not on the right network
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

export default SwitchNetworkPage;
