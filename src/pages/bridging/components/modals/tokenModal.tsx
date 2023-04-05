import styled from "@emotion/styled";
import { BigNumber, BigNumberish } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { truncateNumber } from "global/utils/utils";
import { BaseToken } from "pages/bridging/config/interfaces";

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
  return (
    <Styled>
      <div className="token-list">
        {props.tokens
          ?.sort(
            (a, b) =>
              Number(
                formatUnits(b[props.balanceString] as BigNumberish, b.decimals)
              ) -
              Number(
                formatUnits(a[props.balanceString] as BigNumberish, a.decimals)
              )
          )
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
                <img src={token.icon} alt="" />
                <p>{token.name}</p>
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
        {props.extraTokenData &&
          props.extraTokenData.tokens
            ?.sort((a, b) => (b.name > a.name ? -1 : 1))
            .map((token) => (
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
                  <p>{token.name}</p>
                </span>
                <p className="balance">{props.extraTokenData?.balance}</p>
              </div>
            ))}
      </div>
    </Styled>
  );
};

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  width: 310px;
  p {
    font-size: 16px;
    font-weight: 500;
    line-height: 21px;
    letter-spacing: -0.03em;
    color: var(--primary-color);
  }
  span {
    display: flex;
    align-items: center;
    gap: 6px;
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
    /* scroll-behavior: smooth; */
    max-height: 200px;
    overflow-y: scroll;
    /* width */
    padding: 8px;
    .token-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 400;
      font-size: 18px;
      letter-spacing: -0.02em;
      height: 38px;
      padding: 0 14px;
      outline: none;
      cursor: pointer;
      img {
        margin: 6px;
        height: 18px;
        width: 18px;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }
    }
  }
`;

export default TokenModal;
