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
import { BigNumber } from "ethers";
import { txStake } from "../utils/transactions";
import { userTxMessages } from "../config/messages";
import { getActiveTransactionMessage } from "../utils/utils";
import { delegateFee } from "../config/fees";
import { chain, memo } from "global/config/cosmosConstants";
import { formatEther, parseEther } from "ethers/lib/utils";
import { CantoMainnet } from "global/config/networks";
import { formatBalance } from "global/utils/utils";

interface StakingModalProps {
  undelegation?: boolean;
  validator: MasterValidatorProps;
  allValidators: Validator[];
  balance: BigNumber;
  account?: string;
}

const DelegationModal = ({
  validator,
  //   allValidators,
  balance,
  account,
  undelegation,
}: StakingModalProps) => {
  const validatorModalStore = useValidatorModalStore();
  const [delegateAmount, setDelegateAmount] = useState("");
  const transactionStore = useTransactionStore();
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

  return (
    <BaseModalStyled>
      <Text size="title2" type="title" className="title">
        {undelegation ? "undelegate" : "delegate"}
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
            amount to {undelegation ? "undelegate" : "delegate"} :
          </Text>

          <div className="amount">
            <CInput
              placeholder="enter amount..."
              value={delegateAmount}
              onChange={(x) => {
                setDelegateAmount(x.target.value);
              }}
            />
            <div
              className="max"
              onClick={() => {
                setDelegateAmount(formatEther(balance));
              }}
            >
              max
            </div>
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

export default DelegationModal;
