import styled from "@emotion/styled";
import { PrimaryButton, Text } from "global/packages/src";
import { ALL_BRIDGE_OUT_NETWORKS } from "pages/bridging/config/bridgeOutNetworks";
import { NativeToken } from "pages/bridging/config/interfaces";
import { copyAddress, formatAddress } from "pages/bridging/utils/utils";
import CopyToClipboard from "react-copy-to-clipboard";
import CopyIcon from "assets/copy.svg";
import { ReactNode, useState } from "react";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { coin, SigningStargateClient, GasPrice } from "@cosmjs/stargate";
import { getBlockTimestamp } from "pages/bridging/utils/IBC/IBCTransfer";
import { CInput } from "global/packages/src/components/atoms/Input";
interface IBCGuideModalProps {
  token: NativeToken;
  cantoAddress: string;
}
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

const IBCGuideModal = (props: IBCGuideModalProps) => {
  const [userKeplrAddress, setUserKeplrAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [keplrClient, setKeplrClient] = useState<SigningStargateClient>();
  const [amount, setAmount] = useState("");
  const network = ALL_BRIDGE_OUT_NETWORKS[props.token.supportedOutChannels[0]];
  async function setKeplrAddressAndBalance() {
    if (!window.keplr) {
      console.error("no keplr installed");
    } else {
      await window.keplr.enable(network.chainId);
      const offlineSinger = window.keplr.getOfflineSigner(network.chainId);
      const accounts = await offlineSinger.getAccounts();
      setUserKeplrAddress(accounts[0].address);
      const client = await SigningStargateClient.connectWithSigner(
        network.rpcEndpoint,
        offlineSinger,
        {
          gasPrice: GasPrice.fromString("300000" + network.nativeDenom),
        }
      );
      setKeplrClient(client);
      const balance = await client.getBalance(
        accounts[0].address,
        network.nativeDenom
      );
      setBalance(balance.amount);
    }
  }
  async function createIBCMsg() {
    const blockTimestamp = await getBlockTimestamp(
      network.restEndpoint,
      network.extraEndpoints,
      network.latestBlockEndpoint
    );
    await keplrClient?.sendIbcTokens(
      userKeplrAddress,
      props.cantoAddress,
      coin(amount, network.nativeDenom),
      "transfer",
      network.networkChannel,
      undefined,
      Number(blockTimestamp),
      "auto",
      "ibc transfer"
    );
  }
  return (
    <Styled>
      <PrimaryButton onClick={setKeplrAddressAndBalance}>
        Connect to keplr
      </PrimaryButton>
      <PrimaryButton onClick={createIBCMsg}>create tx</PrimaryButton>
      <div className="header">amount :</div>
      <div className="value">
        <CInput
          style={{
            border: "1px solid #282828",
            backgroundColor: "transparent",
            width: "16rem",
          }}
          placeholder={"0"}
          value={amount}
          onChange={(val) => {
            setAmount(val.target.value);
          }}
        />
      </div>
      {userKeplrAddress}
      <br />
      {"balance: " + balance}
      <div>
        <img height={50} src={props.token.icon} alt={props.token.name} />
        <Text type="title" size="title3">
          {props.token.name}
        </Text>
        <br />
        <Text type="text" size="text2">
          {`To bridge ${props.token.name} from the ${network.name} network into Canto you'll need to do an IBC transfer to Canto Mainnet`}
        </Text>
      </div>
      <br />
      <div className="values">
        <ConfirmationRow title="network" value={network.name} />
        <ConfirmationRow title="channel" value={network.networkChannel} />
        <ConfirmationRow
          title="address"
          value={
            <CopyToClipboard text={props.cantoAddress} onCopy={copyAddress}>
              <Text type="title" style={{ cursor: "pointer" }}>
                {formatAddress(props.cantoAddress, 6)}
                <img
                  src={CopyIcon}
                  style={{
                    height: "18px",
                    position: "relative",
                    top: "5px",
                    left: "4px",
                  }}
                />
              </Text>
            </CopyToClipboard>
          }
        />
      </div>
      <Text>
        To learn more about the ibc process, please read{" "}
        <a
          role="button"
          tabIndex={0}
          onClick={() =>
            window.open(
              "https://docs.canto.io/user-guides/bridging-assets/to-canto#from-cosmos-hub-or-other-ibc-enabled-chain",
              "_blank"
            )
          }
          style={{
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          here
        </a>
      </Text>
    </Styled>
  );
};
interface ConfirmationRowProps {
  title: string;
  value: ReactNode;
}
const ConfirmationRow = ({ title, value }: ConfirmationRowProps) => {
  return (
    <div className="row">
      <div className="header">{title} :</div>
      <div className="value">
        <Text type="title">{value}</Text>
      </div>
    </div>
  );
};

const Styled = styled.div`
  min-height: 36rem;
  width: 30rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding: 0 40px;
  padding-bottom: 2rem;
  gap: 1rem;
  text-align: center;

  .values {
    background: #0b0b0b;
    border: 1px solid #2f2f2f;
    border-radius: 4px;
    width: 100%;
    padding: 1rem;
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 2rem;

      .header {
        color: #9b9b9b;
      }
    }
  }
`;
export default IBCGuideModal;
