import { useEffect, useState } from "react";
// import "./style.scss";

const Typing = () => {
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
  return (
    <div className="typing" id="typing">
      <span className="typing">{shownText[0]}</span>
      <span style={{ color: "#494949", textShadow: "none" }}>
        {shownText[1]}
      </span>
    </div>
  );
};
export default Typing;
