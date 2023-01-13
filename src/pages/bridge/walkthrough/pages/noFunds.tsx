import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import BaseStyled from "./layout";
import WarningIcon from "assets/warning.svg";
const NoFunds = () => {
  return (
    <Styled>
      <img src={WarningIcon} height={80} />
      <Text type="title" size="title2">
        Oops, looks like you have no funds to transfer
      </Text>
      <Text type="text">
        To use the walkthrough you either need to have funds on "ethereum
        network" or "canto network" and as of now. it doesn't seem like you have
        funds on either of the networks
      </Text>
    </Styled>
  );
};

const Styled = styled(BaseStyled)`
  padding: 2rem;
  justify-content: center;
  max-width: 700px;
`;

export default NoFunds;
