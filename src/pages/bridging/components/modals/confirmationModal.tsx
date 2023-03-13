import styled from "@emotion/styled";
import { TransactionState, useEthers } from "@usedapp/core";
import { formatUnits } from "ethers/lib/utils";
import LoadingModal from "global/components/modals/loading2";
import { CantoTransactionType } from "global/config/transactionTypes";
import { PrimaryButton, Text } from "global/packages/src";
import { ConvertTransaction } from "pages/bridging/config/interfaces";

interface Props {
  activeToken: ConvertTransaction;
  state: TransactionState;
  onConfirm: () => void;
  networkID: number;
}
const ConfirmationModal = (props: Props) => {
  const networkID = useEthers().chainId;
  const { switchNetwork } = useEthers();
  return (
    <Styled>
      {props.networkID != networkID && (
        <div className="network-change">
          <Text type="title">Oops, you seem to be on a wrong network.</Text>
          <PrimaryButton
            onClick={() => {
              switchNetwork(props.networkID);
            }}
          >
            Switch Network
          </PrimaryButton>
        </div>
      )}
      {props.state != "None" &&
        (props.networkID == networkID || networkID == undefined) && (
          <LoadingModal
            status={props.state}
            transactionType={CantoTransactionType.CONVERT_TO_COSMOS}
            onClose={() => {
              false;
            }}
          />
        )}
      {props.state == "None" &&
        (props.networkID == networkID || networkID == undefined) && (
          <>
            <Text type="title">Please confirm the transaction </Text>
            <div className="expanded">
              <img
                height={50}
                src={props.activeToken.token.icon}
                alt={props.activeToken.token.name}
              />
            </div>

            <div className="transactions">
              <div className="row">
                <div className="header">name :</div>
                <div className="value">
                  <Text type="title">{props.activeToken.token.name}</Text>
                </div>
              </div>
              <div className="row">
                <div className="header">from :</div>
                <div className="value">
                  <Text type="title">{props.activeToken.origin}</Text>
                </div>
              </div>
              <div className="row">
                <div className="header">to :</div>
                <div className="value">
                  <Text type="title">bridge</Text>
                </div>
              </div>
              <div className="row">
                <div className="header">amount :</div>
                <div className="value">
                  <Text type="title">
                    {formatUnits(
                      props.activeToken.amount,
                      props.activeToken.token.decimals
                    )}
                  </Text>
                </div>
              </div>
            </div>

            <Text size="text4" align="left" style={{ color: "#474747" }}>
              We can show some of the optional text, to info the user about the
              changes they are about to make.
            </Text>

            <PrimaryButton
              filled
              height="big"
              weight="bold"
              onClick={props.onConfirm}
            >
              confirm
            </PrimaryButton>
          </>
        )}
    </Styled>
  );
};

const Styled = styled.div`
  height: 36rem;
  width: 30rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding: 0 40px;
  padding-bottom: 2rem;
  gap: 2rem;

  .expanded {
    flex-grow: 2;
  }

  .network-change {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    height: 100%;
    justify-content: center;
    align-items: center;
  }

  .transactions {
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
export default ConfirmationModal;
