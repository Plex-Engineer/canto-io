import styled from "@emotion/styled";
import { ModalManager, ModalType } from "./modals/modalManager";
import { useState } from "react";
import { ToolTip } from "./Tooltip";
const Wrapper = styled.label`
  /* The switch - the box around the slider */
  position: relative;
  display: flex;
  margin: 0 auto;
  width: 64px;
  height: 34px;

  /* Hide default HTML checkbox */
  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .slider {
      background-color: var(--primary-color);
      &:before {
        background-color: black;
        border-radius: 50%;
        bottom: 3px;
      }

      &:hover {
        background-color: #0f4c34;
      }
      &:active {
        background-color: #053723;
      }
    }

    &:focus + .slider {
      box-shadow: 0 0 1px var(--primary-color);
    }

    &:checked + .slider:before {
      -webkit-transform: translateX(29px);
      -ms-transform: translateX(29px);
      transform: translateX(29px);
    }
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: black;

    &:hover {
      background-color: #13c27c;
    }
    &:active {
      background-color: #0e4730;
    }
    border: 1px solid var(--primary-color);

    border-radius: 5px;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    &:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 3px;
      background-color: var(--primary-color);
      -webkit-transition: 0.4s;
      transition: 0.4s;
      border-radius: 50%;
    }
  }
`;
interface Props {
  onChange: () => void;
  checked: boolean;
  disabled: boolean;
}

const DisabledWrapper = styled(Wrapper)`
  input {
    &:checked + .slider {
      background-color: #333;
      &:before {
        background-color: black;
      }

      &:hover {
        background-color: #0f4c34;
      }
      &:active {
        background-color: #053723;
      }
    }

    &:focus + .slider {
      box-shadow: 0 0 1px #333;
    }
  }

  /* The slider */
  .slider {
    background-color: black;

    &:hover {
      background-color: #737373;
    }
    &:active {
      background-color: #909090;
    }
    border: 1px solid #333;
    &:before {
      background-color: #333;
    }
  }
`;

const LendingSwitch = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  if (props.disabled) {
    return (
      <ToolTip data-tooltip="this asset cannot be collateralized">
        <DisabledWrapper className="switch" data-for="foo">
          <input type="checkbox" checked={props.checked} />

          <span className="slider"></span>
        </DisabledWrapper>
      </ToolTip>
    );
  }
  return (
    <Wrapper
      className="switch"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <input
        type="checkbox"
        checked={props.checked}
        onChange={(e) => {
          setIsOpen(true);
          props.onChange();
        }}
      />
      <ModalManager isOpen={isOpen} />
      <span className="slider"></span>
    </Wrapper>
  );
};

export default LendingSwitch;
