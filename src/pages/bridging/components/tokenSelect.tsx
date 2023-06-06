import styled from "@emotion/styled";
import down from "assets/down.svg";
import { useRef } from "react";
import Popup from "reactjs-popup";
import TokenModal from "./modals/tokenModal";
import { Token } from "global/config/interfaces/tokens";

interface ITokenSelect {
  allTokens: Token[];
  activeToken?: Token;
  onSelect: (value: Token | undefined) => void;
}

export const TokenWallet = ({
  allTokens,
  onSelect,
  activeToken,
}: ITokenSelect) => {
  const ref = useRef(null);
  return (
    <StyledPopup
      ref={ref}
      modal
      lockScroll
      trigger={
        <Styled>
          {activeToken && (
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
            {allTokens.length > 0
              ? activeToken?.symbol ?? "choose token"
              : "loading tokens"}
          </span>
          <img src={down} alt="" />
        </Styled>
      }
    >
      <TokenModal
        tokens={allTokens}
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
    background-color: #1f4a2c6e;
    backdrop-filter: blur(2px);
    z-index: 10;
    animation: fadein 0.2s;
    @keyframes fadein {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }
  }

  // use your custom style for ".popup-content"
  &-content {
    position: relative;
    background-color: black;
    border-radius: 4px;
    animation: fadein 0.5s 1;
    min-height: 42rem;
    max-height: 45rem;
    max-width: 30rem;
    width: 100%;
    overflow-y: hidden;
    @keyframes fadein {
      0% {
        opacity: 0;
        transform: translateY(10px);
      }
      50% {
        opacity: 1;
      }
      100% {
        transform: translateY(0px);
      }
    }

    .scrollview {
      max-height: 43rem;
      overflow-y: auto;
      margin-bottom: 1rem;
      height: 100%;
    }
    .modal-title {
      width: 90%;
      border-bottom: 1px solid #222;
      margin: 0 auto;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      min-height: 60px;
    }
    /* width */
  }

  & {
    overflow-y: auto;
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
