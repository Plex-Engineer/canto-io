import styled from "@emotion/styled";
import { BigNumber, BigNumberish } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { Text } from "global/packages/src";
import { CInput } from "global/packages/src/components/atoms/Input";
import { truncateNumber } from "global/utils/utils";
import { BaseToken } from "pages/bridging/config/interfaces";
import { useState } from "react";
import { levenshteinDistance } from "pages/staking/utils/utils";

interface Props {
  onClose: (value?: BaseToken) => void;
  tokens: BaseToken[] | undefined;
  balanceString: string;
  extraTokenData?: {
    tokens: BaseToken[];
    balance: string;
    onSelect: (value: BaseToken) => void;
  };
}

const TokenModal = (props: Props) => {
  const [userSearch, setUserSearch] = useState("");
  function inSearch(
    searchString: string,
    tokenName: string,
    tokenSymbol: string
  ): boolean {
    return (
      levenshteinDistance(
        searchString.toLowerCase(),
        tokenName.toLowerCase()
      ) <= 2 ||
      levenshteinDistance(
        searchString.toLowerCase(),
        tokenSymbol.toLowerCase()
      ) <= 2
    );
  }
  const dexTokens = props.tokens
    ?.sort(
      (a, b) =>
        Number(
          formatUnits(b[props.balanceString] as BigNumberish, b.decimals)
        ) -
        Number(formatUnits(a[props.balanceString] as BigNumberish, a.decimals))
    )
    .filter((item) => inSearch(userSearch, item.name, item.symbol));
  const ibcTokens =
    props.extraTokenData &&
    props.extraTokenData.tokens
      ?.sort((a, b) => (b.name > a.name ? -1 : 1))
      .filter((item) => inSearch(userSearch, item.name, item.symbol));
  return (
    <Styled>
      <div className="modal-title">
        <Text type="title" align="left" size="title3">
          choose token
        </Text>
      </div>
      <div className="search">
        <CInput
          value={userSearch}
          placeholder="Token Name"
          onChange={(e) => setUserSearch(e.target.value)}
        />
      </div>

      {dexTokens?.length == 0 && ibcTokens?.length == 0 && (
        <div className="expanded">
          <Text size="text2">no tokens found</Text>
        </div>
      )}
      <div className="token-list">
        {dexTokens && dexTokens.length > 0 && (
          <div className="header">
            <Text type="title" align="left">
              native Tokens
            </Text>
          </div>
        )}
        {dexTokens?.map((token) => (
          <div
            role="button"
            tabIndex={0}
            key={token.address}
            className="token-item"
            onClick={() => {
              props.onClose(token);
            }}
          >
            <span>
              <img src={token.icon} alt={token.name} />
              <Text color="white">{token.symbol}</Text>
            </span>
            <p className="balance">
              {props.balanceString
                ? truncateNumber(
                    formatUnits(
                      BigNumber.from(token[props.balanceString]),
                      token.decimals
                    )
                  )
                : ""}
            </p>
          </div>
        ))}
        {ibcTokens && ibcTokens.length > 0 && (
          <div className="header">
            <Text type="title" align="left">
              IBC Tokens
            </Text>
          </div>
        )}
        {ibcTokens &&
          ibcTokens.map((token) => (
            <div
              role="button"
              tabIndex={0}
              key={token.icon}
              className="token-item"
              onClick={() => {
                props.extraTokenData?.onSelect(token);
              }}
            >
              <span>
                <img src={token.icon} alt="" />
                <p>{token.symbol}</p>
              </span>
              {/* <p className="balance">{props.extraTokenData?.balance}</p> */}
            </div>
          ))}
      </div>
    </Styled>
  );
};

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  width: 30rem;
  max-height: 42rem;
  overscroll-y: scroll;

  .search {
    margin: 6px;
    padding: 0 14px;

    input {
      max-width: 100%;
      width: 80vw;
    }
  }

  .header {
    padding: 16px;
  }

  .expanded {
    display: flex;
    justify-content: center;
    align-items: center;
    max-height: 36rem;
    height: 100vmax;

    p {
      color: #888;
    }
  }
  span {
    display: flex;
    align-items: center;
    gap: 6px;
    /* background: red; */
  }
  .balance {
    font-size: 16px;
    font-weight: 400;
    line-height: 21px;
    letter-spacing: -0.03em;
    text-align: right;
  }
  .token-list {
    scrollbar-color: var(--primary-color);
    scroll-behavior: smooth;
    overflow-y: scroll;
    padding: 16px;

    /* background: red; */
    .token-item {
      display: flex;
      align-items: center;
      justify-content: space-between;

      height: 60px;
      padding: 0 14px;
      outline: none;
      cursor: pointer;
      img {
        margin: 8px;
        height: 32px;
        width: 32px;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }
    }
  }
`;

export default TokenModal;
