import WalletModal from "./walletModal";
import CollatModal from "./enableCollateral";
import SupplyModal from "./supplyModal";
import BorrowModal from ".//borrowModal";
import RewardsModal from "./rewardsModal";
import useModalStore, { ModalType } from "pages/lending/stores/useModals";
import { UserLMPosition, UserLMRewards } from "pages/lending/config/interfaces";
import Modal from "global/packages/src/components/molecules/Modal";
import LoadingModalv3 from "global/components/modals/loadingv3";

interface Props {
  isOpen: boolean;
  position: UserLMPosition;
  rewards: UserLMRewards;
}

const ModalManager = ({ isOpen, position, rewards }: Props) => {
  const modalStore = useModalStore();
  return (
    <Modal open={isOpen} onClose={modalStore.close}>
      <LoadingModalv3 onClose={modalStore.close} />
      {modalStore.currentModal === ModalType.WALLET_CONNECTION && (
        <WalletModal onClose={modalStore.close} />
      )}
      {modalStore.currentModal === ModalType.LENDING && (
        <SupplyModal position={position} />
      )}

      {modalStore.currentModal === ModalType.BORROW && (
        <BorrowModal position={position} />
      )}

      {modalStore.currentModal === ModalType.COLLATERAL && (
        <CollatModal position={position} decollateralize={false} />
      )}

      {modalStore.currentModal === ModalType.DECOLLATERAL && (
        <CollatModal decollateralize={true} position={position} />
      )}
      {modalStore.currentModal === ModalType.BALANCE && (
        <RewardsModal
          // passin LMBalance to this
          rewardsObj={rewards}
        />
      )}
    </Modal>
  );
};

export { ModalManager, ModalType };
