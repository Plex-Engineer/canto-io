import styled from "@emotion/styled";
import { useEthers } from "@usedapp/core";
import { formatUnits } from "ethers/lib/utils";
import LoadingModal from "global/components/modals/loading2";
import { PrimaryButton, Text } from "global/packages/src";
import { CInput } from "global/packages/src/components/atoms/Input";
import { truncateNumber } from "global/utils/utils";
import { BridgeModal } from "pages/bridging/config/interfaces";
import { formatAddress } from "pages/bridging/utils/utils";

const ConfirmationModal = (props: BridgeModal) => {
  const networkID = useEthers().chainId;
  const { switchNetwork } = useEthers();
  const canConfirm =
    !props.ibcData ||
    props.ibcData.selectedNetwork.checkAddress(props.ibcData.userInputAddress);
  return (
    <Styled>
      {props.from.chainId != networkID && networkID != undefined && (
        <div className="network-change">
          <Text type="title">Oops, you seem to be on a wrong network.</Text>
          <PrimaryButton
            onClick={() => {
              switchNetwork(props.from.chainId);
            }}
          >
            Switch Network
          </PrimaryButton>
        </div>
      )}
      {props.tx.state != "None" &&
        (props.from.chainId == networkID || networkID == undefined) && (
          <div className="loading">
            <LoadingModal
              transactionType={props.tx.txType}
              status={props.tx.state}
              tokenName={props.token.name}
              onClose={() => {
                false;
              }}
            />
          </div>
        )}
      {props.tx.state == "None" &&
        (props.from.chainId == networkID || networkID == undefined) && (
          <>
            <Text type="title" size="title2">
              {props.tx.txName}{" "}
            </Text>
            <div className="expanded">
              <>
                <img
                  height={50}
                  src={props.token.icon}
                  alt={props.token.name}
                />
                <Text type="title" size="title3">
                  {props.token.name}
                </Text>
              </>
            </div>
            <div className="transactions">
              {props.tx.txName != "approve token" && (
                <>
                  <ConfirmationRow
                    title="from"
                    value={`${formatAddress(props.from.address)}`}
                  />
                  <ConfirmationRow
                    title="to"
                    value={`${formatAddress(props.to.address)}`}
                  />
                  <ConfirmationRow
                    title="amount"
                    value={
                      truncateNumber(
                        formatUnits(props.amount, props.token.decimals)
                      ) +
                      " " +
                      props.token.symbol
                    }
                  />
                </>
              )}
            </div>

            {props.ibcData && (
              <div className="transactions">
                <div
                  className="row"
                  style={{
                    margin: "8px 0",
                  }}
                >
                  <div className="header">address :</div>
                  <div className="value">
                    <CInput
                      style={{
                        border: "1px solid #282828",
                        backgroundColor: "transparent",
                        width: "16rem",
                      }}
                      placeholder={
                        props.ibcData.selectedNetwork.addressBeginning + "1..."
                      }
                      value={props.ibcData.userInputAddress}
                      onChange={(val) => {
                        props.ibcData?.setUserInputAddress(val.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <Text size="text4" align="left" style={{ color: "#474747" }}>
              We can show some of the optional text, to info the user about the
              changes they are about to make.
            </Text>

            <PrimaryButton
              filled
              height="big"
              weight="bold"
              onClick={() => {
                if (props.ibcData) {
                  props.tx.send(
                    props.amount.toString(),
                    props.ibcData.userInputAddress,
                    props.ibcData.selectedNetwork
                  );
                } else {
                  props.tx.send(props.amount.toString());
                }
              }}
              disabled={!canConfirm}
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
  value: string;
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
