import { BaseModalStyled } from "./choiceModal";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import useValidatorModalStore, {
  ValidatorModalType,
} from "../stores/validatorModalStore";
import { CInput } from "global/packages/src/components/atoms/Input";
import cantoImg from "assets/logo.svg";
import { useState } from "react";
import useTransactionStore from "../stores/transactionStore";
import {
  MasterValidatorProps,
  StakingTransactionType,
  Validator,
} from "../config/interfaces";
import Select from "react-select";
import { BigNumber } from "ethers";
import { txRedelegate } from "../utils/transactions";
import { performTxAndSetStatus } from "../utils/utils";
import { unbondingFee } from "../config/fees";
import { chain, memo } from "global/config/cosmosConstants";
import { formatEther, parseEther } from "ethers/lib/utils";
import { CantoMainnet } from "global/config/networks";
import { formatBalance } from "global/utils/utils";
import styled from "@emotion/styled";

interface StakingModalProps {
  validator: MasterValidatorProps;
  allValidators: Validator[];
  balance: BigNumber;
  account?: string;
}

const RedelegationModal = ({
  validator,
  allValidators,
  balance,
  account,
}: StakingModalProps) => {
  const validatorModalStore = useValidatorModalStore();
  const [amount, setAmount] = useState("");
  const transactionStore = useTransactionStore();
  const [newValidator, setNewValidator] = useState<Validator | undefined>();

  function formatValue(value: string) {
    if (value === "" || isNaN(Number(value))) {
      return BigNumber.from(0);
    }
    return parseEther(value);
  }

  const handleRedelegate = async () => {
    const parsedAmount = formatValue(amount);
    const delegatedTo = parseEther(
      validator.userDelegations?.balance.amount ?? "0"
    );
    if (
      !parsedAmount.isZero() &&
      parsedAmount.lte(delegatedTo) &&
      newValidator
    ) {
      await performTxAndSetStatus(
        async () =>
          await txRedelegate(
            account,
            parsedAmount.toString(),
            CantoMainnet.cosmosAPIEndpoint,
            unbondingFee,
            chain,
            memo,
            validator.validator.operator_address,
            newValidator.operator_address
          ),
        StakingTransactionType.REDELEGATE,
        transactionStore.setTransactionStatus,
        validatorModalStore.close,
        validator.validator.description.moniker,
        parsedAmount,
        newValidator.description.moniker
      );
    }
  };

  return (
    <BaseModalStyled>
      <Text size="title2" type="title" className="title">
        redelegate
      </Text>
      <div className="content">
        <div className="error-info">
          <Text
            size="text4"
            type="title"
            className="desc-title"
            align="left"
            style={{
              color: "#EF4444",
            }}
          >
            staking will lock up your funds for at least 21 days
          </Text>
          <Text
            size="text4"
            type="text"
            className="desc-content"
            color="white"
            align="left"
          >
            once you undelegate your staked canto, you will need to wait 21 days
            for your tokens to be liquid
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
        <div className="amount-bar">
          <Text size="text3" type="title" className="desc-title" align="left">
            redelegate to :
          </Text>
          <div
            style={{
              height: "4px",
            }}
          ></div>
          <div className="amount">
            <div className="btn-grp">
              <Selected>
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="choose a validator..."
                  options={allValidators.map((validator) => {
                    return {
                      value: validator,
                      label: validator.description.moniker,
                    };
                  })}
                  onChange={(val) => {
                    setNewValidator(val?.value);
                  }}
                />
              </Selected>
            </div>
          </div>
        </div>
        <div className="amount-bar">
          <Text size="text3" type="title" className="desc-title" align="left">
            amount to redelegate :
          </Text>

          <div className="amount">
            <CInput
              placeholder="enter amount..."
              value={amount}
              onChange={(x) => {
                setAmount(x.target.value);
              }}
            />
            <button
              className="max"
              onClick={() => {
                setAmount(
                  formatEther(validator.userDelegations?.balance.amount ?? "0")
                );
              }}
            >
              max
            </button>
          </div>
          <Text
            size="text3"
            type="text"
            className="subtext"
            align="left"
            style={{
              color: "#505050",
            }}
          >
            0.01 Canto is reserved for transaction fee.{" "}
          </Text>
        </div>
        <div className="btns">
          <OutlinedButton
            weight="bold"
            height="big"
            onClick={() => {
              validatorModalStore.open(ValidatorModalType.STAKE);
            }}
          >
            back
          </OutlinedButton>
          <PrimaryButton
            weight="bold"
            height="big"
            disabled={
              Number(amount) == 0 ||
              isNaN(Number(amount)) ||
              Number(amount) >
                Number(
                  formatEther(validator.userDelegations?.balance.amount ?? "0")
                ) ||
              newValidator == undefined
            }
            onClick={() => handleRedelegate()}
          >
            redelegate
          </PrimaryButton>
        </div>
      </div>
    </BaseModalStyled>
  );
};

export const Selected = styled.div`
  .react-select-container {
  }
  .react-select__input-container {
    color: var(--primary-color) !important;
  }
  .react-select__placeholder {
    opacity: 0.4;
  }
  .react-select__control {
    background-color: #222222 !important;
    color: var(--primary-color) !important;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    letter-spacing: -0.03em;
    height: 56px;

    &:focus,
    &:hover {
      outline: none;
    }
  }

  .react-select__menu {
    backdrop-filter: blur(35px);
    background: #d9d9d933;
    border-radius: 4px;
    overflow: visible;
    color: var(--primary-color) !important;
  }
  .react-select__indicator-separator {
    display: none;
  }
  .react-select__value-container {
    * {
      color: var(--primary-color) !important;
    }
  }
  .react-select__menu-list {
    outline: none;
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 0.6rem 0;
    align-items: center;
    color: var(--primary-color) !important;
  }

  .react-select__option {
    width: 94%;
    background-color: transparent !important;
    margin: 0.2rem 1rem;
    padding: 0.8rem 0.6rem;

    &:hover {
      border-radius: 4px;
      background-color: #ffffff1a !important;
    }
  }
`;
export default RedelegationModal;
