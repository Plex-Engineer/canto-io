import styled from "@emotion/styled";
import down from "assets/down.svg";
import Popup from "reactjs-popup";
import { useState } from "react";
import TokenModal from "components/modals/tokenModal";
import { useTokenStore } from "stores/tokens";
import { GTokens } from "hooks/useGravityTokens";

interface ITokenSelect {
  activeToken: GTokens;
  tokens: GTokens[] | undefined;
  onSelect: (value: any) => void;
}

export const StyledPopup = styled(Popup)`
  // use your custom style for ".popup-overlay"

  &-overlay {
    background-color: #1f4a2c6e;
    backdrop-filter: blur(2px);
    z-index: 10;
  }

  &-content {
    background-color: black;
    border: 1px solid var(--primary-color);
  }
`;
export const TokenWallet = ({ onSelect, tokens }: ITokenSelect) => {
  const [isOpen, setOpen] = useState(false);
  const [activeToken, setActiveToken] = useTokenStore(state => [state.selectedToken, state.setSelectedToken])

  const Box = styled.div`
    background-color: #1c1c1c;
    padding: 1rem 1.4rem;
    color: white;
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 15rem;
    cursor: pointer;
    border: 1px solid black;
    &:hover {
      border: 1px solid var(--primary-color);
    }
  `;
  return (
    <Box
      onClick={() => {
        setOpen(true);
      }}
    >
      <img
        src={activeToken.data.icon}
        alt={activeToken.data.name}
        height={30}
        width={30} />
      <span
        style={{
          flex: "2",
        }}
      >
        {tokens ? activeToken.data.name : "loading tokens"}
      </span>
      <img src={down} alt="" />
      {tokens ? (
        <StyledPopup
          open={isOpen}
          onClose={() => {
            setOpen(false);
          }}
        >
          <hr
            style={{
              border: "0px",
              borderBottom: "1px solid #00502C",
              marginBottom: "1rem",
            }} />
          <TokenModal
            tokens={tokens}
            onClose={(value) => {
              if (onSelect) {
                onSelect(value);
              }
              setOpen(false);
            }} />
        </StyledPopup>
      ) : null}
    </Box>
  );
};
