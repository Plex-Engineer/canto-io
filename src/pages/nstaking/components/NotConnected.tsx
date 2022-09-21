import { OutlinedButton } from "cantoui";
import walletIcon from "assets/wallet.svg";
import styled from "@emotion/styled";

const NotConnected = () => {
  return (
    <Styled>
      <img src={walletIcon} alt="wallet" />
      <h1>you have not connected the wallet</h1>
      <OutlinedButton>Connect Wallet</OutlinedButton>
    </Styled>
  );
};

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  height: calc(100vh - 12rem);
  h1 {
    width: 340px;
    text-align: center;
  }
`;
export default NotConnected;
