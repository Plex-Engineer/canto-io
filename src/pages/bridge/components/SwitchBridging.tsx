/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable sonarjs/no-duplicate-string */
import styled from "@emotion/styled";
import bridgeIcon from "assets/icons/canto-bridge.svg";

import ImageButton from "global/components/ImageButton";
import { Text } from "global/packages/src";
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
      <div
        className="active-back"
        style={{
          right: transactionType == "Bridge" ? "39.7%" : "0px",
        }}
      ></div>
      <div className="Switch">
        <div className="center">
          <ImageButton
            src={props.left.icon}
            alt={props.left.name}
            height={props.left.height ?? 42}
            onClick={() => SetTransactionType("Bridge")}
          />
          <Text className="name" type="text">
            {props.left.name}
          </Text>
        </div>
        <LoadingBlip active={transactionType == "Bridge"} />

        <div className="center">
          <img
            src={bridgeIcon}
            alt={"canto (Bridge)"}
            height={42}
            style={{ marginBottom: "3px" }}
          />
          <Text className="name" type="text">
            Bridge
          </Text>
        </div>

        <LoadingBlip active={transactionType == "Convert"} />
        <div className="center">
          <ImageButton
            src={props.right.icon}
            alt={props.right.name}
            height={props.right.height ?? 42}
            onClick={() => SetTransactionType("Convert")}
          />
          <Text className="name" type="text">
            {props.right.name}
          </Text>
        </div>
      </div>

      <div className="backdrop">
        <div
          className={`left ${transactionType == "Bridge" ? "active" : ""}`}
          onClick={() => SetTransactionType("Bridge")}
        />
        <div className="mid" />
        <div
          className={`right ${transactionType == "Convert" ? "active" : ""}`}
          onClick={() => SetTransactionType("Convert")}
        />
      </div>
    </Styled>
  );
};

const Styled = styled.div`
  width: 34rem;
  max-width: 34rem;
  height: 8rem;
  margin-top: 26px;

  position: relative;
  background-color: #222222;
  border-radius: 4px;
  .Switch {
    position: absolute;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }
  .center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    gap: 0.3rem;
    height: 100%;
    * {
      font-family: "Silkscreen";
    }
  }
  .backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    z-index: 0;
  }

  .left,
  .right {
    pointer-events: fill;

    width: 100%;
    height: 100%;
    border-radius: 36px;
    /* border: 2px solid #4b4b4b; */
    /* background-color: #4b4b4b3c; */
    cursor: pointer;
    transition: all 0.2s;
    /* &:hover {
      border: 2px solid var(--primary-color);
      background-color: #06fc9a37;
    } */
  }

  .right {
    border-radius: 0 4px 4px 0;
  }

  .left {
    border-radius: 4px 0 0 4px;
  }

  .active-back {
    position: absolute;
    background-color: #000000ae;
    border-radius: 4px;
    width: 58%;
    margin: 6px;
    height: 92%;
    transition: right 0.3s;
  }
  @media (max-width: 1000px) {
    width: 90vw;
    /* margin: 0; */
    .active-back {
      width: 56%;
    }
    .Switch {
      /* padding: 1rem; */
    }

    .name {
      display: none;
    }
  }
`;

export default SwitchBridging;
