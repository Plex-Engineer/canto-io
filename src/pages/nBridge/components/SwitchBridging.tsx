/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable sonarjs/no-duplicate-string */
import styled from "@emotion/styled";
import bridgeIcon from "assets/bridge.svg";

import ImageButton from "global/components/ImageButton";
import { useBridgeStore } from "../stores/gravityStore";
import LoadingBlip from "./LoadingBlip";

interface Props {
  left: {
    icon: string;
    name: string;
    height?: number;
  };
  right: {
    icon: string;
    name: string;
    height?: number;
  };
}
const SwitchBridging = (props: Props) => {
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
          className="center"
          style={{
            filter: transactionType != "Bridge" ? "grayscale(100%)" : "",
          }}
        >
          <ImageButton
            src={props.left.icon}
            alt={props.left.name}
            height={props.left.height ?? 24}
            onClick={() => SetTransactionType("Bridge")}
          />
          {/* <Text>Ethereum</Text> */}
        </div>
        <LoadingBlip active={transactionType == "Bridge"} />
        <div className="center">
          <img
            src={bridgeIcon}
            alt={"canto (Bridge)"}
            height={40}
            style={{
              filter: "grayscale(100%)",
            }}
          />
        </div>
        <LoadingBlip active={transactionType == "Convert"} />
        <div
          className="center"
          style={{
            filter: transactionType != "Convert" ? "grayscale(100%)" : "",
          }}
        >
          <ImageButton
            src={props.right.icon}
            alt={props.right.name}
            height={props.right.height ?? 20}
            onClick={() => SetTransactionType("Convert")}
          />
          {/* <Text type>Canto (EVM)</Text> */}
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
    display: grid;
    grid-template-columns: 1fr 1fr 2fr 1fr 1fr;
    width: 100%;
    justify-content: center;
    align-items: center;
    padding: 1rem 3rem;

    /* border: 2px solid var(--primary-color); */
  }
  .center {
    display: grid;
    justify-content: center;
    pointer-events: none;
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
    pointer-events: fill;

    width: 100%;
    height: 100%;
    border-radius: 36px;
    border: 2px solid #4b4b4b;
    background-color: #4b4b4b3c;
    cursor: pointer;
    transition: all 0.2s;
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
    /* border: 2px solid var(--primary-color);
    background-color: #06fc9a37; */
  }
`;

export default SwitchBridging;
