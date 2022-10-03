import styled from "@emotion/styled";
import down from "assets/down.svg";
import { useState } from "react";
import TokenModal from "./tokenModal";
import { StyledPopup } from "global/components/Styled";
import { BaseToken } from "../config/interfaces";

interface ITokenSelect {
  tokens: BaseToken[] | undefined;
  activeToken: BaseToken;
  onSelect: (value: BaseToken | undefined) => void;
}

export const TokenWallet = ({
  onSelect,
  tokens,
  activeToken,
}: ITokenSelect) => {
  const [isOpen, setOpen] = useState(false);

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
        src={activeToken.icon}
        alt={activeToken.name}
        height={30}
        width={30}
      />
      <span
        style={{
          flex: "2",
        }}
      >
        {tokens ? activeToken.name : "loading tokens"}
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
            }}
          />
          <TokenModal
            tokens={tokens}
            onClose={(value) => {
              if (onSelect) {
                onSelect(value);
              }
              setOpen(false);
            }}
          />
        </StyledPopup>
      ) : null}
    </Box>
  );
};
