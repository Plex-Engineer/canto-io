import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";

import {
  CantoMainnet,
  CantoTestnet,
  CTOKENS,
  OutlinedButton,
  Text,
  TOKENS,
} from "cantoui";
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

interface TokenListCategory {
  name: string;
  tokens: AddTokenItemProps[];
}
interface AddTokenItemProps {
  symbol: string;
  address: string;
  decimals: number;
  icon: string;
}
function sortTokens(tokens: AddTokenItemProps[]) {
  return tokens.sort((a, b) => {
    if (a.symbol < b.symbol) {
      return -1;
    }
    if (a.symbol > b.symbol) {
      return 1;
    }
    return 0;
  });
}

const fullTokenList = (chainId: number): TokenListCategory[] => {
  const tokens: AddTokenItemProps[] = [];
  const cTokens: AddTokenItemProps[] = [];
  const lpTokens: AddTokenItemProps[] = [];
  if (chainId == CantoMainnet.chainId) {
    Object.entries(TOKENS.cantoMainnet).forEach(([key, token]) => {
      if (token.name == "Canto") return;
      if (token.isLP) {
        lpTokens.push({
          symbol: token.name,
          address: token.address,
          decimals: token.decimals,
          icon: token.icon,
        });
      } else {
        tokens.push({
          symbol: token.name,
          address: token.address,
          decimals: token.decimals,
          icon: token.icon,
        });
      }
    });
    Object.entries(CTOKENS.cantoMainnet).forEach(([key, token]) => {
      cTokens.push({
        symbol: token.name,
        address: token.address,
        decimals: token.decimals,
        icon: token.underlying.icon,
      });
    });
  } else if (chainId == CantoTestnet.chainId) {
    Object.entries(TOKENS.cantoTestnet).forEach(([key, token]) => {
      if (token.name == "Canto") return;
      if (token.isLP) {
        lpTokens.push({
          symbol: token.name,
          address: token.address,
          decimals: token.decimals,
          icon: token.icon,
        });
      } else {
        tokens.push({
          symbol: token.name,
          address: token.address,
          decimals: token.decimals,
          icon: token.icon,
        });
      }
    });
    Object.entries(CTOKENS.cantoTestnet).forEach(([key, token]) => {
      cTokens.push({
        symbol: token.name,
        address: token.address,
        decimals: token.decimals,
        icon: token.underlying.icon,
      });
    });
  }
  return [
    {
      name: "Tokens",
      tokens: sortTokens(tokens),
    },
    {
      name: "cTokens",
      tokens: sortTokens(cTokens),
    },
    {
      name: "LP Tokens",
      tokens: sortTokens(lpTokens),
    },
  ];
};

function getAllTokens(categories: TokenListCategory[]): AddTokenItemProps[] {
  const allTokens: AddTokenItemProps[] = [];
  categories.forEach((category) => allTokens.push(...category.tokens));
  return allTokens;
}
interface TokenModalProps {
  chainId: number;
}
const TokensModal = ({ chainId }: TokenModalProps) => {
  const [selectedTokens, setSelectedTokens] = useState<AddTokenItemProps[]>([]);
  const [tokenList, setTokenList] = useState<TokenListCategory[]>(
    fullTokenList(chainId)
  );
  const allTokens = getAllTokens(tokenList);

  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    if (!userSearch) {
      setTokenList(fullTokenList(chainId));
    } else {
      setTokenList(
        fullTokenList(chainId).map((category) => {
          return {
            name: category.name,
            tokens: (category.tokens = category.tokens.filter((token) =>
              token.symbol.toLowerCase().includes(userSearch.toLowerCase())
            )),
          };
        })
      );
    }
  }, [userSearch]);
  return (
    <Styled>
      <div className="title">Import Tokens</div>
      <input
        value={userSearch}
        onChange={(e) => setUserSearch(e.target.value)}
      />
      {allTokens.length > 0 ? (
        <React.Fragment>
          <div className="scroll-view">
            {tokenList.map((category) => (
              <div key={category.name}>
                <Text type="text">{category.name}</Text>
                {category.tokens.map((token) => {
                  return (
                    <TokenItem
                      token={token}
                      key={token.symbol}
                      isSelected={
                        selectedTokens.filter((t) => t.symbol == token.symbol)
                          .length > 0
                      }
                      onSelect={(token, selected) => {
                        if (selected) {
                          setSelectedTokens([...selectedTokens, token]);
                        } else {
                          setSelectedTokens(
                            selectedTokens.filter(
                              (t) => t.symbol != token.symbol
                            )
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
                {selectedTokens.length}/{allTokens.length}
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <p>select all</p>
                <CheckBox
                  checked={selectedTokens.length == allTokens.length}
                  onChange={() => {
                    if (selectedTokens.length != allTokens.length) {
                      setSelectedTokens(allTokens);
                    } else {
                      setSelectedTokens([]);
                    }
                  }}
                />
              </div>
            </div>
          }
        </React.Fragment>
      ) : (
        <div style={{ marginTop: "50%" }}>
          {userSearch ? (
            <Text>no tokens match search</Text>
          ) : (
            <Text>please switch to canto network to add tokens</Text>
          )}
        </div>
      )}
    </Styled>
  );
};

interface TokenItemProps {
  token: AddTokenItemProps;
  isSelected: boolean;
  onSelect: (token: AddTokenItemProps, selected: boolean) => void;
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
const TokenItem = ({ token, onSelect, isSelected }: TokenItemProps) => {
  return (
    <ItemStyled
      onClick={() => {
        onSelect(token, !isSelected);
      }}
    >
      <div className="row">
        <img src={token.icon} alt={token.symbol} height={30} />
        <div className="type">{token.symbol}</div>
      </div>
      <CheckBox
        checked={isSelected}
        onChange={(val) => {
          //   setChecked(val);
        }}
      />
    </ItemStyled>
  );
};

export async function addTokens(tokens: AddTokenItemProps[]) {
  for (const tokenObj of tokens) {
    try {
      if (tokenObj.symbol != "Canto") {
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
