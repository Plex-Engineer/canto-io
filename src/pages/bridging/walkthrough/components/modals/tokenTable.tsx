import styled from "@emotion/styled";
import { Text } from "global/packages/src";
interface Props {
  tokens: {
    name: string;
    main: string;
    gBridge: string;
    canto: string;
  }[];
  onClose: () => void;
}
const TokenTable = ({ tokens, onClose }: Props) => {
  //sums up all the balances and only shows up if the sumOf is gt than 0
  function isValidToken(eth: string, bridge: string, native: string): boolean {
    const value = Number(eth) + Number(bridge) + Number(native);

    return value > 0;
  }
  return (
    <Styled>
      <Text type="title" align="left">
        Ethereum Tokens
      </Text>
      <div className="table">
        <Text
          type="text"
          size="title3"
          bold
          style={{
            backgroundColor: "#1a1a1a",
            borderTopLeftRadius: "4px",
            borderColor: "#333",
          }}
        >
          token
        </Text>
        <Text
          type="text"
          size="title3"
          bold
          style={{
            backgroundColor: "#1a1a1a",
            borderColor: "#333",
          }}
        >
          ethereum
        </Text>
        <Text
          type="text"
          size="title3"
          bold
          style={{
            backgroundColor: "#1a1a1a",
            borderColor: "#333",
          }}
        >
          queued
        </Text>{" "}
        <Text
          type="text"
          size="title3"
          bold
          style={{
            backgroundColor: "#1a1a1a",
            borderTopRightRadius: "4px",
            borderColor: "#333",
          }}
        >
          canto
        </Text>
        {tokens.map((token) =>
          token.main == "-1" ? null : (
            <>
              <Text type="text" color="white" size="title3">
                {token.name}
              </Text>
              <Text type="text" color="white" size="title3">
                {token.main}
              </Text>
              <Text type="text" color="white" size="title3">
                {token.gBridge}
              </Text>
              <Text type="text" color="white" size="title3">
                {token.canto}
              </Text>
            </>
          )
        )}
      </div>

      {tokens.filter(
        (token) =>
          token.main == "-1" && isValidToken("0", token.gBridge, token.canto)
      ).length > 0 && (
        <>
          <Text
            type="title"
            align="left"
            style={{
              marginTop: "2rem",
            }}
          >
            Cosmos Tokens
          </Text>
          <div
            className="table"
            style={{
              gridTemplateColumns: "1fr 1fr 1fr ",
            }}
          >
            <Text
              type="text"
              size="title3"
              bold
              style={{
                backgroundColor: "#1a1a1a",
                borderTopLeftRadius: "4px",
                borderColor: "#333",
              }}
            >
              token
            </Text>
            <Text
              type="text"
              size="title3"
              bold
              style={{
                backgroundColor: "#1a1a1a",
                borderColor: "#333",
              }}
            >
              queued
            </Text>
            <Text
              type="text"
              size="title3"
              bold
              style={{
                backgroundColor: "#1a1a1a",
                borderTopRightRadius: "4px",
                borderColor: "#333",
              }}
            >
              canto
            </Text>
            {tokens.map(
              (token) =>
                token.main == "-1" &&
                isValidToken("0", token.gBridge, token.canto) && (
                  <>
                    <Text type="text" color="white" size="title3">
                      {token.name}
                    </Text>
                    <Text type="text" color="white" size="title3">
                      {token.gBridge}
                    </Text>
                    <Text type="text" color="white" size="title3">
                      {token.canto}
                    </Text>
                  </>
                )
            )}
          </div>
        </>
      )}
    </Styled>
  );
};

const Styled = styled.div`
  padding: 0 2rem;
  .table {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1rem;
    border: 1px solid #222;
    background-color: #111;
    border-radius: 4px;
    grid-gap: 0;
    margin-top: 6px;
    & > * {
      border: 1px solid #1e1e1e;
      padding: 1rem;
    }
  }

  @media (max-width: 1000px) {
    width: 100%;
    p {
      font-size: 14px;
    }
  }
`;
export default TokenTable;
