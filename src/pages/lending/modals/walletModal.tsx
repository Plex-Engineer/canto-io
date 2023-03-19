import styled from "@emotion/styled";
import logo from "assets/logo.svg";
import metamask from "assets/wallets/metamask.svg";
import walletConnect from "assets/wallets/walletconnect.svg";
import tally from "assets/wallets/tally.svg";
import coinBase from "assets/wallets/coinbase.svg";
import ledger from "assets/wallets/ledger.svg";
import { useEthers } from "@usedapp/core";
import { useState } from "react";
import { setSafeConnector } from "global/components/cantoNav";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: black;
  height: 100vh;
  width: 700px;
  align-items: center;
  & > img {
    margin-top: 4rem;
    margin-bottom: 1rem;
  }
  & > p {
    font-size: 18px;
    font-weight: 400;
    line-height: 23px;
    color: #efefef;
    margin-bottom: 3rem;
  }

  .wallet-list {
    border: 1px solid #222;
    width: 90%;
  }
  .wallet-item {
    display: flex;
    cursor: pointer;
    img {
      height: 30px;
      width: 30px;
      margin-right: 2rem;
    }

    padding: 2rem;
    border: 1px solid black;
    border-top: 1px solid #222;

    &:hover {
      background-color: #001a0e;
      border: 1px solid var(--primary-color);
      p {
        color: var(--primary-color);
      }
    }

    p {
      font-size: 20px;
      color: #efefef;
    }
  }

  footer {
    margin-top: 2.4rem;
    letter-spacing: -0.05em;
    color: #efefef67;
  }

  @media (max-width: 1000px) {
    width: 100%;
    padding: 0 2rem;
    .wallet-list {
      width: 100%;
    }
  }
`;

const LoadingBar = styled.div`
  height: 4px;
  width: 200px;
  background-color: #242424;

  clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
  &::before {
    content: "";
    display: flex;
    height: 100%;
    width: 80px;
    background-color: var(--primary-color);
    @keyframes slide {
      0% {
        transform: translateX(-80px);
      }
      100% {
        transform: translateX(200px);
      }
    }
    animation: slide 1s linear infinite;
  }
`;

interface IProps {
  onClose: () => void;
}
const WalletModal = ({ onClose }: IProps) => {
  const { account, activateBrowserWallet, isLoading } = useEthers();
  const isConnected = account !== undefined;
  const [inSafe, setInSafe]= useState(false);
  setSafeConnector().then((value)=>{
    setInSafe(value);
  })
  if (isConnected) {
    onClose();
  }
  if (isLoading) {
    return (
      <Container
        style={{
          justifyContent: "center",
        }}
      >
        <LoadingBar />
        <p
          style={{
            marginTop: "2rem",
            textAlign: "center",
          }}
        >
          confirm the transaction
          <br /> with metamask
        </p>
      </Container>
    );
  } else {
    return (
      <Container>
        <img src={logo} alt="Canto" height={40} />
        <p>connect wallet to start using canto</p>

        <div className="wallet-list">
          <div
            className="wallet-item"
            onClick={() => {
              inSafe? activateBrowserWallet({ type: "safe" }) : activateBrowserWallet({ type: "metamask" })
              //TODO: fix on cancel go back
            }}
          >
            <img src={metamask} alt="Canto" height={54} />
            <p>metamask</p>
          </div>
          <div className="wallet-item">
            <img src={ledger} alt="Canto" height={54} />
            <p>ledger</p>
          </div>
          <div className="wallet-item">
            <img src={walletConnect} alt="Canto" height={54} />
            <p>wallet connect</p>
          </div>
          <div className="wallet-item">
            <img src={coinBase} alt="Canto" height={54} />
            <p>coinbase wallet</p>
          </div>
          <div className="wallet-item">
            <img src={tally} alt="Canto" height={54} />
            <p>tally</p>
          </div>
        </div>

        <footer>
          by connecting, I accept canto’s <u>terms of service</u>
        </footer>
      </Container>
    );
  }
};

export default WalletModal;
