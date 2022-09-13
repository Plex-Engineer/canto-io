import styled from "styled-components";
import { useState } from "react";

import { OutlinedButton, Text, Token, TOKENS } from "cantoui";
import CheckBox from "global/components/checkBox";
const Container = styled.div`
  background-color: #040404;
  height: 36rem;
  width: 26rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  /* padding: 1rem; */
  .title {
    font-style: normal;
    font-weight: 300;
    font-size: 22px;
    line-height: 130%;
    text-align: center;
    letter-spacing: -0.1em;
    text-transform: lowercase;
    color: var(--primary-color);
    /* margin-top: 0.3rem; */
    width: 100%;
    background-color: #06fc991a;
    padding: 1rem;
    border-bottom: 1px solid var(--primary-color);
  }

  .scroll-view {
    overflow-y: auto;
    width: 100%;
    border-top: 1px solid var(--dark-grey-color);
    border-bottom: 1px solid var(--dark-grey-color);
    padding: 2rem;
  }
  @media (max-width: 1000px) {
    width: 100%;
  }
`;

const TokensModal = () => {
  const [selectedTokens, setSelectedTokens] = useState<Token[]>([]);

  function getTotalLength() {
    let total = 0;

    Object.entries(TOKENS).forEach(([token]) =>
      Object.entries(token).forEach(() => (total += 1))
    );

    return total;
  }

  return (
    <Container>
      <div className="title">Import Tokens</div>
      <div className="scroll-view">
        {Object.entries(TOKENS).map(([key, token]) => (
          <div key={key}>
            <Text type="text">{key}</Text>
            {Object.entries(token).map(([tkey, ttoken]) => {
              return (
                <TokenItem
                  token={ttoken}
                  key={tkey}
                  onSelect={(token, selected) => {
                    if (selected) {
                      setSelectedTokens([...selectedTokens, token]);
                    } else {
                      setSelectedTokens(
                        selectedTokens.filter((t) => t.symbol !== token.symbol)
                      );
                    }
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      {
        <p>
          {selectedTokens.length}/{getTotalLength()}
        </p>
      }

      <OutlinedButton
        style={{
          margin: "1.2rem",
        }}
        onClick={() => {
          addTokens(selectedTokens);
        }}
      >
        Import Tokens
      </OutlinedButton>
    </Container>
  );
};

interface TokenItemProps {
  token: Token;
  onSelect: (token: Token, selected: boolean) => void;
}

const ItemStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
  margin: 0 0.4rem;
  align-items: center;
  .row {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }

  &:hover {
    background-color: #06fc991a;
    cursor: pointer;
  }
`;
const TokenItem = ({ token, onSelect }: TokenItemProps) => {
  const [checked, setChecked] = useState(false);

  return (
    <ItemStyled
      onClick={() => {
        setChecked(!checked);
        onSelect(token, !checked);
      }}
    >
      <div className="row">
        <img src={token.icon} alt={token.symbol} height={30} />
        <div className="type">{token.symbol}</div>
      </div>
      <CheckBox
        checked={checked}
        onChange={(val) => {
          //   setChecked(val);
        }}
      />
    </ItemStyled>
  );
};

export async function addTokens(tokens: Token[]) {
  for (const [name, tokenObj] of Object.entries(tokens)) {
    try {
      if (tokenObj.name != "Canto") {
        //@ts-ignore
        ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              address: tokenObj.address, // The address that the token is at.
              symbol: tokenObj.symbol.slice(0, 11), // A ticker symbol or shorthand, up to 5 chars.
              decimals: tokenObj.decimals, // The number of decimals in the token
              image: tokenObj.icon, // A string url of the token logo
            },
          },
        });
      }
    } catch (error) {
      // console.log(error)
    }
  }
}

export default TokensModal;
