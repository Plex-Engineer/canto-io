import { PrimaryButton } from "../atoms/Button";
import styled from "@emotion/styled";
import { Text2 } from "../atoms/Text2";
import FadeIn from "react-fade-in";
interface Props {
  icon: string;
  title: string;
  subtext: string;
  buttonText: string;
  onClick: () => void;
  bgFilled?: boolean;
}
const NotConnected = ({
  icon,
  title,
  subtext,
  buttonText,
  onClick,
  bgFilled = false,
}: Props) => {
  return (
    <Styled
      as={FadeIn}
      style={{
        backgroundColor: bgFilled ? "black" : "none",
      }}
    >
      <div className="container">
        <img src={icon} alt="wallet" />
        <Text2 type="title" size="title2">
          {title}
        </Text2>
        <Text2
          type="text"
          size="text2"
          style={{
            marginTop: "-1rem",
          }}
        >
          {subtext}
        </Text2>
        <PrimaryButton onClick={onClick} weight="bold" height="big">
          {buttonText}
        </PrimaryButton>
      </div>
    </Styled>
  );
};

const Styled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 12rem);

  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    width: 420px;
    button {
      width: 100%;
    }
  }
`;
export default NotConnected;
