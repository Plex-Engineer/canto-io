import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";

const ChoiceModal = () => {
  return (
    <BaseModalStyled>
      <Text size="title2" type="title" className="title">
        Kaisen
      </Text>
      <div className="content">
        <Text size="title3" type="title" className="desc-title" align="left">
          Description :
        </Text>
        <Text
          size="title3"
          type="text"
          className="desc-content"
          color="white"
          align="left"
        >
          bare metal validation, powered by weebs. ~a portion of all profits
          will be utilized to support anime artists around the world~
        </Text>
        <div className="info-bars">
          <div>
            <header>delegated</header>
            <footer>00.00c</footer>
          </div>
          <div>
            <header>balance</header>
            <footer>00.00c</footer>
          </div>
          <div>
            <header>commission</header>
            <footer>5%</footer>
          </div>
        </div>
        <div className="btns">
          <OutlinedButton weight="bold" disabled height="big">
            undelegate
          </OutlinedButton>
          <PrimaryButton weight="bold" height="big">
            delegate
          </PrimaryButton>
        </div>
      </div>
    </BaseModalStyled>
  );
};

export default ChoiceModal;

const BaseModalStyled = styled.div`
  width: 520px;
  height: 496px;
  display: flex;
  flex-direction: column;
  .title {
    height: 60px;
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #222;
    align-self: center;
  }
  .content {
    padding: 35px;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .desc-content {
    flex-grow: 2;
  }
  .info-bars {
    display: flex;
    border: 1px solid #373737;
    border-radius: 4px;
    justify-content: stretch;
    height: 82px;
    margin: 2rem 0;
    & > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;
    }
    header {
      font-family: "Silkscreen";
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 140%;
      /* or 22px */

      text-align: center;
      letter-spacing: -0.03em;
      text-transform: lowercase;

      /* matrix green */

      color: #06fc99;

      opacity: 0.4;
    }
    footer {
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 140%;
      text-align: center;
      letter-spacing: -0.03em;
      text-transform: lowercase;
      color: #06fc99;
    }
  }

  .btns {
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;
    button {
      width: 10rem;
    }
  }
`;
