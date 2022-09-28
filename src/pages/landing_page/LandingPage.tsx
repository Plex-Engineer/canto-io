import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { openLink } from "./landingScript";
// import "./style.scss";
import Typing from "./Typing";

const LandingPage = () => {
  const [userInput, setUserInput] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [cursor, setCursor] = useState("█");
  function blinkAnimation() {
    if (showCursor) {
      setTimeout(() => {
        if (showCursor) {
          if (cursor) {
            setCursor("");
          } else setCursor("█");
        }
      }, 600);
    }
  }
  blinkAnimation();

  const pageList = [
    {
      name: "bridge",
      link: "/bridge",
    },
    {
      name: "governance",
      link: "/governance",
    },
    {
      name: "lending",
      link: "/lending",
    },
    {
      name: "lp interface",
      link: "/lp",
    },
    {
      name: "staking",
      link: "/staking",
    },
  ];
  function handleInputChange(value: string) {
    if (value.length > 0) {
      setShowCursor(false);
      setCursor("");
    } else {
      setShowCursor(true);
      setCursor("█");
    }
    setUserInput(value.replace("█", ""));
  }
  return (
    <div>
      <div className="layer"></div>
      <div className="overlayScan"></div>
      <div className="overlayStatic"></div>
      <div className="overlayAnimation"></div>
      <div className="container">
        <div className="title glitch">
          <span>Canto</span>
          Canto
          <span>Canto</span>
        </div>
        <div className="dim">*** enter a command to continue ***</div>
        <Typing />
        <ul className="options" id="routes">
          {pageList.map((page, idx) => {
            return (
              <NavLink to={page.link} key={page.name} id={page.name}>
                <a>{"[" + idx + "] " + page.name}</a>
              </NavLink>
            );
          })}
        </ul>
        <div className="seperator"></div>
        <div className="input-bar">
          <span className="tag">.canto@:\user_&gt; </span>
          <input
            type="text"
            id="inputData"
            value={userInput}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                openLink(userInput);
              }
            }}
          />
        </div>

        <div className="alert blink">
          <div id="error">invalid entry!</div>
          <div id="warning">launching soon.</div>
        </div>
      </div>
    </div>
  );
};
export default LandingPage;