import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import Tooltip from "global/packages/src/components/molecules/Tooltip";
import { useState } from "react";
import walletImg from "assets/mini-wallet.svg";
import TokenTable from "./tokenTable";
import { formatTokensAmountsbyChain } from "../../utils/utils";
import Modal from "global/packages/src/components/molecules/Modal";
import {
  NativeToken,
  UserNativeToken,
  UserERC20BridgeToken,
} from "pages/bridging/config/bridgingInterfaces";

interface Props {
  ethTokens: UserERC20BridgeToken[];
  cantoTokens: UserERC20BridgeToken[];
  nativeTokens: UserNativeToken[];
  allConvertCoinTokens: NativeToken[];
}
const BalanceTableModal = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Styled>
      <Tooltip
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
            <img src={walletImg} alt="wallet" height={21} />
          </div>
        }
        content={<Text size="text4">Click here to check your balances.</Text>}
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
              props.nativeTokens,
              props.allConvertCoinTokens
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
