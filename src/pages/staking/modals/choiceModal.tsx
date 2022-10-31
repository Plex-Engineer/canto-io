import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import useValidatorModalStore, {
  ValidatorModalType,
} from "../stores/validatorModalStore";

const ChoiceModal = () => {
  const validatorModalStore = useValidatorModalStore();

  return (
    <BaseModalStyled>
      <Text size="title2" type="title" className="title">
        Kaisen
      </Text>
      <div className="content">
        <div className="desc">
          <Text size="title3" type="title" className="desc-title" align="left">
            Description :
          </Text>
          <Text
            size="text2"
            type="text"
            className="desc-content"
            color="white"
            align="left"
          >
            bare metal validation, powered by weebs. ~a portion of all profits
            will be utilized to support anime artists around the world~
          </Text>
        </div>
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
          <OutlinedButton
            weight="bold"
            height="big"
            onClick={() => {
              validatorModalStore.open(ValidatorModalType.UNDELEGATE);
            }}
          >
            undelegate
          </OutlinedButton>
          <PrimaryButton
            weight="bold"
            height="big"
            onClick={() => {
              validatorModalStore.open(ValidatorModalType.DELEGATE);
            }}
          >
            delegate
          </PrimaryButton>
        </div>
      </div>
    </BaseModalStyled>
  );
};

export default ChoiceModal;

export const BaseModalStyled = styled.div`
  width: 520px;
  transition: all 0.3s;
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
    padding: 2rem 35px;
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 1.5rem;
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

  .error-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 12px;
    background: rgba(255, 116, 116, 0.16);
    border: 1px solid #632121;
    border-radius: 4px;
  }

  .amount {
    input {
      width: 100%;
      margin: 6px 0;
    }
    position: relative;
    .max {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 140%;
      letter-spacing: -0.03em;
      text-transform: lowercase;
      color: #efefef;
      border: 1px solid #efefef;
      opacity: 0.5;
      position: absolute;
      right: 12px;
      border-radius: 4px;
      padding: 4px 8px;
      top: 18px;
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
    }
    width: 100%;
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
