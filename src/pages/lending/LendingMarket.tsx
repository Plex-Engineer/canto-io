/* eslint-disable @typescript-eslint/ban-ts-comment */
import styled from "@emotion/styled";
import { useNotifications, Notification } from "@usedapp/core";
import { useState, useEffect } from "react";
import LendingTable from "./components/lendingTable";
import ReactTooltip from "react-tooltip";
import { TransactionRow } from "./components/lendingRow";
import { ModalType, ModalManager } from "./components/modals/modalManager";
import { toast } from "react-toastify";
import { Details } from "./hooks/useTransaction";
import { Container, Button } from "./components/Container";
import { useNetworkInfo } from "global/stores/networkInfo";
import { Mixpanel } from "mixpanel";
import { truncateNumber } from "global/utils/utils";
import useModalStore from "./stores/useModals";
import { useLMTokenData } from "./hooks/useLMTokenData";
import { LMTokenDetails } from "./config/interfaces";
import { useUserLMTokenData } from "./hooks/useUserLMTokenData";
import { formatUnits } from "ethers/lib/utils";
import {
  BorrowingTable,
  LMPositionBar,
  SupplyTable,
} from "./components/LMTables";

const LendingMarket = () => {
  //intialize network store
  const networkInfo = useNetworkInfo();
  const { notifications } = useNotifications();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const modalStore = useModalStore();
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 1000);

  function handleWindowSizeChange() {
    setIsMobile(window.innerWidth <= 1000);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    notifications.forEach((item) => {
      if (
        item.type == "transactionStarted" &&
        !notifs.find((it) => it.id == item.id)
      ) {
        setNotifs([...notifs, item]);
      }
      if (
        item.type == "transactionSucceed" ||
        item.type == "transactionFailed"
      ) {
        setNotifs(
          notifs.filter(
            //@ts-ignore
            (localItem) => localItem.transaction.hash != item.transaction.hash
          )
        );
      }
    });

    notifications.map((noti) => {
      if (
        //@ts-ignore
        (noti?.transactionName?.includes("type") &&
          noti.type == "transactionSucceed") ||
        noti.type == "transactionFailed"
      ) {
        const isSuccesful = noti.type != "transactionFailed";
        //@ts-ignore
        const msg: Details = JSON.parse(noti?.transactionName);
        switch (msg.type) {
          case "Supply":
            msg.type = "supplied";
            break;
          case "Borrow":
            msg.type = "borrowed";
            break;
          case "Withdraw":
            msg.type = "withdrawn";
            break;
          case "Repay":
            msg.type = "repaid";
            break;
          case "Collateralize":
            msg.type = "collateralized";
            break;
          case "Decollateralize":
            msg.type = "decollateralized";
            break;
          case "Enable":
            msg.type = "enabled";
            break;
          case "Claim":
            msg.type = "claimed";
            break;
        }

        const errormsg = isSuccesful ? "" : "not";
        const msged =
          (Number(msg.amount) > 0 ? Number(msg.amount).toFixed(2) : "") +
          ` ${msg.name} has ${errormsg} been ${msg.type}`;

        toast(msged, {
          position: "top-right",
          autoClose: 5000,
          toastId: noti.submittedAt,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressStyle: {
            color: `${
              isSuccesful ? "var(--primary-color)" : "var(--error-color"
            }`,
          },
          style: {
            border: "1px solid var(--primary-color)",
            borderRadius: "0px",
            paddingBottom: "3px",
            background: "black",
            color: `${
              isSuccesful ? "var(--primary-color)" : "var(--error-color"
            }`,
            height: "100px",
            fontSize: "20px",
          },
        });
      }
    });
  }, [notifications, notifs]);

  //this is used to generate some statistics about the token from the getMarkets
  Mixpanel.events.pageOpened("Lending Market", networkInfo.account);

  const lmTokenData: LMTokenDetails[] = useLMTokenData(networkInfo.chainId);
  const { userLMTokens, position, rewards } = useUserLMTokenData(
    lmTokenData,
    networkInfo.account,
    networkInfo.chainId
  );
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const [onLeftTab, setOnLeftTab] = useState(true);

  return (
    <Container className="lendingMarket">
      <ModalManager
        isOpen={modalStore.currentModal != ModalType.NONE}
        position={position}
        rewards={rewards}
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={() => {
            modalStore.open(ModalType.BALANCE);
          }}
          style={{ width: "15rem", alignSelf: "right" }}
        >
          claim LM rewards
        </Button>
      </div>
      <div style={{ textAlign: "right" }}>
        {!rewards.accrued.isZero()
          ? truncateNumber(formatUnits(rewards.accrued)) + " WCANTO "
          : ""}
      </div>

      <LMPositionBar
        borrowBalance={position.totalBorrow}
        borrowLimit={position.totalBorrowLimit}
        supplyBalance={position.totalSupply}
      />

      <SpecialTabs
        active={onLeftTab}
        onLeftTabClick={() => {
          setOnLeftTab(true);
        }}
        onRightTabClick={() => {
          setOnLeftTab(false);
        }}
      />

      <div>
        <div
          className="tables"
          style={{
            marginBottom: "2rem",
          }}
        >
          <SupplyTable
            visible={!isMobile || onLeftTab}
            supplying={true}
            userLMTokens={userLMTokens.filter((token) => token.inSupplyMarket)}
            onClick={(token) => {
              modalStore.setActiveToken(token);
              modalStore.open(ModalType.LENDING);
            }}
            onToggle={(token) => {
              modalStore.setActiveToken(token);
              token.collateral
                ? modalStore.open(ModalType.DECOLLATERAL)
                : modalStore.open(ModalType.COLLATERAL);
            }}
          />

          <BorrowingTable
            visible={!isMobile || !onLeftTab}
            borrowing={true}
            userLMTokens={userLMTokens.filter((token) => token.inBorrowMarket)}
            position={position}
            onClick={(token) => {
              modalStore.setActiveToken(token);
              modalStore.open(ModalType.BORROW);
            }}
          />
        </div>

        {/* This table is used for showing transaction status */}
        <div
          className="tables"
          style={{
            marginBottom: "1rem",
          }}
        >
          <div className="left">
            {notifs.filter(
              (filterItem) => filterItem.type == "transactionStarted"
            ).length > 0 ? (
              <LendingTable columns={["ongoing transactions"]} isLending>
                {notifs.map((item) => {
                  if (
                    //@ts-ignore
                    item?.transactionName?.includes("type") &&
                    item.type == "transactionStarted"
                  ) {
                    //@ts-ignore
                    const msg: Details = JSON.parse(item?.transactionName);

                    switch (msg.type) {
                      case "Supply":
                        msg.type = "supplying";
                        break;
                      case "Borrow":
                        msg.type = "borrowing";
                        break;
                      case "Withdraw":
                        msg.type = "withdrawing";
                        break;
                      case "Repay":
                        msg.type = "repaying";
                        break;
                      case "Collateralize":
                        msg.type = "collateralizing";
                        break;
                      case "Decollateralize":
                        msg.type = "decollateralizing";
                        break;
                      case "Enable":
                        msg.type = "enabling";
                        break;
                      case "Claim":
                        msg.type = "claiming";
                        break;
                    }
                    return (
                      <TransactionRow
                        key={msg.name + msg.type}
                        icon={msg.icon}
                        name={msg.name.toLowerCase()}
                        status={
                          msg.type +
                          " " +
                          (Number(msg.amount) > 0
                            ? Number(msg.amount).toFixed(2)
                            : "") +
                          " " +
                          msg.name
                        }
                        date={new Date(item.submittedAt)}
                      />
                    );
                  }
                  return null;
                })}
              </LendingTable>
            ) : null}
          </div>

          <div className="right">
            {/* {borrowFilter.length > 0 ? (
            <LendingTable columns={["ongoing transactions"]} isLending>
              {borrowFilter.map((rand) => {
                //@ts-ignore
                const ppNotif: Details = rand?.transactionName;
                return (
                  <TransactionRow
                    icon={ppNotif.icon}
                    name={ppNotif.name}
                    status={ppNotif.type + " " + ppNotif.amount}
                    date={new Date(ppNotif.time)}
                  />
                );
              })}
            </LendingTable>
          ) : null} */}
          </div>
        </div>
        {/* These tables only show ERC20TOKENs*/}
        <div
          className="tables"
          style={{
            display: "flex",
          }}
        >
          {
            <SupplyTable
              visible={!isMobile || onLeftTab}
              supplying={false}
              userLMTokens={userLMTokens.filter(
                (token) => !token.inSupplyMarket
              )}
              onClick={(token) => {
                modalStore.setActiveToken(token);
                modalStore.open(ModalType.LENDING);
              }}
              onToggle={(token) => {
                modalStore.setActiveToken(token);
                token.collateral
                  ? modalStore.open(ModalType.DECOLLATERAL)
                  : modalStore.open(ModalType.COLLATERAL);
              }}
            />
          }

          {
            <BorrowingTable
              visible={!isMobile || !onLeftTab}
              borrowing={false}
              userLMTokens={userLMTokens.filter(
                (token) => !token.inBorrowMarket
              )}
              position={position}
              onClick={(token) => {
                modalStore.setActiveToken(token);
                modalStore.open(ModalType.BORROW);
              }}
            />
          }
        </div>
      </div>
    </Container>
  );
};

interface SpecialTabsProps {
  onLeftTabClick: () => void;
  onRightTabClick: () => void;
  active: boolean;
}

interface ActiveProps {
  active: boolean;
}
const SpecialTabs = (props: SpecialTabsProps) => {
  const TabBar = styled.div`
    display: flex;
  `;
  const Tab = styled.div<ActiveProps>`
    width: 50%;
    text-align: center;
    background-color: #0a2d15;
    @media (max-width: 1000px) {
      background-color: ${(props) => (props.active ? "#0f742f" : "#0a2d15")};
      &:hover {
        background-color: #0f742f;
        cursor: pointer;
      }
    }
  `;

  return (
    <TabBar>
      <Tab active={props.active} data-active onClick={props.onLeftTabClick}>
        supply
      </Tab>
      <Tab active={!props.active} onClick={props.onRightTabClick}>
        borrow
      </Tab>
    </TabBar>
  );
};
export default LendingMarket;
