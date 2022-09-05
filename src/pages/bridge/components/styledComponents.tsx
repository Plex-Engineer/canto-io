import styled from "@emotion/styled";

export const Container = styled.div`
  background-color: black;
  width: 800px;
  margin: 4rem auto;
  padding-bottom: 2.5rem;
  /* min-height: calc(100vh - 5rem); */
  border: 1px solid var(--primary-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 30px;
    font-weight: 300;
    line-height: 39px;
    letter-spacing: -0.1em;
    color: var(--off-white-color);
  }

  .loading {
    animation: rotate 2s linear infinite;
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .image-button {
    border: 1px solid transparent;

    &:hover {
      background-color: #111 !important;
      border: 1px solid var(--primary-color);
    }
  }

  .disabled {
    border: 1px solid transparent;

    &:hover {
      background-color: #1c1c1c !important;
      border: 1px solid transparent;
    }
  }
  .amount {
    background-color: black;
    border: none;
    width: 240px;
    font-size: 24px;
    text-align: right;
    color: white;
    &::placeholder {
      color: #999;
    }
    &:focus {
      outline: none;
    }
  }
  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.6rem;
  }

  .row {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    /* padding: 2rem; */
    h3 {
      padding-left: 1rem;
      color: white;
    }
  }
  .switchBtn {
    width: 100%;
    position: absolute;
    z-index: 1;
    hr {
      border: none;
      border-bottom: 1px solid #444;
      position: absolute;
      width: 100%;
      top: 50%;
      z-index: -1;
    }
  }
  .imgBtn {
    &:hover {
      border: 1px solid var(--primary-color);
      border-radius: 50%;
      cursor: pointer;
    }
  }

  .input {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #444;
    padding: 1rem;
    width: 80%;
    margin-top: 2rem;
    label {
      color: white;
      width: 30rem;
    }
  }

  .wallet-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 1rem;
    & > * {
      width: 100%;
    }

    .center {
      width: 60rem;
      justify-content: center;
      align-items: center;
    }

    img {
      width: 30px;
    }
    p {
      margin: 1rem;
      font-size: 22px;
      color: white;
    }
  }
`;
export const Balance = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #333;
  padding: 1rem 1.2rem;
  width: 80%;
  margin-top: 2rem;
  p {
    color: white;
    font-size: 22px;
    font-weight: 300;
    line-height: 26px;
    letter-spacing: 0em;
    text-align: left;
  }
`;

export const Center = styled.div`
  display: flex;
  justify-content: center;
  justify-items: center;
`;

const DestInput = styled.input`
  border: 1px solid #333;
  padding: 1rem;
  width: 35rem;
  background-color: black;
  border: none;
  font-size: 24px;
  text-align: center;
  color: white;
  &::placeholder {
    color: #999;
  }
  &:focus {
    outline: none;
  }
`;
