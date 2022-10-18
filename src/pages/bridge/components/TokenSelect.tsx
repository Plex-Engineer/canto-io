import styled from "@emotion/styled";
import down from "assets/down.svg";
import { useRef } from "react";
import TokenModal from "./tokenModal";
import { BaseToken } from "../config/interfaces";
import Popup from "reactjs-popup";

interface ITokenSelect {
  tokens: BaseToken[] | undefined;
  activeToken: BaseToken;
  onSelect: (value: BaseToken | undefined) => void;
  balance: string;
}

export const TokenWallet = ({
  onSelect,
  tokens,
  activeToken,
  balance,
}: ITokenSelect) => {
  const ref = useRef(null);
  return (
    <StyledPopup
      ref={ref}
      position={"bottom left"}
      offsetY={-20}
      offsetX={20}
      arrow={false}
      trigger={
        <Styled>
          {activeToken.name != "choose token" && (
            <img
              src={activeToken.icon}
              alt={activeToken.name}
              height={30}
              width={30}
            />
          )}
          <span
            style={{
              flex: "2",
            }}
          >
            {tokens ? activeToken.name : "loading tokens"}
          </span>
          <img src={down} alt="" />
        </Styled>
      }
    >
      <TokenModal
        tokens={tokens}
        balance={balance}
        onClose={(value) => {
          if (ref != null) {
            //@ts-ignore
            ref.current?.close();
          }
          if (onSelect) {
            onSelect(value);
          }
        }}
      />
    </StyledPopup>
  );
};

const StyledPopup = styled(Popup)`
  // use your custom style for ".popup-overlay"
  &-overlay {
    z-index: 10;
  }
  &-content {
    background: rgba(217, 217, 217, 0.2);
    backdrop-filter: blur(35px);
    border-radius: 7px;
  }
`;

const Styled = styled.div`
  background-color: #222222;
  padding: 1rem 1.4rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 15rem;
  height: 100%;
  cursor: pointer;
  /* border: 1px solid black; */
  &:hover {
    /* border: 1px solid var(--primary-color); */
    background-color: #333333;
  }
`;
