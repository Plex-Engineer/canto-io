/* eslint-disable sonarjs/no-duplicate-string */
import styled from "@emotion/styled";
import EthIcon from "assets/icons/ETH.svg";
import CantoIcon from "assets/logo.svg";
import ImageButton from "global/components/ImageButton";
import { useBridgeStore } from "../stores/gravityStore";
import LoadingBlip from "./LoadingBlip";
const SwitchBridging = () => {
  const [transactionType, SetTransactionType] = useBridgeStore((state) => [
    state.transactionType,
    state.setTransactionType,
  ]);
  return (
    <Styled>
      <div className="Switch">
        <div
          style={{
            filter: transactionType != "Bridge" ? "grayscale(100%)" : "",
          }}
        >
          <ImageButton
            src={EthIcon}
            alt="Ethereum"
            height={40}
            onClick={() => SetTransactionType("Bridge")}
          />
        </div>
        <LoadingBlip active={transactionType == "Bridge"} />
        <img
          src={CantoIcon}
          alt="Canto (Bridge)"
          height={40}
          style={{
            filter: "grayscale(100%)",
          }}
        />
        <LoadingBlip active={transactionType == "Convert"} />
        <div
          style={{
            filter: transactionType != "Convert" ? "grayscale(100%)" : "",
          }}
        >
          <ImageButton
            src={CantoIcon}
            alt="Canto (EVM)"
            height={40}
            onClick={() => SetTransactionType("Convert")}
          />
        </div>
      </div>
    </Styled>
  );
};

const Styled = styled.div`
  width: 24rem;
  margin: 2rem;
  .Switch {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
`;

export default SwitchBridging;
