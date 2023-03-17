import styled from "@emotion/styled";
import { StyledPopup } from "global/components/Styled";
import { Text } from "global/packages/src";
import Tooltip from "global/packages/src/components/molecules/Tooltip";
import { useState } from "react";

import TokenTable from "./tokenTable";
import { formatTokensAmountsbyChain } from "../../utils/utils";
import Modal from "global/packages/src/components/molecules/Modal";
import {
  UserERC20BridgeToken,
  UserNativeToken,
} from "pages/bridging/config/interfaces";

interface Props {
  ethTokens: UserERC20BridgeToken[];
  cantoTokens: UserERC20BridgeToken[];
  nativeTokens: UserNativeToken[];
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
      <Modal
        title="Token Balances"
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <div className="modal">
          <TokenTable
            tokens={formatTokensAmountsbyChain(
              props.ethTokens,
              props.cantoTokens,
              props.nativeTokens
            )}
            onClose={() => {
              setIsOpen(false);
            }}
          />
        </div>
      </Modal>
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
