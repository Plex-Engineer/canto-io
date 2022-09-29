import styled from "@emotion/styled";
import backBtn from "../../../assets/back-btn.svg";
import { NativeGTokens } from "../hooks/useCosmosTokens";
import { selectedEmptyToken } from "../stores/gravityStore";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: black;
  height: 75vh;
  width: 600px;
  padding: 2rem;

  header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
    h1 {
      font-weight: 300;
      font-size: 26px;
      line-height: 130%;
      text-align: center;
      letter-spacing: -0.1em;
      color: #efefef;
    }
    img {
      width: 28px;
      &:hover {
        cursor: pointer;
      }
    }
  }

  input[type="search"] {
    background-color: #191919;
    color: white;
    font-size: 18px;
    padding: 1rem;
    border: 2px solid #191919;
    appearance: none;
    -webkit-appearance: none;
    &:focus {
      border: 2px solid var(--primary-color);
      outline: none;
    }
  }
  .token-list {
    overflow-y: scroll;
    scrollbar-color: var(--primary-color);
    scroll-behavior: smooth;
    /* width */

    .token-item {
      display: flex;
      font-weight: 400;
      font-size: 18px;
      letter-spacing: -0.02em;
      /* text-transform: lowercase; */
      color: var(--off-white-color);
      padding: 2rem 0;
      border: 1px solid black;

      img {
        margin: 0 1rem;
        width: 28px;
        height: 28px;
      }

      &:hover {
        background-color: #001a0e;
        border: 1px solid var(--primary-color);
      }
    }
  }
`;

interface Props {
  onClose: (value?: NativeGTokens) => void;
  tokens: NativeGTokens[] | undefined;
}

const TokenModal = (props: Props) => {
  return (
    <Container>
      <header>
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            props.onClose(selectedEmptyToken);
          }}
        >
          <img src={backBtn} />
        </div>
        <h1>select a token</h1>
        <span
          style={{
            width: "28px",
          }}
        ></span>
      </header>
      {/* <input
        type="search"
        name="search"
        id="tokenSearch"
        autoComplete="new-off"
        placeholder="type name or paste address..."
      /> */}
      <div className="token-list">
        {props.tokens?.map((token) => (
          <div
            role="button"
            tabIndex={0}
            key={token.data.icon}
            className="token-item"
            onClick={() => {
              props.onClose(token);
            }}
          >
            <img src={token.data.icon} alt="" />
            <p>{token.data.name}</p>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default TokenModal;
