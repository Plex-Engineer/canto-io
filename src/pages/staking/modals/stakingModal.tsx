import {
  MasterValidatorProps,
  StakingTransactionType,
  Validator,
} from "../config/interfaces";
import { StakingModalContainer } from "../components/Styled";
import { truncateNumber } from "global/utils/utils";
import { formatEther, parseEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { useState } from "react";
import { CantoMainnet, OutlinedButton, PrimaryButton, Text } from "cantoui";
import Select from "react-select";
import useTransactionStore from "../stores/transactionStore";
import { userTxMessages } from "../config/messages";
import useValidatorModalStore from "../stores/validatorModalStore";
import {
  txRedelegate,
  txStake,
  txUnstake,
} from "pages/staking/utils/transactions";
import { delegateFee, unbondingFee } from "../config/fees";
import { chain, memo } from "global/config/cosmosConstants";
import { getActiveTransactionMessage } from "../utils/utils";
import FadeIn from "react-fade-in";

interface StakingModalProps {
  validator: MasterValidatorProps;
  allValidators: Validator[];
  balance: BigNumber;
  account?: string;
}
export const StakingModal = ({
  validator,
  allValidators,
  balance,
  account,
}: StakingModalProps) => {
  const [delegateAmount, setDelegateAmount] = useState("0");
  const [redelegateAmount, setRedelegateAmount] = useState("0");
  const transactionStore = useTransactionStore();
  const validatorModalStore = useValidatorModalStore();
  const [newValidator, setNewValidator] = useState<Validator | undefined>();

  function formatValue(value: string) {
    if (value === "" || isNaN(Number(value))) {
      return BigNumber.from(0);
    }
    return parseEther(value);
  }

  const handleDelegate = async () => {
    const parsedAmount = formatValue(delegateAmount);
    if (!parsedAmount.isZero() && parsedAmount.lte(balance)) {
      transactionStore.setTransactionMessage(userTxMessages.waitSign);
      validatorModalStore.close();
      await txStake(
        account,
        validator.validator.operator_address,
        parsedAmount.toString(),
        CantoMainnet.cosmosAPIEndpoint,
        delegateFee,
        chain,
        memo
      );
      transactionStore.setTransactionMessage(userTxMessages.waitVerify);
      transactionStore.setTransactionMessage(
        await getActiveTransactionMessage(
          account ?? "",
          validator.validator.description.moniker,
          parsedAmount,
          balance,
          StakingTransactionType.DELEGATE
        )
      );
    }
  };

  const handleUndelegate = async () => {
    const parsedAmount = formatValue(delegateAmount);
    const delegatedTo = parseEther(
      validator.userDelegations?.balance.amount ?? "0"
    );
    if (!parsedAmount.isZero() && parsedAmount.lte(delegatedTo)) {
      transactionStore.setTransactionMessage(userTxMessages.waitSign);
      validatorModalStore.close();
      await txUnstake(
        account,
        validator.validator.operator_address,
        parsedAmount.toString(),
        CantoMainnet.cosmosAPIEndpoint,
        delegateFee,
        chain,
        memo
      );
      transactionStore.setTransactionMessage(userTxMessages.waitVerify);
      transactionStore.setTransactionMessage(
        await getActiveTransactionMessage(
          account ?? "",
          validator.validator.description.moniker,
          parsedAmount,
          delegatedTo,
          StakingTransactionType.UNDELEGATE,
          validator.validator.operator_address
        )
      );
    }
  };

  const handleRedelegate = async () => {
    const parsedAmount = formatValue(redelegateAmount);
    const delegatedTo = parseEther(
      validator.userDelegations?.balance.amount ?? "0"
    );
    if (
      !parsedAmount.isZero() &&
      parsedAmount.lte(delegatedTo) &&
      newValidator
    ) {
      transactionStore.setTransactionMessage(userTxMessages.waitSign);
      validatorModalStore.close();
      await txRedelegate(
        account,
        parsedAmount.toString(),
        CantoMainnet.cosmosAPIEndpoint,
        unbondingFee,
        chain,
        memo,
        validator.validator.operator_address,
        newValidator.operator_address
      );
      transactionStore.setTransactionMessage(userTxMessages.waitVerify);
      transactionStore.setTransactionMessage(
        await getActiveTransactionMessage(
          account ?? "",
          validator.validator.description.moniker,
          parsedAmount,
          delegatedTo,
          StakingTransactionType.REDELEGATE,
          validator.validator.operator_address,
          newValidator.description.moniker
        )
      );
    }
  };
  return (
    <StakingModalContainer>
      <div className="title">{validator.validator.description.moniker}</div>
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
          {validator.validator.description.details.toLowerCase()}{" "}
        </h4>
        <div className="dual-h-row">
          <p className="type">delegation</p>
          <p className="value">
            {formatEther(validator.userDelegations?.balance.amount ?? 0)} canto
          </p>
        </div>
        <div className="dual-h-row">
          <p className="type">available balance</p>
          <p className="value">{truncateNumber(formatEther(balance))} canto</p>
        </div>
        <div className="dual-h-row">
          <p className="type">commission</p>
          <p className="value">
            {(
              Number(validator.validator.commission.commission_rates.rate) * 100
            ).toFixed(2)}{" "}
            %
          </p>
        </div>
        <div className="textField">
          <p>amount:</p>
          <input
            type="text"
            name="amount"
            id="amount"
            onChange={(e) => setDelegateAmount(e.target.value)}
          />
          <p>canto</p>
        </div>
        <div className="btn-grp">
          <OutlinedButton onClick={() => handleUndelegate()}>
            undelegate
          </OutlinedButton>
          <PrimaryButton onClick={() => handleDelegate()}>
            delegate
          </PrimaryButton>
        </div>
        <hr />
        <div className="redelegate">
          <div className="row">
            <Text type="text">amount :</Text>
            <input
              type="text"
              name="reDelegateAmount"
              id="reDelegateAmount"
              onChange={(e) => setRedelegateAmount(e.target.value)}
            />
            {/* <Text type="text" color="white" onClick={() => {}}>
            max
          </Text> */}
          </div>
          <div className="btn-grp">
            <Select
              className="react-select-container"
              classNamePrefix="react-select"
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
            <PrimaryButton onClick={() => handleRedelegate()}>
              re-delegate
            </PrimaryButton>
          </div>
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
    </StakingModalContainer>
  );
};
