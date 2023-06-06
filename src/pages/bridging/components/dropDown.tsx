import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import Modal from "global/packages/src/components/molecules/Modal";
import { useEffect, useState } from "react";
import acronIcon from "assets/acron.svg";
import { ChooseNetwork } from "./recoveryTransaction";

interface Item {
  id: string;
  icon: string;
  primaryText: string;
  secondaryText?: string;
}

interface Props {
  Items: Item[];
  title: string;
  label?: string;
  onSelect: (id: string) => void;
}
const DropDown = ({ onSelect, Items, title, label }: Props) => {
  const [isSelectModalOpen, setSelectModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(Items[0]);

  return (
    <Styled
      onClick={() => {
        Items.length === 1 ? null : setSelectModalOpen(true);
      }}
      disabled={Items.length === 1}
    >
      <img
        src={activeItem.icon}
        height={40}
        style={{
          marginRight: 8,
        }}
      />
      <div className="token-label">
        {label && (
          <Text color="white" size="text3" className="label" bold align="left">
            {label}
          </Text>
        )}
        <Text type="title" size="text3" align="left">
          {activeItem.primaryText}
          <Modal
            title={title}
            open={isSelectModalOpen}
            onClose={() => {
              setSelectModalOpen(false);
            }}
          >
            <ChooseNetwork>
              <div className="network-list">
                {Items.map((item) => (
                  <div
                    role="button"
                    tabIndex={0}
                    key={item.id}
                    className="network-item"
                    onClick={() => {
                      setActiveItem(Items.filter((i) => i.id === item.id)[0]);
                      onSelect(item.id);
                      setSelectModalOpen(false);
                    }}
                    style={{
                      background: activeItem.id === item.id ? "#1d1d1d" : "",
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
    padding-right: 1rem;
  }
  p {
    width: 100%;
  }
  .separator {
    transform: rotateZ(90deg);
    padding-bottom: 20px;
  }
  transition: background-color 0.2s, border-color 0.3s;
  &:hover {
    background: #333;
    border-color: #525252;
    cursor: pointer;
  }
`;
export default DropDown;
