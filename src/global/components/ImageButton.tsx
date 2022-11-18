import styled from "@emotion/styled";

interface Props {
  onClick: () => void;
  src: string;
  alt: string;
  height?: number;
  width?: number;
}

const Style = styled.button`
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;
const ImageButton = ({ onClick, alt, src, height, width }: Props) => {
  return (
    <Style
      onClick={onClick}
      style={{
        height,
        width,
      }}
    >
      <img src={src} alt={alt} height={height} width={width} />
    </Style>
  );
};

export default ImageButton;
