import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import useValidatorModalStore, {
  ValidatorModalType,
} from "../stores/validatorModalStore";
import cantoImg from "assets/logo.svg";
import { MasterValidatorProps } from "../config/interfaces";
import { formatEther } from "ethers/lib/utils";
import { formatBalance, truncateNumber } from "global/utils/utils";
import { BigNumber } from "ethers";

interface Props {
  validator: MasterValidatorProps;
  balance: BigNumber;
}
const ChoiceModal = ({ validator, balance }: Props) => {
  const validatorModalStore = useValidatorModalStore();

  return (
    <BaseModalStyled>
      <Text size="title2" type="title" className="title">
        {validator.validator.description.moniker}
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
            {validator.validator.description.details.toLowerCase()}{" "}
          </Text>
        </div>
        <div className="info-bars">
          <div>
            <header>delegated</header>
            <footer className="coin-bal">
              {formatBalance(
                formatEther(validator.userDelegations?.balance.amount ?? "0")
              )}
              <img src={cantoImg} height={16} alt="canto" />
            </footer>
          </div>
          <div>
            <header>balance</header>
            <footer className="coin-bal">
              {formatBalance(formatEther(balance))}{" "}
              <img src={cantoImg} height={16} alt="canto" />
            </footer>
          </div>
          <div>
            <header>commission</header>
            <footer>
              {(
                Number(validator.validator.commission.commission_rates.rate) *
                100
              ).toFixed(2)}{" "}
              %
            </footer>
          </div>
        </div>
        <div className="btns">
          <OutlinedButton
            weight="bold"
            height="big"
            disabled={
              Number(
                formatEther(validator.userDelegations?.balance.amount ?? "0")
              ) <= 0
            }
            onClick={() => {
              validatorModalStore.open(ValidatorModalType.UNDELEGATE);
            }}
          >
            undelegate
          </OutlinedButton>
          <PrimaryButton
            weight="bold"
            height="big"
            disabled={Number(formatBalance(formatEther(balance))) === 0}
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
  .coin-bal {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  /* .coin-bal::after {
    content: "";
    position: absolute;
    height: 14px;
    width: 14px;
    background-image: url(${cantoImg});
    background-size: contain;
    background-repeat: no-repeat;
  } */
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
      transition: all 0.1s;
      background-color: transparent;
      cursor: pointer;
      &:hover {
        opacity: 1;
        color: var(--primary-color);
        border: 1px solid var(--primary-color);
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
