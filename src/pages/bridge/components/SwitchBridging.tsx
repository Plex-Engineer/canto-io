/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable sonarjs/no-duplicate-string */
import styled from "@emotion/styled";
import bridgeIcon from "assets/icons/canto-bridge.svg";

import ImageButton from "global/components/ImageButton";
import { PrimaryButton, Text } from "global/packages/src";
import { useBridgeStore } from "../stores/gravityStore";
import LoadingBlip from "./LoadingBlip";
import down from "assets/down.svg";
import { StyledPopup } from "./TokenSelect";
import NetworksModal from "./networksModal";
import { allBridgeOutNetworks } from "../config/gravityBridgeTokens";
import { useTokenStore } from "../stores/tokenStore";
import { useRef } from "react";

interface Props {
  left: {
    icon: string;
    name: string;
    height?: number;
    //selectable indicates selectable bridge in network
    selectable?: boolean;
  };
  right: {
    icon: string;
    name: string;
    height?: number;
    //selectable indicates selectable bridge out network
    selectable?: boolean;
  };
  bridgeIn: boolean;
}
const SwitchBridging = (props: Props) => {
  const networkSelectRef = useRef(null);
  const [transactionType, SetTransactionType] = useBridgeStore((state) => [
    state.transactionType,
    state.setTransactionType,
  ]);
  const setBridgeOutNetwork = useTokenStore().setBridgeOutNetwork;
  return (
    <>
      {" "}
      <ButtonDiv>
        <PrimaryButton
          className="buttn"
          onClick={() => SetTransactionType("Bridge")}
        >
          Step 1: <br />{" "}
          {props.bridgeIn
            ? "bridge from etheruem to canto bridge"
            : "bridge from canto evm to canto bridge"}
        </PrimaryButton>
        <PrimaryButton
          className="buttn"
          onClick={() => SetTransactionType("Convert")}
        >
          Step 2: <br />{" "}
          {props.bridgeIn
            ? "bridge from canto bridge to canto evm"
            : "bridge from canto bridge to " + props.right.name}
        </PrimaryButton>
      </ButtonDiv>
      <Styled>
        <div
          className="active-back"
          style={{
            right: transactionType == "Bridge" ? "calc(41.2% - 4px)" : "0px",
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
              style={{ marginBottom: "2px" }}
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
            <div
              style={{
                gap: "0.3rem",
                display: "flex",
              }}
            >
              <Text className="name" type="text">
                {props.right.name}
              </Text>
              {props.right.selectable ? <img src={down} alt="" /> : null}
            </div>
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
          >
            <StyledPopup
              ref={networkSelectRef}
              overlayStyle={{ zIndex: 1000 }}
              arrow={false}
              trigger={
                transactionType == "Convert" ? (
                  <div
                    style={{
                      height: "50%",
                      width: "50%",
                      marginLeft: "50%",
                      marginTop: "25%",
                      opacity: "0.2",
                    }}
                  ></div>
                ) : (
                  <></>
                )
              }
            >
              <NetworksModal
                networks={allBridgeOutNetworks}
                onClose={(network) => {
                  if (networkSelectRef != null) {
                    //@ts-ignore
                    networkSelectRef.current?.close();
                  }
                  setBridgeOutNetwork(network ?? 0);
                }}
              />
            </StyledPopup>
          </div>
        </div>
      </Styled>
    </>
  );
};

const ButtonDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
  width: 100%;
  .buttn {
    width: 15rem;
    height: 6rem;
  }
`;

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
    /* pointer-events: fill; */

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
    margin: 4px;
    height: calc(100% - 8px);
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
