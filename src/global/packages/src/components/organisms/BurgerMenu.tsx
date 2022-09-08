import {
  addCTokens,
  addTokens,
  addCantoToKeplr,
} from "../../utils/walletFunctionality";
import { slide as Menu } from "react-burger-menu";
import { OutlinedButton } from "../atoms/Button";
import { Text } from "../atoms/Text";
import { StylesDictionary } from "../../utils/StylesDictionary";
import styled from "styled-components";
import { Page } from "./Navbar";
import { Link } from "react-router-dom";

interface BurgerMenuProps {
  chainId: number;
  pageList?: Page[];
  currentPage?: string;
}

export const BurgerMenu = ({
  chainId,
  currentPage,
  pageList,
}: BurgerMenuProps) => {
  return (
    <WrapperMenu styles={BurgerStyles}>
      <h2 className="title">terminal</h2>
      {pageList?.map((page) => {
        return (
          <Navlink
            style={styles.link}
            id={page.name}
            className="menu-item"
            to={page.link}
            key={page.name}
          >
            <Text type="text" align="left" id={page.name}>
              {currentPage == page.name ? "---" : ""}
              {"> " + page.name}
            </Text>
          </Navlink>
        );
      })}
      <div style={styles.buttonDiv}>
        <OutlinedButton
          onClick={() => {
            addTokens(chainId);
          }}
          style={styles.buttonStyle}
        >
          import tokens
        </OutlinedButton>
        <OutlinedButton
          onClick={() => {
            addCTokens(chainId);
          }}
          style={styles.buttonStyle}
        >
          import cTokens
        </OutlinedButton>
        <OutlinedButton
          onClick={() => {
            addCantoToKeplr();
          }}
          style={styles.buttonStyle}
        >
          add canto to keplr
        </OutlinedButton>
      </div>
      <div style={styles.bottomLinks}>
        <a
          style={{ ...styles.link, fontWeight: "100" }}
          id="bug"
          className="menu-item"
          href="https://kwzwx5buwy5.typeform.com/to/NqemyLFT"
        >
          <Text type="text">report a bug</Text>
        </a>
        <a
          style={styles.link}
          id="docs"
          className="menu-item"
          href="https://canto.gitbook.io/canto/overview/about-canto"
        >
          <Text type="text">docs</Text>
        </a>
      </div>
    </WrapperMenu>
  );
};

const BurgerStyles = {
  bmBurgerButton: {
    position: "sticky",
    width: "36px",
    height: "30px",
    left: "36px",
    top: "36px",
    marginTop: "3px",
  },

  bmBurgerBars: {
    background: "var(--primary-color)",
  },
  bmBurgerBarsHover: {
    background: "var(--primary-color)",
  },
  bmCrossButton: {
    height: "24px",
    width: "24px",
  },
  bmCross: {
    background: "var(--primary-color)",
  },
  bmMenuWrap: {
    position: "fixed",
    height: "100vh",
    top: "0",
    left: "0",
  },
  bmMenu: {
    background: "#000000",
    padding: "0em .5em 0",
    fontSize: "1.15em",
  },
  bmMorphShape: {
    fill: "#373a47",
  },
  bmItemList: {
    color: "var(--primary-color)",
    // padding: '.8em',
    textAlign: "center",
    // marginTop: '30px',
  },
  bmItem: {
    display: "block",
    color: "var(--primary-color)",
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.3)",
    width: "0",
    height: "0",
  },
};

const styles: StylesDictionary = {
  buttonStyle: {
    width: "90%",
    margin: "5%",
    marginTop: "20px",
  },
  link: {
    textDecoration: "none",
    textAlign: "left",
    color: "red",
  },
  text: {
    textAlign: "left",
    paddingLeft: "1.2rem",
  },
  bottomLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "30px",
  },
  buttonDiv: {
    marginTop: "100px",
  },
};

const Navlink = styled(Link)`
  text-align: left;
  margin-top: 30px;
  padding-left: 2rem;
`;

const WrapperMenu = styled(Menu)`
  .title {
    margin-top: 2rem;
  }
`;
