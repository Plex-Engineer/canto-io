import { useState } from "react";
import { NavLink } from "react-router-dom";
import { openLink } from "./landingScript";
import { Styled } from "./styled";
import Typing from "./Typing";
import { pageList } from "global/config/pageList";
import HelmetSEO from "global/components/seo";

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
    <>
      <HelmetSEO
        title="Canto - Home Page"
        description="Canto Homepage serves De-fi applications"
        link=""
      />
      <Styled>
        <div className="container">
          <h1>Canto</h1>
          <Typing />

          <div className="dim">*** enter a command to continue ***</div>
          <ul className="options" id="routes">
            {pageList.map((page, idx) => {
              return (
                <NavLink to={page.link} key={page.name} id={page.name}>
                  <a>{"[" + idx + "] " + page.name}</a>
                </NavLink>
              );
            })}
          </ul>
          <div className="alert blink">
            <div id="error">invalid entry!</div>
            <div id="warning">launching soon.</div>
          </div>
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
        </div>
      </Styled>
    </>
  );
};
export default LandingPage;
