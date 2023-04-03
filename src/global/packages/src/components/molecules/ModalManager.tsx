import styled from "@emotion/styled";
import Popup from "reactjs-popup";
import useGlobalModals, { ModalType } from "../../stores/useModals";
import Modal from "./Modal";
import TokensModal from "./TokensModal";

interface ModalManagerProps {
  chainId: number;
}
const ModalManager = ({ chainId }: ModalManagerProps) => {
  const [modalType, setModalType] = useGlobalModals((state) => [
    state.modalType,
    state.setModalType,
  ]);
  return (
    <Modal
      open={modalType != ModalType.NONE}
      onClose={() => {
        setModalType(ModalType.NONE);
      }}
      title={modalType != ModalType.NONE ? "Import Tokens" : ""}
    >
      {modalType === ModalType.TOKENS && <TokensModal chainId={chainId} />}
    </Modal>
  );
};

export default ModalManager;
