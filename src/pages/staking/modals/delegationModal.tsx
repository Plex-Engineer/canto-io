import { BaseModalStyled } from "./choiceModal";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import useValidatorModalStore, {
  ValidatorModalType,
} from "../stores/validatorModalStore";
import { CInput } from "global/packages/src/components/atoms/Input";

interface Props {
  undelegation?: boolean;
}

const DelegationModal = ({ undelegation }: Props) => {
  const validatorModalStore = useValidatorModalStore();

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
        <div className="amount-bar">
          <Text size="text3" type="title" className="desc-title" align="left">
            amount to {undelegation ? "undelegate" : "delegate"} :
          </Text>

          <div className="amount">
            <CInput placeholder="enter amount..." />
            <div className="max">max</div>
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
