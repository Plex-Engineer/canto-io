/* eslint-disable jsx-a11y/no-static-element-interactions */
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
        <div className="backdrop">
          <div
            className={`left ${transactionType == "Bridge" ? "active" : ""}`}
            onClick={() => SetTransactionType("Bridge")}
          ></div>
          <div className="mid"></div>
          <div
            className={`right ${transactionType == "Convert" ? "active" : ""}`}
            onClick={() => SetTransactionType("Convert")}
          ></div>
        </div>
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
            width: "20%",
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
  width: 40rem;
  margin: 2rem;
  position: relative;
  .Switch {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 4rem;

    /* border: 2px solid var(--primary-color); */
  }

  .backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
  }
  .mid {
    width: 40%;
    border: 2px solid #4b4b4b;
    border-left: none;
    border-right: none;
  }
  .left,
  .right {
    width: 100%;
    height: 100%;
    border-radius: 36px;
    border: 2px solid #4b4b4b;
    background-color: #4b4b4b3c;
    cursor: pointer;
    &:hover {
      border: 2px solid var(--primary-color);
      background-color: #06fc9a37;
    }
  }

  .right {
    border-radius: 0 36px 36px 0;
  }

  .left {
    border-radius: 36px 0 0 36px;
  }

  .active {
    border: 2px solid var(--primary-color);
    background-color: #06fc9a37;
  }
`;

export default SwitchBridging;
