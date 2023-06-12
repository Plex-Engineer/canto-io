import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import Modal from "global/packages/src/components/molecules/Modal";
import { useState } from "react";
import acronIcon from "assets/acron.svg";
import { ChooseNetwork } from "./recoveryTransaction";

interface Item {
  id: string;
  icon: string;
  primaryText: string;
  secondaryText?: string;
}

interface Props {
  items: Item[];
  title: string;
  label?: string;
  selectedId?: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}
const DropDown = ({
  onSelect,
  items,
  title,
  label,
  selectedId,
  disabled,
}: Props) => {
  const [isSelectModalOpen, setSelectModalOpen] = useState(false);
  const activeItem = items.find((i) => i.id === selectedId);

  return (
    <Styled
      onClick={() => {
        items.length === 1 ? null : setSelectModalOpen(true);
      }}
      disabled={disabled}
    >
      <img
        src={activeItem?.icon}
        height={40}
        style={{
          marginRight: 8,
        }}
      />
      <div className="token-label">
        {label && (
          <Text
            style={{
              color: "#999",
            }}
            size="text4"
            className="label"
            bold
            align="left"
          >
            {label}
          </Text>
        )}
        <Text type="title" size="text4" align="left">
          {activeItem?.primaryText}
          <Modal
            title={title}
            open={isSelectModalOpen}
            onClose={() => {
              setSelectModalOpen(false);
            }}
          >
            <ChooseNetwork>
              <div className="network-list">
                {items.map((item) => (
                  <div
                    role="button"
                    tabIndex={0}
                    key={item.id}
                    className="network-item"
                    onClick={() => {
                      onSelect(item.id);
                      setSelectModalOpen(false);
                    }}
                    style={{
                      background: activeItem?.id === item.id ? "#1d1d1d" : "",
                    }}
                  >
                    <span>
                      <img src={item.icon} />
                      <Text>{item.primaryText}</Text>
                    </span>
                  </div>
                ))}
              </div>
            </ChooseNetwork>
          </Modal>
        </Text>
      </div>
      <img src={acronIcon} className="separator" alt="separator" />
    </Styled>
  );
};

const Styled = styled.button`
  display: flex;
  align-items: center;
  background: #111111;
  border: 1px solid #242424;
  border-radius: 4px;
  padding: 8px 16px;
  padding-right: 24px;
  height: 62px;

  &:disabled {
    /* opacity: 0.8; */
    cursor: default !important;
    /* filter: grayscale(1); */

    .separator {
      display: none;
    }
  }

  .token-label {
    display: flex;
    flex-direction: column;
    padding: 0 6px;
    padding-right: 5px;
  }
  p {
    width: 100%;
  }
  .separator {
    transform: rotateZ(90deg);
    padding-bottom: 20px;
  }
  transition: background-color 0.2s, border-color 0.3s;
  &:not(:disabled):hover {
    background: #333;
    border-color: #525252;

    cursor: pointer;
    .label {
      color: white !important;
    }
  }
`;
export default DropDown;
