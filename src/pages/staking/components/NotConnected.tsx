import { OutlinedButton } from "global/packages/src";
import walletIcon from "assets/wallet.svg";
import styled from "@emotion/styled";
import { useEthers } from "@usedapp/core";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";

const NotConnected = () => {
  const { activateBrowserWallet } = useEthers();
  return (
    <Styled>
      <img src={walletIcon} alt="wallet" />
      <h1>you have not connected the wallet</h1>
      <OutlinedButton
        onClick={() => {
          activateBrowserWallet();
          addNetwork();
        }}
      >
        connect wallet
      </OutlinedButton>
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
