import styled from "@emotion/styled";
import { useEthers } from "@usedapp/core";
import { ConfirmTxModalProps } from "global/config/interfaces/modals";
import { PrimaryButton, Text } from "global/packages/src";
import LoadingModal from "./loading2";
import { CInput } from "global/packages/src/components/atoms/Input";

const ConfirmTxModal = (props: ConfirmTxModalProps) => {
  const currentNetworkId = useEthers().chainId;
  const { switchNetwork } = useEthers();
  return (
    <Styled>
      {" "}
      {currentNetworkId != props.networkId && (
        <div className="network-change">
          <Text type="title">Oops, you seem to be on a wrong network.</Text>
          <PrimaryButton
            onClick={() => {
              switchNetwork(props.networkId);
            }}
          >
            Switch Network
          </PrimaryButton>
        </div>
      )}
      {props.loadingProps.status != "None" && (
        <div className="loading">
          <LoadingModal {...props.loadingProps} />
        </div>
      )}
      {props.loadingProps.status == "None" &&
        props.networkId == currentNetworkId && (
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
  .loading {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
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
`;
