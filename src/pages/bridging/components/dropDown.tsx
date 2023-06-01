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
  Items: Item[];
  activeItemId: string | undefined;
  title: string;
  onSelect: (id: string) => void;
}
const DropDown = ({ onSelect, Items, title, activeItemId }: Props) => {
  const [isSelectModalOpen, setSelectModalOpen] = useState(false);
  const activeItem = Items.find((item) => item.id === activeItemId);

  return (
    <Styled
      onClick={() => {
        setSelectModalOpen(true);
      }}
    >
      <img
        src={activeItem?.icon ?? ""}
        height={20}
        style={{
          marginRight: 8,
        }}
      />

      <Text type="title" size="text4" align="left">
        {activeItem?.primaryText ?? title}
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
