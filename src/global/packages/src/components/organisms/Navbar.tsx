import { useEffect, useState } from "react";
import Glitch from "../../components/molecules/Glitch";
import { Text } from "../atoms/Text";
import Alert from "../atoms/Alert";
import styled from "@emotion/styled";
import ConnectWallet from "./ConnectWallet";
import MenuBar from "./MenuBar";
import ModalManager from "../molecules/ModalManager";

export interface Page {
  name: string;
  link: string;
}
interface Props {
  onClick: () => void;
  chainId: number;
  account: string;
  balance: string;
  isConnected: boolean;
  currency: string;
  logo: string;
  pageList: Page[];
  currentPage?: string;
}

export const NavBar = (props: Props) => {
  const { chainId, logo, currentPage, pageList } = props;

  const [onScroll, setOnScroll] = useState(false);

  const changeNavbarColor = () => {
    if (window.scrollY >= 2) {
      setOnScroll(true);
    } else {
      setOnScroll(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", changeNavbarColor);
  }, []);

  return (
    <Container>
      <Alert />
      <nav className={onScroll ? "scroll" : ""}>
        <div className="menu">
          <MenuBar
            chainId={chainId}
            currentPage={currentPage}
            pageList={pageList}
          />
          <a id="logo" href="/">
            <img src={logo} />
            <Glitch title={"canto"} />
          </a>
        </div>
        <Text id="title" type="title">
          {currentPage}
        </Text>
        <ConnectWallet {...props} />
        <ModalManager chainId={chainId} />
      </nav>
    </Container>
  );
};

const Container = styled.div`
  position: sticky;
  top: 0%;
  z-index: 12;
  transition: all 1s;

  .scroll {
    /* border-bottom: 1px solid var(--primary-color);
    background-color: #09221454;
    backdrop-filter: blur(5px); */
    animation: scroll-down 1s forwards ease;
  }

  @keyframes scroll-down {
    0% {
      border-bottom: 1px solid transparent;
      background-color: transparent;
      backdrop-filter: blur(0px);
    }
    100% {
      border-bottom: 1px solid var(--primary-color);
      background-color: #09221454;
      backdrop-filter: blur(5px);
    }
  }
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.4rem;
  }
  & > nav {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    padding: 1rem;
    transition: all 0.1s ease-in-out;

    .menu {
      display: flex;
    }
    .wallet {
      display: flex;
      justify-content: end;
    }
    #title {
      font-family: Silkscreen;
      font-size: 44px;
      letter-spacing: -0.08em;
    }
    #logo {
      color: var(--primary-color);
      font-weight: bold;
      font-size: 24px;
      display: flex;
      align-items: center;
      text-align: center;
      text-decoration: none;
      margin-left: 1rem;
    }

    @media (max-width: 1000px) {
      #logo {
        display: none;
      }

      #title {
        font-size: 18px;
        flex: 6 !important;
      }

      .hide-on-mobile {
        display: none;
      }

      button {
        padding: 0.5rem;
      }
    }
  }
`;
