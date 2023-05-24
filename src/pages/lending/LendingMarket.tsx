import { useNotifications, Notification } from "@usedapp/core";
import { useEffect, useState } from "react";
import LendingTable from "./components/table";
import { TransactionRow } from "./components/lendingRow";
import { ModalType, ModalManager } from "./modals/modalManager";
import { Styled } from "./components/Styled";
import { useNetworkInfo } from "global/stores/networkInfo";
import { truncateNumber } from "global/utils/formattingNumbers";
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
import { getShortTxStatusFromState } from "global/utils/formatTxDetails";
import { useTransactionStore } from "global/stores/transactionStoreWithRetry";

const LendingMarket = () => {
  const networkInfo = useNetworkInfo();
  const txStore = useTransactionStore();
  const { notifications } = useNotifications();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  useOngoingTransactions(notifications, notifs, setNotifs);
  const modalStore = useModalStore();
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 1000);

  const lmTokenData: LMTokenDetails[] = useLMTokenData(
    Number(networkInfo.chainId)
  );
  const { userLMTokens, position, rewards } = useUserLMTokenData(
    lmTokenData,
    networkInfo.account,
    Number(networkInfo.chainId)
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

  const ongoingTransactions = useTransactionStore().transactions.filter(
    (filterItem) => filterItem.details.status === "Mining"
  );

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
          chainId={Number(networkInfo.chainId)}
          txStore={txStore}
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
          openClaim={() => modalStore.open(ModalType.BALANCE)}
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

        <div className="tables-container">
          <div className="tables">
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
          {ongoingTransactions.length > 0 && (
            <div className="tables">
              <div className="left">
                <LendingTable columns={["ongoing transactions"]} isLending>
                  {ongoingTransactions.map((tx) => (
                    <TransactionRow
                      key={tx.details.txId}
                      icon={tx.details.extra?.icon ?? ""}
                      name={tx.details.currentMessage ?? ""}
                      status={getShortTxStatusFromState(tx.details.status)}
                      date={new Date()}
                    />
                  ))}
                </LendingTable>
              </div>
            </div>
          )}

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
