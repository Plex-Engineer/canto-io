import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import { ALL_BRIDGE_OUT_NETWORKS } from "pages/bridging/config/bridgeOutNetworks";
import { NativeToken } from "pages/bridging/config/interfaces";
import { copyAddress, formatAddress } from "pages/bridging/utils/utils";
import CopyToClipboard from "react-copy-to-clipboard";
import CopyIcon from "assets/copy.svg";
import { ReactNode } from "react";

interface IBCGuideModalProps {
  token: NativeToken;
  cantoAddress: string;
}
const IBCGuideModal = (props: IBCGuideModalProps) => {
  const network = ALL_BRIDGE_OUT_NETWORKS[props.token.supportedOutChannels[0]];
  return (
    <Styled>
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
