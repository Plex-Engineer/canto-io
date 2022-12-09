import styled from "@emotion/styled";

interface Props {
  checked: boolean;
  onChange: (val: boolean) => void;
}

const CheckBox = ({ checked, onChange }: Props) => {
  return (
    <Styled
      checked={checked}
      onChange={() => {
        return;
      }}
      onClick={() => {
        onChange(!checked);
      }}
    ></Styled>
  );
};

const Styled = styled.div<Props>`
  transition: all 0.2s ease-in-out;

  height: 20px;
  width: 20px;
  border-radius: 4px;
  border: ${(props) =>
    props.checked
      ? "3px solid var(--primary-darker-color)"
      : "1px solid var(--primary-color)"};
  background-color: ${(props) =>
    props.checked ? "var(--primary-color)" : "transparent"};

  &:hover {
    border: ${(props) =>
      props.checked
        ? "2px solid var(--primary-darker-color)"
        : "2px solid var(--primary-color)"};
    cursor: pointer;
  }
`;
export default CheckBox;
