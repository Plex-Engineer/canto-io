import styled from "@emotion/styled";
import { StyledPopup } from "global/components/Styled";
import { Text } from "global/packages/src";
import Tooltip from "global/packages/src/components/molecules/Tooltip";
import {
  UserConvertToken,
  UserGravityBridgeTokens,
} from "pages/bridge/config/interfaces";
import React, { useState } from "react";
import { formatTokensAmountsbyChain } from "../utils/utils";
import TokenTable from "./tokenTable";

interface Props {
  ethTokens: UserGravityBridgeTokens[];
  convertTokens: UserConvertToken[];
}
const BalanceTableModal = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Styled>
      <Tooltip
        autoShow
        position="bottom right"
        trigger={
          <div
            role={"button"}
            tabIndex={-2}
            className="floating-btn"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            ?
          </div>
        }
        content={<Text size="text4">Click here to check the balances.</Text>}
      />
      <StyledPopup
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <div className="modal">
          <TokenTable
            tokens={formatTokensAmountsbyChain(
              props.ethTokens,
              props.convertTokens
            )}
            onClose={() => {
              setIsOpen(false);
            }}
          />
        </div>
      </StyledPopup>
    </Styled>
  );
};

const Styled = styled.div`
  .modal {
    background-color: red;
    padding: 2rem;
    height: 80vh;
  }
  .floating-btn {
    height: 40px;
    width: 40px;
    background-color: var(--primary-color);
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: black;
    font-size: 20px;
    position: absolute;
    z-index: 3;
    right: 30px;
    top: 20px;
    cursor: pointer;

    &:hover {
      background-color: #13a068;
    }
  }
`;

export default BalanceTableModal;
