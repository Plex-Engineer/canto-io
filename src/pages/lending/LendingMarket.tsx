import { useNotifications, Notification } from "@usedapp/core";
import { useEffect, useState } from "react";
import LendingTable from "./components/table";
import { TransactionRow } from "./components/lendingRow";
import { ModalType, ModalManager } from "./modals/modalManager";
import { Details } from "./hooks/useTransaction";
import { Styled } from "./components/Styled";
import { useNetworkInfo } from "global/stores/networkInfo";
import { transactionStatusActions, truncateNumber } from "global/utils/utils";
import useModalStore from "./stores/useModals";
import { useLMTokenData } from "./hooks/useLMTokenData";
import { LMTokenDetails } from "./config/interfaces";
import { useUserLMTokenData } from "./hooks/useUserLMTokenData";
import { formatUnits } from "ethers/lib/utils";
import { BorrowingTable, SupplyTable } from "./components/LMTables";
import { SpecialTabs } from "./components/SpecialTabs";
import FadeIn from "react-fade-in";
import HelmetSEO from "global/components/seo";
import { LMPositionBar } from "./components/LMPositionBar";
import { useOngoingTransactions } from "global/utils/handleOnGoingTransactions";
const LendingMarket = () => {
  const networkInfo = useNetworkInfo();
  const { notifications } = useNotifications();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  useOngoingTransactions(notifications, notifs, setNotifs);
  const modalStore = useModalStore();
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 1000);

  const lmTokenData: LMTokenDetails[] = useLMTokenData(networkInfo.chainId);
  const { userLMTokens, position, rewards } = useUserLMTokenData(
    lmTokenData,
    networkInfo.account,
    networkInfo.chainId
  );

  const [onLeftTab, setOnLeftTab] = useState(true);
  function handleWindowSizeChange() {
    setIsMobile(window.innerWidth <= 1000);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return (
    <>
      <HelmetSEO
        title="Canto - Lending"
        description="Canto Homepage serves De-fi applications"
        link="lending"
      />
      <Styled as={FadeIn}>
        <ModalManager
          isOpen={modalStore.currentModal != ModalType.NONE}
          position={position}
          rewards={rewards}
        />

        <LMPositionBar
          isMobile={isMobile}
          rewardBalance={
            !rewards.accrued.isZero()
              ? truncateNumber(formatUnits(rewards.accrued))
              : "000.00"
          }
          borrowBalance={position.totalBorrow}
          borrowLimit={position.totalBorrowLimit}
          supplyBalance={position.totalSupply}
        />
        {isMobile ? (
          <SpecialTabs
            active={onLeftTab}
            onLeftTabClick={() => {
              setOnLeftTab(true);
            }}
            onRightTabClick={() => {
              setOnLeftTab(false);
            }}
          />
        ) : null}

        <div>
          <div
            className="tables"
            style={{
              marginTop: "60px",
            }}
          >
            <SupplyTable
              visible={!isMobile || onLeftTab}
              supplying={true}
              userLMTokens={userLMTokens.filter(
                (token) => token.inSupplyMarket
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

            <BorrowingTable
              visible={!isMobile || !onLeftTab}
              borrowing={true}
              userLMTokens={userLMTokens.filter(
                (token) => token.inBorrowMarket
              )}
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
              marginTop: "60px",
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
                      const amount =
                        Number(msg.amount) > 0
                          ? `${Number(msg.amount).toFixed(2)} ${msg.name}`
                          : msg.name;
                      const actionMsg = transactionStatusActions(
                        msg.type,
                        amount
                      ).inAction;
                      return (
                        <TransactionRow
                          key={msg.name + msg.type}
                          icon={msg.icon}
                          name={msg.name.toLowerCase()}
                          status={actionMsg}
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
              marginBottom: "2rem",
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
                  (token) => !token.inBorrowMarket && !token.borrowCap.eq(1)
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
    </>
  );
};

export default LendingMarket;
