import styled from "@emotion/styled";
import down from "assets/down.svg";
import { useRef } from "react";
import { BaseToken } from "../config/interfaces";
import Popup from "reactjs-popup";
import TokenModal from "./modals/tokenModal";

interface ITokenSelect {
  tokens: BaseToken[] | undefined;
  activeToken: BaseToken;
  onSelect: (value: BaseToken | undefined) => void;
  balanceString: string;
}

export const TokenWallet = ({
  onSelect,
  tokens,
  activeToken,
  balanceString,
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
        onClose={(value) => {
          if (ref != null) {
            //@ts-ignore
            ref.current?.close();
          }
          if (onSelect) {
            onSelect(value);
          }
        }}
        balanceString={balanceString}
      />
    </StyledPopup>
  );
};

export const StyledPopup = styled(Popup)`
  // use your custom style for ".popup-overlay"
  &-overlay {
    z-index: 10;
  }
  &-content {
    background: rgba(217, 217, 217, 0.2);
    backdrop-filter: blur(35px);
    border-radius: 7px;

    .token-item img {
      margin-left: 0px !important;
    }
  }
`;

const Styled = styled.div`
  padding: 1rem 1.4rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  height: 100%;
  cursor: pointer;

  /* border: 1px solid black; */
  &:hover {
    /* border: 1px solid var(--primary-color); */
    background-color: #111;
  }
`;
