import styled from "@emotion/styled";
import { useEthers } from "@usedapp/core";
import { ConfirmTxModalProps } from "global/config/interfaces/modals";
import { PrimaryButton, Text } from "global/packages/src";
import { CInput } from "global/packages/src/components/atoms/Input";
import OngoingTxModal from "./ongoingTxModal";

const ConfirmTxModal = (props: ConfirmTxModalProps) => {
  const currentNetworkId = useEthers().chainId;
  const { switchNetwork } = useEthers();
  return (
    <Styled>
      <OngoingTxModal onClose={props.onClose} />{" "}
      {currentNetworkId != props.networkId && (
        <div className="network-change">
          <Text type="title">Oops, you seem to be on a wrong network.</Text>
          <PrimaryButton
            onClick={() => {
              switchNetwork(props.networkId ?? 0);
            }}
          >
            Switch Network
          </PrimaryButton>
        </div>
      )}
      {props.networkId == currentNetworkId && (
        <>
          <Text type="title" size="title2">
            {props.title}
          </Text>
          {props.titleIcon}
          {props.confirmationValues.length > 0 && (
            <div className="confirm-details">
              {props.confirmationValues.map((value, index) => (
                <ConfirmationRow
                  key={index}
                  title={value.title}
                  value={value.value}
                />
              ))}
            </div>
          )}
          {props.extraInputs.length > 0 && (
            <div className="confirm-details">
              {props.extraInputs.map((input, index) => (
                <div className="row" style={{ margin: "8px 0" }} key={index}>
                  <div className="header">{`${input.header} :`}</div>
                  <div className="value">
                    <CInput
                      style={{
                        border: "1px solid #282828",
                        backgroundColor: "transparent",
                        width: "16rem",
                      }}
                      placeholder={input.placeholder}
                      value={input.value}
                      onChange={(val) => {
                        input.setValue(val.target.value);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {props.extraDetails}
          <PrimaryButton
            filled
            height="big"
            weight="bold"
            onClick={props.onConfirm}
            disabled={props.disableConfirm}
          >
            confirm
          </PrimaryButton>
        </>
      )}
    </Styled>
  );
};
interface ConfirmationRowProps {
  title: string;
  value: string | number;
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
//component for token icon with name (modal based off this, but any component can be used)
interface TokenWithIconProps {
  icon: string;
  name: string;
}
export const TokenWithIcon = ({ icon, name }: TokenWithIconProps) => (
  <div style={{ flexGrow: 2, display: "grid", placeItems: "center" }}>
    <>
      <img height={50} src={icon} alt={name} />
      <Text type="title" size="title3">
        {name}
      </Text>
    </>
  </div>
);
export default ConfirmTxModal;

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
  .expanded {
    flex-grow: 1;
  }

  .loading {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .expanded {
    flex-grow: 2;
    display: grid;
    place-items: center;
  }
  .network-change {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    height: 100%;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
  }
  .confirm-details {
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

  .locked {
    position: relative;
    margin: 2rem 0;
    .icons {
      position: absolute;
      bottom: -10px;
      left: 60px;
      border: 1px solid var(--primary-color);
      border-radius: 50px;
      background-color: #111;
      padding: 2px 4px;

      img {
        transform: translateY(3px);
      }
    }
  }
`;
