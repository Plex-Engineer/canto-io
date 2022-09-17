import { useEffect, useState } from "react";
import { openLink } from "./landingScript";
import "./style.scss";

const LandingPage = () => {
  const text =
    "Canto is a layer-1 blockchain built to deliver on the promise of DeFi. As a post-traditional financial movement, Canto enables accessibility, transparency, and freedom for new systems. Driven by a loosely organized collective of chain-native builders, Canto provides a new commons powered by free public infrastructure.";
  const [shownText, setShownText] = useState<[string, string]>(["", text]);
  useEffect(() => {
    function timeout(delay: number) {
      return new Promise((res) => setTimeout(res, delay));
    }
    async function setText() {
      for (let i = 0; i < text.length; i++) {
        await timeout(100);
        setShownText([
          text.substring(0, i + 1),
          text.substring(i + 1, text.length),
        ]);
      }
    }
    setText();
  }, []);
  useEffect(() => {
    const userInput = document.querySelector("#inputData");
    document.querySelector("#routes")?.addEventListener("click", (e) => {
      openLink(e.path[1].id);
    });
    userInput?.addEventListener("change", () => {
      const input = userInput.value.toString().replace("█", "");
      openLink(input);
    });
  }, [document.querySelector("#routes"), document.querySelector("#inputData")]);
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
        <div className="typing" id="typing">
          <span className="typing">{shownText[0]}</span>
          <span style={{ color: "#494949", textShadow: "none" }}>
            {shownText[1]}
          </span>
        </div>
        <ul className="options" id="routes">
          <li id="1">
            <a>[1] bridge</a>
          </li>
          <li id="2">
            <a>[2] convert</a>
          </li>
          <li id="3">
            <a>[3] staking</a>
          </li>
          <li id="4">
            <a>[4] lp interface</a>
          </li>
          <li id="5">
            <a>[5] lending</a>
          </li>
          <li id="6">
            <a>[6] governance</a>
          </li>
          <li id="7">
            <a>[7] docs</a>
          </li>
        </ul>
        <div className="seperator"></div>
        <div className="input-bar">
          <span className="tag">.canto@:\user_&gt; </span>
          <input type="text" id="inputData" />
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
