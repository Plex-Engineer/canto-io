/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useNotifications, Notification } from "@usedapp/core";
import { useState } from "react";
import LendingTable from "./components/table";
import { TransactionRow } from "./components/lendingRow";
import { ModalType, ModalManager } from "./modals/modalManager";
import { Details } from "./hooks/useTransaction";
import { Styled } from "./components/Styled";
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
import { useToast } from "./hooks/useToasts";
import { SpecialTabs } from "./components/SpecialTabs";
import { OutlinedButton } from "global/packages/src";
import FadeIn from "react-fade-in";
const LendingMarket = () => {
  const networkInfo = useNetworkInfo();
  const { notifications } = useNotifications();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const modalStore = useModalStore();
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 1000);

  useToast(setIsMobile, notifications, notifs, setNotifs);

  //this is used to generate some statistics about the token from the getMarkets
  Mixpanel.events.pageOpened("Lending Market", networkInfo.account);

  const lmTokenData: LMTokenDetails[] = useLMTokenData(networkInfo.chainId);
  const { userLMTokens, position, rewards } = useUserLMTokenData(
    lmTokenData,
    networkInfo.account,
    networkInfo.chainId
  );

  const [onLeftTab, setOnLeftTab] = useState(true);

  return (
    <Styled as={FadeIn}>
      <ModalManager
        isOpen={modalStore.currentModal != ModalType.NONE}
        position={position}
        rewards={rewards}
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <OutlinedButton
          onClick={() => {
            modalStore.open(ModalType.BALANCE);
          }}
        >
          claim LM rewards
        </OutlinedButton>
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
    </Styled>
  );
};

export default LendingMarket;
