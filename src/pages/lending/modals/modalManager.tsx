import WalletModal from "./walletModal";
import CollatModal from "./enableCollateral";
import RewardsModal from "./rewardsModal";
import useModalStore, { ModalType } from "pages/lending/stores/useModals";
import { UserLMPosition, UserLMRewards } from "pages/lending/config/interfaces";
import Modal from "global/packages/src/components/molecules/Modal";
import OngoingTxModal from "global/components/modals/ongoingTxModal";
import LendingModal from "./lendingModal";
import { TransactionStore } from "global/stores/transactionStore";

interface Props {
  isOpen: boolean;
  position: UserLMPosition;
  rewards: UserLMRewards;
  chainId: number;
  txStore: TransactionStore;
}

const ModalManager = ({
  isOpen,
  position,
  rewards,
  chainId,
  txStore,
}: Props) => {
  const modalStore = useModalStore();
  return (
    <Modal open={isOpen} onClose={modalStore.close}>
      <OngoingTxModal onClose={modalStore.close} />
      {modalStore.currentModal === ModalType.WALLET_CONNECTION && (
        <WalletModal onClose={modalStore.close} />
      )}
      {modalStore.currentModal === ModalType.LENDING && (
        <LendingModal
          modalType="supply_withdraw"
          onClose={modalStore.close}
          position={position}
          chainId={chainId}
          txStore={txStore}
          activeToken={modalStore.activeToken}
        />
      )}
      {modalStore.currentModal === ModalType.BORROW && (
        <LendingModal
          modalType="repay_borrow"
          onClose={modalStore.close}
          position={position}
          chainId={chainId}
          txStore={txStore}
          activeToken={modalStore.activeToken}
        />
      )}

      {modalStore.currentModal === ModalType.COLLATERAL && (
        <CollatModal
          position={position}
          decollateralize={false}
          chainId={chainId}
          txStore={txStore}
          activeToken={modalStore.activeToken}
        />
      )}

      {modalStore.currentModal === ModalType.DECOLLATERAL && (
        <CollatModal
          decollateralize={true}
          position={position}
          chainId={chainId}
          txStore={txStore}
          activeToken={modalStore.activeToken}
        />
      )}
      {modalStore.currentModal === ModalType.BALANCE && (
        <RewardsModal
          chainId={chainId}
          rewardsObj={rewards}
          txStore={txStore}
        />
      )}
    </Modal>
  );
};

export { ModalManager, ModalType };
