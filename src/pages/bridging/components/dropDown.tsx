import styled from "@emotion/styled/";
import { Text } from "global/packages/src";
import Modal from "global/packages/src/components/molecules/Modal";
import { useState } from "react";
import acronIcon from "assets/acron.svg";

interface Item {
  id: string;
  icon: string;
  primaryText: string;
  secondaryText?: string;
}

interface Props {
  selectedItem: Item;
  Items: Item[];

  onSelect: (id: string) => void;
}
const DropDown = ({ selectedItem, onSelect, Items }: Props) => {
  const [isSelectModalOpen, setSelectModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(selectedItem);

  return (
    <Styled onClick={() => onSelect(selectedItem.id)}>
      <Text type="title" size="text4" align="left">
        {selectedItem.primaryText}
        <Modal
          title="select network"
          open={isSelectModalOpen}
          onClose={() => {
            setSelectModalOpen(false);
          }}
        >
          <div className="network-list">
            {Items.map((item) => (
              <div
                role="button"
                tabIndex={0}
                key={item.id}
                className="network-item"
                onClick={() => {
                  setSelectModalOpen(false);
                  setActiveItem(activeItem);
                }}
                style={{
                  background: selectedItem.id === item.id ? "#1d1d1d" : "",
                }}
              >
                <span>
                  <img src={activeItem.icon} />
                  <Text>{item.primaryText}</Text>
                </span>
              </div>
            ))}
          </div>
        </Modal>
      </Text>
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
  height: 42px;
  p {
    width: 100%;
  }
  .separator {
    transform: rotateZ(90deg);
    padding-bottom: 20px;
  }

  &:hover {
    background: #181818;
    cursor: pointer;
  }
`;
export default DropDown;
