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
  style?: React.CSSProperties;
}
const NotConnected = ({
  icon,
  title,
  subtext,
  buttonText,
  onClick,
  bgFilled = false,
  style,
}: Props) => {
  return (
    <Styled
      style={{
        backgroundColor: bgFilled ? "black" : "none",
        ...style,
      }}
    >
      <FadeIn className="container">
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
        <PrimaryButton onClick={onClick} weight="bold" filled height="big">
          {buttonText}
        </PrimaryButton>
      </FadeIn>
    </Styled>
  );
};

const Styled = styled.div`
  display: flex;
  width: 100%;
  padding: 25px;
  justify-content: center;
  flex-grow: 1;
  min-height: 600px;
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    width: 100%;
    max-width: 410px;

    button {
      width: 310px;
    }
  }

  @media (max-width: 1000px) {
    width: 100vw;
  }
`;
export default NotConnected;
