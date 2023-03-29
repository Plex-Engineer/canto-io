import styled from "@emotion/styled";

interface DualType {
  iconLeft: string;
  iconRight: string;
}
const IconPair = (props: DualType) => {
  return (
    <Styled>
      <img
        src={props.iconLeft}
        height={40}
        style={{
          zIndex: "2",
        }}
      />
      <img
        src={props.iconRight}
        height={40}
        style={{
          marginLeft: "-0.7rem",
        }}
      />
    </Styled>
  );
};

const Styled = styled.span`
  display: flex;
  align-content: center;
  align-items: center;
`;
export default IconPair;
