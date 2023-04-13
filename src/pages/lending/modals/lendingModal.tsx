import styled from "@emotion/styled";
import { UserLMPosition, UserLMTokenDetails } from "../config/interfaces";
import useModalStore from "../stores/useModals";

interface IProps {
  onClose: () => void;
  position: UserLMPosition;
}

type ActionType = "withdraw" | "repay" | "borrow" | "supply";
const LendingModal = ({ position, onClose }: IProps) => {
  const modalStore = useModalStore();
  const token: UserLMTokenDetails = modalStore.activeToken;
  const actionType: ActionType = "supply";

  return <Styled>lendingModal</Styled>;
};

const Styled = styled.div``;
export default LendingModal;
