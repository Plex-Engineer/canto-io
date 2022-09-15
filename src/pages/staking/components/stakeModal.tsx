import styled from "@emotion/styled";
import {
  DelegationResponse,
  Validator,
  formatNumber,
  REFRESH_RATE,
  calculateTotalStaked,
} from "pages/staking/utils/utils";
import { fee, unbondingFee, reDelegateFee } from "../config/fees";
import { chain, memo } from "global/config/cosmosConstants";
import { txRedelegate, txStake, txUnstake } from "../utils/transactions.js";
import { useState } from "react";
import { BigNumber, ethers } from "ethers";
import { OutlinedButton, PrimaryButton, Text } from "cantoui";
import Select from "react-select";
import { userTxMessages } from "../config/messages";

const Container = styled.div`
  background-color: #040404;
  height: fit-content;
  max-height: 90vh;
  overflow-y: scroll;
  padding-bottom: 1rem;
  width: 33rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  input {
    text-align: right;
  }
  hr {
    width: 85%;
    border: none;
    border-bottom: 1px solid #444444;
  }
  /* padding: 1rem; */
  .react-select-container {
  }
  .eact-select__input-container {
    color: var(--primary-color) !important;
  }
  .react-select__control {
    background-color: #040404 !important;
    color: var(--primary-color) !important;
    border: 1px solid var(--primary-color) !important;
    border-radius: 0%;

    &:focus,
    &:hover {
      outline: none;
    }
  }
  /* .react-select__input {
    color: var(--primary-color) !important;
    &::placeholder {
      color: var(--primary-color) !important;
    }
    input[type="text"] {
      &::placeholder {
        color: var(--primary-color) !important;
      }
    }
  } */
  .react-select__menu {
    background-color: #040404 !important;
    color: var(--primary-color) !important;
  }
  .react-select__value-container {
    * {
      color: var(--primary-color) !important;
    }
  }
  .react-select__menu-list {
    outline: none;
    color: var(--primary-color) !important;
  }

  .react-select__option {
    background-color: #040404 !important;
    &:hover {
      background-color: #1b2b24 !important;
    }
  }

  .redelegate {
    width: 85%;
    margin: 2rem 0;
    .btn-grp {
      width: 100%;
      align-items: center;
      display: grid;
      grid-template-columns: 49% 49%;
      gap: 2%;
    }
    background-color: #152920;
    border: 1px solid var(--primary-color);
    padding: 1rem;

    .row {
      display: flex;
      p {
        flex: 1;
        cursor: pointer;
        &:hover {
          color: var(--primary-color);
        }
      }
      * {
        flex: 2;
      }

      input {
        background-color: transparent;
        width: 40%;
        border-bottom: 1px solid #1b7244;

        &:focus {
          border-bottom: 1px solid var(--primary-color);
        }
      }
    }
    .btn-grp {
      margin: 0 !important;
      margin-top: 2rem !important;
    }
  }
  .title {
    font-style: normal;
    font-weight: 300;
    font-size: 22px;
    line-height: 130%;
    text-align: center;
    letter-spacing: -0.1em;
    text-transform: lowercase;
    color: var(--primary-color);
    margin-bottom: 2rem;
    /* margin-top: 0.3rem; */
    width: 100%;
    background-color: #06fc991a;
    padding: 1rem;
    border-bottom: 1px solid var(--primary-color);
  }

  .dual-h-row {
    font-size: 18px;
    width: 28rem;
    display: flex;
    justify-content: space-between;
    margin: 0.4rem 0;
  }
  .balances {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: end;
    width: 18rem;
  }
  .bal {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
  }
  .type {
    color: #8b8b8b;
  }
  .value {
    color: var(--primary-color);
  }
  .line {
    border-bottom: 1px solid #222;
  }
  .logo {
    /* padding: 1rem; */
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--primary-color);
    height: 60px;
    width: 60px;
    border-radius: 50%;
    margin-bottom: 1.2rem;
  }

  h2 {
    color: #777;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    text-align: left;
    line-height: 120%;
    margin-bottom: 0.4rem;
  }
  .secondaryBalance {
    font-weight: 300;
    font-size: 16px;
    line-height: 120%;
    color: #cdcdcd;
  }

  .btn-grp {
    display: flex;
    justify-content: space-between;
    width: 85%;
    margin: 2rem 0;
  }

  .desc {
    margin: 0 6rem;
    margin-bottom: 2rem;
    max-width: 85%;
  }
  .textField {
    margin: 0.1rem 0;
    padding: 0.4rem 0;
    width: 28rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 18px;
    border-bottom: 1px solid var(--primary-color);
  }

  input[type="text"] {
    background-color: black;
    width: 100%;
    border: none;
    font-size: 18px;
    font-weight: 600;
    color: white;
    margin: 0 2rem;
    &:focus {
      outline: none;
    }
  }
  footer {
    margin: 0 2rem;
    p {
      font-size: 14px;
    }
  }
`;

type props = {
  account: string;
  validator: Validator;
  validators: Validator[];
  balance: BigNumber;
  delegations: DelegationResponse[];
  nodeAddress: string;
  setIsOpen: (isOpen: boolean) => void;
  fetchNewData: () => void;
  isTransactionSuccessful: (
    validatorAddress: string,
    parsedAmount: BigNumber,
    balance: BigNumber,
    transactionType: number,
    currentValidator?: string
  ) => void;
  setConfirmation: (message: string) => void;
};

