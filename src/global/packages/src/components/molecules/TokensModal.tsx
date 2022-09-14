import styled from "@emotion/styled";
import { useEffect, useState } from "react";

import { OutlinedButton, Text, Token, TOKENS } from "cantoui";
import CheckBox from "global/components/checkBox";
const Styled = styled.div`
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
  .details {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    width: 100%;
    padding: 0.4rem 1rem;
    /* margin-top: 0.3rem; */
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

function getAllTokens() {
  const tokens: Token[] = [];
  Object.entries(TOKENS).forEach(([key, token]) =>
    Object.entries(token).forEach(([tkey, ttoken]) => tokens.push(ttoken))
  );

  return tokens;
}
const TokensModal = () => {
  const [selectedTokens, setSelectedTokens] = useState<Token[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  return (
    <Styled>
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
                  allChecked={selectAll}
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

      <OutlinedButton
        style={{
          marginTop: "1.2rem",
        }}
        onClick={() => {
          addTokens(selectedTokens);
        }}
      >
        Import Tokens
      </OutlinedButton>
      {
        <div className="details">
          <p>
            {selectedTokens.length}/{getAllTokens().length}
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <p>select all</p>
            <CheckBox
              checked={selectAll}
              onChange={(val) => {
                setSelectAll(val);
                if (!selectAll) {
                  setSelectedTokens(getAllTokens());
                } else {
                  setSelectedTokens([]);
                }
              }}
            />
          </div>
        </div>
      }
    </Styled>
  );
};

interface TokenItemProps {
  token: Token;
  allChecked: boolean;
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
const TokenItem = ({ token, onSelect, allChecked }: TokenItemProps) => {
  const [checked, setChecked] = useState(allChecked);

  //used for checking all the boxes
  useEffect(() => setChecked(allChecked), [allChecked]);
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
        checked={checked || allChecked}
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
