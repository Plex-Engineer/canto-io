import noteIcon from "assets/note.svg";
import cantoIcon from "assets/logo.svg";
interface Props {
  height?: number;
  width?: number;
  padding?: number;
  token: "canto" | "note";
}
const TokenSymbol = ({ width, height, padding, token }: Props) => {
  if (!height || !width) {
    width = 20;
  }
  if (!padding) {
    padding = 4;
  }
  return (
    <img
      src={token == "canto" ? cantoIcon : noteIcon}
      width={width}
      style={{
        padding: `0 ${padding + "px"}`,
      }}
      height={height}
      alt="note token"
    />
  );
};

export default TokenSymbol;
