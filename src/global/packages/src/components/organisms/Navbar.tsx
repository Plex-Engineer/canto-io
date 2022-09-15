import { useEffect, useState } from "react";
import { formatBigNumber } from "../../utils/formatNumbers";
import { BurgerMenu } from "./BurgerMenu";
import Glitch from "../../components/molecules/Glitch";
import { OutlinedButton } from "../atoms/Button";
import { Text } from "../atoms/Text";
import Alert from "../atoms/Alert";
import styled from "@emotion/styled";
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
  const {
    onClick,
    chainId,
    account,
    balance,
    isConnected,
    currency,
    logo,
    currentPage,
    pageList,
  } = props;

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
          <BurgerMenu
            chainId={chainId}
            currentPage={currentPage}
            pageList={pageList}
          />
          <a id="logo" href="https://canto.io">
            <img src={logo} />
            <Glitch title={"canto"} />
          </a>
        </div>
        <Text id="title" type="title">
          {currentPage}
        </Text>
        {ConnectionButton(isConnected, balance, currency, account, onClick)}
      </nav>
    </Container>
  );
};

const Container = styled.div`
  position: sticky;
  top: 0%;
  z-index: 12;

  .scroll {
    border-bottom: 1px solid var(--primary-color);
    background-color: #09221454;
    backdrop-filter: blur(5px);
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
function ConnectionButton(
  isConnected: boolean,
  balance: string,
  currency: string,
  account: string,
  onClick: () => void
) {
  return (
    <div className="wallet">
      {isConnected ? (
        <OutlinedButton
          size="x-sm"
          onClick={() => {
            // setIsModalOpen(true)
          }}
        >
          <span className="hide-on-mobile">
            {formatBigNumber(balance)}&nbsp;
          </span>
          <span
            className="hide-on-mobile"
            style={{
              fontWeight: "600",
              gap: "10px",
            }}
          >
            {currency}
          </span>
          <div
            className="hide-on-mobile"
            style={{
              marginLeft: "4px",
              marginRight: "2px",
            }}
          >
            |
          </div>
          {account?.substring(0, 5) + "..."}
        </OutlinedButton>
      ) : (
        <OutlinedButton onClick={onClick}>
          connect <span className="hide-on-mobile">&nbsp;wallet</span>
        </OutlinedButton>
      )}
      <ModalManager />
    </div>
  );
}