const StakeModal = (props: props) => {
  const {
    account,
    validator,
    validators,
    balance,
    delegations,
    nodeAddress,
    setIsOpen,
    isTransactionSuccessful,
    setConfirmation,
  } = props;

  const [amount, setAmount] = useState<string>("0");
  const [newValidator, setNewValidator] = useState<string>("");

  const name = validator.description.moniker;
  const description = validator.description.details;
  const commision =
    parseFloat(validator.commission.commission_rates.rate) * 100;
  const validatorAddress = validator.operator_address;

  let delegatedTo = BigNumber.from("0");
  delegations.forEach((delegation) => {
    if (
      delegation.delegation.validator_address.includes(
        validator.operator_address
      )
    ) {
      delegatedTo = BigNumber.from(delegation.balance.amount);
    }
  });

  const handleDelegate = async () => {
    const parsedAmount = ethers.utils.parseUnits(amount, 18);
    if (!parsedAmount.eq(BigNumber.from("0")) && parsedAmount.lte(balance)) {
      setConfirmation(userTxMessages.waitSign);
      setIsOpen(false);
      await txStake(
        account,
        validatorAddress,
        parsedAmount.toString(),
        nodeAddress,
        fee,
        chain,
        memo
      );
      setConfirmation(userTxMessages.waitVerify);
      setTimeout(
        () => isTransactionSuccessful(name, parsedAmount, balance, 0),
        REFRESH_RATE
      );
    }
  };

  const handleUndelegate = async () => {
    const parsedAmount = ethers.utils.parseUnits(amount, 18);
    if (
      !parsedAmount.eq(BigNumber.from("0")) &&
      parsedAmount.lte(delegatedTo)
    ) {
      setConfirmation(userTxMessages.waitSign);
      setIsOpen(false);
      await txUnstake(
        account,
        validatorAddress,
        parsedAmount.toString(),
        nodeAddress,
        reDelegateFee,
        chain,
        memo
      );
      setConfirmation(userTxMessages.waitVerify);
      setTimeout(
        () =>
          isTransactionSuccessful(
            name,
            parsedAmount,
            calculateTotalStaked(delegations),
            1
          ),
        REFRESH_RATE
      );
    }
  };

  const handleRedelegate = async () => {
    const parsedAmount = ethers.utils.parseUnits(amount, 18);
    if (
      !parsedAmount.eq(BigNumber.from("0")) &&
      parsedAmount.lte(delegatedTo) &&
      newValidator !== ""
    ) {
      setConfirmation(userTxMessages.waitSign);
      setIsOpen(false);
      await txRedelegate(
        account,
        parsedAmount.toString(),
        nodeAddress,
        unbondingFee,
        chain,
        memo,
        validatorAddress,
        newValidator
      );
      setConfirmation(userTxMessages.waitVerify);
      setTimeout(
        () =>
          isTransactionSuccessful(
            name,
            delegatedTo,
            calculateTotalStaked(delegations),
            3,
            validatorAddress
          ),
        REFRESH_RATE
      );
    }
  };

  const options: any[] = [];
  validators.forEach((val) => {
    options.push({
      value: val.operator_address,
      label: val.description.moniker,
    });
  });

  return (
    <Container>
      <div className="title">{name}</div>
      <div className="desc">
        <h2
          style={{
            textAlign: "center",
          }}
        >
          description
        </h2>
        <h4
          style={{
            color: "#D3D3D3",
            wordWrap: "break-word",
          }}
        >
          {description.toLowerCase()}{" "}
        </h4>
      </div>
      <div className="dual-h-row">
        <p className="type">delegation</p>
        <p className="value">{formatNumber(delegatedTo, 18)} canto</p>
      </div>
      <div className="dual-h-row">
        <p className="type">available balance</p>
        <p className="value">{formatNumber(balance, 18)} canto</p>
      </div>
      <div className="dual-h-row">
        <p className="type">commission</p>
        <p className="value">{commision.toFixed(3)} %</p>
      </div>
      <div className="textField">
        <p>amount:</p>
        <input
          type="text"
          name="amoubt"
          id="amount"
          onChange={(e) => setAmount(e.target.value)}
        />
        <p>canto</p>
      </div>

      <div className="btn-grp">
        <OutlinedButton onClick={() => handleUndelegate()}>
          undelegate
        </OutlinedButton>
        <PrimaryButton onClick={() => handleDelegate()}>delegate</PrimaryButton>
      </div>
      <hr />
      <div className="redelegate">
        <div className="row">
          <Text type="text">amount :</Text>
          <input
            type="text"
            name="amount"
            id="amount"
            onChange={(e) => setAmount(e.target.value)}
          />
          {/* <Text type="text" color="white" onClick={() => {}}>
            max
          </Text> */}
        </div>
        <div className="btn-grp">
          <Select
            className="react-select-container"
            classNamePrefix="react-select"
            options={options}
            onChange={(val) => {
              setNewValidator(val.value);
            }}
          />
          <PrimaryButton onClick={() => handleRedelegate()}>
            re-delegate
          </PrimaryButton>
        </div>
      </div>
      <footer>
        <p
          style={{
            color: "#EF4444",
          }}
        >
          staking will lock up your funds for at least 21 days
        </p>
        <p
          style={{
            color: "#8b8b8b",
          }}
        >
          once you undelegate your staked canto, you will need to wait 21 days
          for your tokens to be liquid
        </p>
      </footer>
    </Container>
  );
};

export default StakeModal;
