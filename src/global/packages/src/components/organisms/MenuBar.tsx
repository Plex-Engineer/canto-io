/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Page } from "./Navbar";
import menuImg from "assets/icons/menu.svg";
import closeImg from "assets/icons/close.svg";
import ImageButton from "global/components/ImageButton";
import { useState } from "react";
import styled from "@emotion/styled";
import cantoFullImg from "assets/logo-full.svg";
import { Link } from "react-router-dom";
import { Text2 } from "../atoms/Text2";
import { OutlinedButton } from "../atoms/Button";
import { addCantoToKeplr } from "../../utils/walletFunctionality";
import useGlobalModals, { ModalType } from "../../stores/useModals";
interface BurgerMenuProps {
  chainId: number;
  pageList?: Page[];
  currentPage?: string;
}

const MenuBar = ({ chainId, currentPage, pageList }: BurgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const setModalType = useGlobalModals((state) => state.setModalType);

  return (
    <Styled isOpen={isOpen}>
      {/* <Styled className={isOpen ? "active" : ""}> */}
      <div
        className="menu-btn"
        // style={{
        //   transform: isOpen ? "translateX(200px)" : "translateX(0)",
        // }}
      >
        <ImageButton
          src={menuImg}
          height={27}
          width={27}
          alt="menu"
          onClick={() => {
            setIsOpen(true);
          }}
        />
      </div>
      <div
        className="overlay"
        onClick={() => {
          setIsOpen(false);
        }}
      ></div>
      <div className="content">
        <header>
          <img src={cantoFullImg} alt="canto logo" />
          <div
            className="menu-btn"
            // style={{
            //   transform: isOpen ? "translateX(200px)" : "translateX(0)",
            // }}
          >
            <ImageButton
              src={closeImg}
              height={27}
              width={27}
              alt="menu"
              onClick={() => {
                setIsOpen(false);
              }}
            />
          </div>
        </header>
        <div className="navlinks">
          {pageList?.map((page, idx) => {
            return (
              <Navlink
                id={page.name}
                className={`menu-item ${
                  currentPage == page.name ? "active" : ""
                }`}
                to={page.link}
                key={page.name}
              >
                <Text2 size="text3" type="title" align="left" id={page.name}>
                  {"0" + (idx + 1) + " " + page.name}
                </Text2>
              </Navlink>
            );
          })}
        </div>
        <footer>
          <OutlinedButton
            onClick={() => {
              // addTokens(chainId);
              setModalType(ModalType.TOKENS);
            }}
          >
            import tokens
          </OutlinedButton>
          {/* <OutlinedButton
          onClick={() => {
            addCTokens(chainId);
          }}
          style={styles.buttonStyle}
        >
          import cTokens
        </OutlinedButton> */}
          <OutlinedButton
            onClick={() => {
              addCantoToKeplr();
            }}
          >
            add to keplr
          </OutlinedButton>
          <div className="links">
            <a href="https://forms.gle/gkr5pDZYX8ZRWYWJ8">report a bug</a>
            <a href="https://docs.canto.io/">docs</a>
          </div>
        </footer>
      </div>
    </Styled>
  );
};

interface MenuState {
  isOpen: boolean;
}
const Styled = styled.div<MenuState>`
  .menu-btn {
    transition: all 0.4s;
    z-index: 200;
  }
  .navlinks {
    flex: 2;
    /* margin-top: 40%; */
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .overlay {
    position: absolute;
    top: 0%;
    left: 0%;
    width: calc(100%);
    height: 100vh;
    background-color: #05030b52;
    /* backdrop-filter: blur(1px); */
    opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};

    transition: opacity 0.4s;
    pointer-events: ${({ isOpen }) => (isOpen ? "all" : "none")};
  }

  .content {
    position: absolute;
    top: 0%;
    left: ${({ isOpen }) => (isOpen ? "0px" : "-260px")};
    background-color: black;
    width: 260px;
    height: 100vh;
    z-index: 100;
    transition: all 0.4s;
    display: flex;
    flex-direction: column;
  }

  .links {
    text-align: center;
    display: flex;
    flex-direction: column;
    row-gap: 15px;
  }

  header {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
  }
  footer {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 2rem;
  }

  .active {
    &::before {
      transform: scaleY(1);
    }
    opacity: 1;
    border-right: 4px solid var(--primary-color);
  }
`;

const Navlink = styled(Link)`
  display: flex;
  text-align: left;
  width: 100%;
  padding: 1rem 1.4rem;
  opacity: 0.5;
  position: relative;
  transition: all 0.1s;

  /* &:hover {
    background-color: #01190f;
    opacity: 1;
  } */
  &:hover::before {
    transform: scaleY(1);
  }
  &:before {
    content: " ";
    position: absolute;
    transition: all 130ms ease-in;
    background-color: #01190f;
    transform: scaleY(0);
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
`;

export default MenuBar;
