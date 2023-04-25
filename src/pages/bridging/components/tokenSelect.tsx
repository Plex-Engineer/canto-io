import styled from "@emotion/styled";
import down from "assets/down.svg";
import { useRef } from "react";
import { BaseToken, Step1TokenGroups } from "../config/interfaces";
import Popup from "reactjs-popup";
import TokenModal from "./modals/tokenModal";

interface ITokenSelect {
  tokenGroups: Step1TokenGroups[];
  activeToken: BaseToken;
  onSelect: (value: BaseToken | undefined) => void;
}

export const TokenWallet = ({
  tokenGroups,
  onSelect,
  activeToken,
}: ITokenSelect) => {
  const ref = useRef(null);
  const fullTokenLength = tokenGroups.reduce((acc, group) => {
    if (group.tokens) {
      return acc + group.tokens?.length;
    } else {
      return acc;
    }
  }, 0);
  return (
    <StyledPopup
      ref={ref}
      modal
      lockScroll
      trigger={
        <Styled>
          {activeToken.symbol != "choose token" && (
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
            {fullTokenLength ? activeToken.symbol : "loading tokens"}
          </span>
          <img src={down} alt="" />
        </Styled>
      }
    >
      <TokenModal
        tokenGroups={tokenGroups}
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
    scroll-behavior: smooth;
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
      overflow-y: scroll;
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
