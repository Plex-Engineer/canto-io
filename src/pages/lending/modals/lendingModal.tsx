import styled from "@emotion/styled";
import { UserLMPosition, UserLMTokenDetails } from "../config/interfaces";
import useModalStore from "../stores/useModals";
import { Text } from "global/packages/src";
import { useEffect, useState } from "react";
import { TransactionStatus } from "@usedapp/core";
import { InputState } from "../components/reactiveButton";
import { truncateNumber } from "global/utils/utils";
import { parseUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";

interface IProps {
  onClose: () => void;
  position: UserLMPosition;
}

type ActionType = "withdraw" | "repay" | "borrow" | "supply";
const LendingModal = ({ position, onClose }: IProps) => {
  const modalStore = useModalStore();
  const token: UserLMTokenDetails = modalStore.activeToken;
  const actionType: ActionType = "supply";
  const [transaction, setTransaction] = useState<TransactionStatus>();
  const [isMax, setMax] = useState(false);
  //!need to revisit this condition
  const [inputState, setInputState] = useState(
    !token.allowance ? InputState.ENABLE : InputState.ENTERAMOUNT
  );

  const [userAmount, setUserAmount] = useState("");

  useEffect(() => {
    resetInput();
  }, [actionType]);

  function resetInput() {
    //if in repay or supply tab and allowance is true or if borrowing is true
    if (
      (actionType == "repay" || actionType == "supply") &&
      token.allowance.isZero()
    ) {
      setInputState(InputState.ENABLE);
    } else {
      setInputState(InputState.ENTERAMOUNT);
    }
    setUserAmount("");
  }

  function inputValidation(value: string, max: BigNumber) {
    value = truncateNumber(value, token.data.underlying.decimals);
    if (inputState !== InputState.ENABLE) {
      if (isNaN(Number(value))) {
        setInputState(InputState.INVALID);
      } else if (value.length == 0 || Number(value) <= 0) {
        setInputState(InputState.ENTERAMOUNT);
      } else if (parseUnits(value, token.data.underlying.decimals).gt(max)) {
        setInputState(InputState.NOFUNDS);
      } else if (
        parseUnits(value, token.data.underlying.decimals).gt(token.allowance) &&
        (actionType == "repay" || actionType == "withdraw")
      ) {
        //need more allowance
        setInputState(InputState.INCREASE_ALLOWANCE);
      } else {
        setInputState(InputState.CONFIRM);
      }
    }
  }

  return (
    <Styled>
      <Text type="title">Action Type : {actionType}</Text>
    </Styled>
  );
};

const Styled = styled.div``;
export default LendingModal;
