import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import { CInput } from "global/packages/src/components/atoms/Input";
import { BaseToken, Step1TokenGroups } from "pages/bridging/config/interfaces";
import { useState } from "react";
import { levenshteinDistance } from "global/utils/search";

interface Props {
  tokenGroups: Step1TokenGroups[];
  onClose: (value?: BaseToken) => void;
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
      ) <= 2 ||
      searchString === ""
    );
  }
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
      {!props.tokenGroups.length && (
        <div className="expanded">
          <Text size="text2">no tokens found</Text>
        </div>
      )}
      <div className="token-list">
        {props.tokenGroups.map((group, idx) => (
          <div key={group.groupName + idx}>
            <div key={group.groupName} className="header">
              <Text type="title" align="left">
                {group.groupName}
              </Text>
            </div>
            {group.tokens
              ?.filter((token) =>
                inSearch(userSearch, token.name, token.symbol)
              )
              .sort((a, b) => {
                if (
                  !isNaN(Number(group.getBalance(a))) &&
                  isNaN(Number(group.getBalance(b)))
                )
                  return -1;
                else if (
                  isNaN(Number(group.getBalance(a))) &&
                  !isNaN(Number(group.getBalance(b)))
                )
                  return 1;
                else if (
                  isNaN(Number(group.getBalance(a))) &&
                  isNaN(Number(group.getBalance(b)))
                )
                  return 0;
                return Number(group.getBalance(a)) > Number(group.getBalance(b))
                  ? -1
                  : 1;
              })
              .map((token) => (
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
                  {group.getBalance(token) != "ibc" && (
                    <p className="balance">{group.getBalance(token)}</p>
                  )}
                </div>
              ))}
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
    /* scrollbar-color: var(--primary-color); */
    scroll-behavior: smooth;
    overflow-y: auto;
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
