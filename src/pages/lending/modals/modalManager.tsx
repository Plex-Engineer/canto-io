import WalletModal from "./walletModal";
import CollatModal from "./enableCollateral";
import SupplyModal from "./supplyModal";
import BorrowModal from ".//borrowModal";
import RewardsModal from "./rewardsModal";
import useModalStore, { ModalType } from "pages/lending/stores/useModals";
import { UserLMPosition, UserLMRewards } from "pages/lending/config/interfaces";
import Modal from "global/packages/src/components/molecules/Modal";
import LendingModal from "./lendingModal";

interface Props {
  isOpen: boolean;
  position: UserLMPosition;
  rewards: UserLMRewards;
}

const ModalManager = ({ isOpen, position, rewards }: Props) => {
  const modalStore = useModalStore();
  return (
    <Modal open={isOpen} onClose={modalStore.close}>
      {modalStore.currentModal === ModalType.WALLET_CONNECTION && (
        <WalletModal onClose={modalStore.close} />
      )}
      {modalStore.currentModal === ModalType.LENDING && (
        <LendingModal
          modalType="supply_withdraw"
          onClose={modalStore.close}
          position={position}
        />
      )}

      {modalStore.currentModal === ModalType.BORROW && (
        <LendingModal
          modalType="repay_borrow"
          onClose={modalStore.close}
          position={position}
        />
      )}

      {modalStore.currentModal === ModalType.COLLATERAL && (
        <CollatModal
          onClose={modalStore.close}
          position={position}
          decollateralize={false}
        />
      )}

      {modalStore.currentModal === ModalType.DECOLLATERAL && (
        <CollatModal
          onClose={modalStore.close}
          decollateralize={true}
          position={position}
        />
      )}
      {modalStore.currentModal === ModalType.BALANCE && (
        <RewardsModal
          // passin LMBalance to this
          rewardsObj={rewards}
          onClose={modalStore.close}
        />
      )}
    </Modal>
  );
};

export { ModalManager, ModalType };
