import styled from "@emotion/styled";
import loadingIcon from "assets/loading.gif";

const Loading = () => {
  return (
    <Styled>
      <img src={loadingIcon} alt="loading" height={80} />
    </Styled>
  );
};

export default Loading;
const Styled = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
