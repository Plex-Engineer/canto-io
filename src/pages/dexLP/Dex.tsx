import Table from "./components/table";
import Row, { TransactionRow } from "./components/row";
import { useEffect, useState } from "react";
import { Notification, useNotifications } from "@usedapp/core";
import useModals, { ModalType } from "./hooks/useModals";
import { ModalManager } from "./modals/ModalManager";
import { ethers } from "ethers";
import { useNetworkInfo } from "global/stores/networkInfo";
import {
  noteSymbol,
  transactionStatusActions,
  truncateNumber,
} from "global/utils/utils";
import useLPTokenData from "./hooks/useLPTokenData";
import useUserLPTokenInfo from "./hooks/useUserLPTokenData";
import { LPPairInfo, UserLPPairInfo } from "./config/interfaces";
import { formatUnits } from "ethers/lib/utils";
import { DexContainer } from "./components/Styled";
import FadeIn from "react-fade-in";
import { Text } from "global/packages/src";
import { Details } from "pages/lending/hooks/useTransaction";
import HelmetSEO from "global/components/seo";
import { sortColumnsByType } from "pages/lending/components/LMTables";
import { Mixpanel } from "mixpanel";
import { toastHandler } from "global/utils/toastHandler";

type NotificationShow = Notification & { show: boolean };

const Dex = () => {
  //get network info from store
  const networkInfo = useNetworkInfo();

  const { notifications } = useNotifications();
  const [notifs, setNotifs] = useState<NotificationShow[]>([]);

  const [setModalType, setActivePair] = useModals((state) => [
    state.setModalType,
    state.setActivePair,
  ]);
  const pairs: LPPairInfo[] = useLPTokenData(Number(networkInfo.chainId));
  const userPairs: UserLPPairInfo[] = useUserLPTokenInfo(
    pairs,
    networkInfo.account,
    Number(networkInfo.chainId)
  );
  useEffect(() => {
    let currentNotifs = notifs;
    for (const notification of notifications) {
      if (
        notification.type == "transactionStarted" &&
        !currentNotifs.find((it) => it.id == notification.id)
      ) {
        currentNotifs.push({ ...notification, show: true });
      } else if (
        notification.type == "transactionSucceed" ||
        notification.type == "transactionFailed"
      ) {
        currentNotifs = currentNotifs.map((localItem) => {
          if (
            localItem.type == "transactionStarted" &&
            localItem.transaction.hash == notification.transaction.hash
          ) {
            return { ...localItem, show: false };
          }
          return localItem;
        });
      }
      setNotifs(currentNotifs);
    }

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
        const actionMsg = transactionStatusActions(msg.type).postAction;
        const msged = `${isSuccesful ? "" : "un"}successfully ${actionMsg}`;
        toastHandler(msged, isSuccesful, noti.id);
      }
    });
  }, [notifications]);

  const [currentPoolsColumnClicked, setCurrentPoolsColumnClicked] = useState(0);
  const [availablePoolsColumnClicked, setAvailablePoolsColumnCLicked] =
    useState(0);
  return (
    <>
      <HelmetSEO
        title="Canto - LP interface"
        description="Canto Homepage serves De-fi applications"
        link="lp"
      />
      <DexContainer as={FadeIn}>
        <div>
          <ModalManager
            chainId={Number(networkInfo.chainId)}
            account={networkInfo.account}
            onClose={() => {
              setModalType(ModalType.NONE);
            }}
          />
        </div>
        {/* Title widget the margin of 2rem */}
        <div
          style={{
            margin: "2rem 0",
          }}
        >
          <Text type="title" color="white">
            to swap tokens, visit{" "}
            <a
              onClick={() =>
                Mixpanel.events.lpInterfaceActions.visitSlingshot()
              }
              style={{
                color: "#a2fca3",
                textDecoration: "underline",
                fontFamily: "Silkscreen",
              }}
              href="https://app.slingshot.finance/trade/"
              target="_blank"
              rel="noreferrer"
            >
              Slingshot
            </a>
          </Text>
        </div>

        {/* Transactions table will be shown here */}
        {notifs.filter(
          (filterItem) =>
            filterItem.type == "transactionStarted" && filterItem.show
        ).length > 0 ? (
          <div>
            <p className="tableName">ongoing transaction</p>
            <Table columns={["name", "transaction", "time"]}>
              {notifs.map((item) => {
                if (
                  //@ts-ignore
                  item?.transactionName?.includes("type") &&
                  item.type == "transactionStarted" &&
                  item.show
                ) {
                  //@ts-ignore
                  const msg: Details = JSON.parse(item?.transactionName);
                  const actionMsg = transactionStatusActions(msg.type).inAction;
                  return (
                    <TransactionRow
                      key={item.submittedAt}
                      icons={msg.icon}
                      name={msg.name.toLowerCase()}
                      status={actionMsg}
                      date={new Date(item.submittedAt)}
                    />
                  );
                }
                return null;
              })}
            </Table>
          </div>
        ) : null}
        {userPairs?.filter(
          (pair: UserLPPairInfo) =>
            !pair.userSupply.totalLP.isZero() ||
            pair.userSupply.percentOwned > 0
        ).length ? (
          <div>
            <Text type="title" align="left" className="tableName">
              current position
            </Text>
            <FadeIn>
              <Table
                columns={["Asset", "TVL", "wallet", "% Share"]}
                onColumnClicked={(column) =>
                  setCurrentPoolsColumnClicked(column)
                }
                columnClicked={currentPoolsColumnClicked}
              >
                {userPairs
                  ?.map((pair: UserLPPairInfo, idx) => {
                    return !pair.userSupply.totalLP.isZero() ||
                      pair.userSupply.percentOwned > 0 ? (
                      <Row
                        delay={0.2 * idx}
                        key={pair.basePairInfo.address}
                        iconLeft={pair.basePairInfo.token1.icon}
                        iconRight={pair.basePairInfo.token2.icon}
                        onClick={() => {
                          setActivePair(pair);
                          setModalType(
                            !pair.userSupply.totalLP.isZero()
                              ? ModalType.ADD_OR_REMOVE
                              : ModalType.ADD
                          );
                        }}
                        assetName={
                          pair.basePairInfo.token1.symbol +
                          "/" +
                          pair.basePairInfo.token2.symbol
                        }
                        totalValueLocked={
                          noteSymbol +
                          ethers.utils.commify(
                            truncateNumber(formatUnits(pair.totalSupply.tvl))
                          )
                        }
                        apr={"23.2"}
                        position={
                          truncateNumber(
                            formatUnits(
                              pair.userSupply.totalLP,
                              pair.basePairInfo.decimals
                            )
                          ) + " LP Tokens"
                        }
                        share={truncateNumber(
                          (pair.userSupply.percentOwned * 100).toString()
                        )}
                        sortableProps={[
                          pair.basePairInfo.token1.symbol +
                            "/" +
                            pair.basePairInfo.token2.symbol,
                          Number(formatUnits(pair.totalSupply.tvl)),
                          Number(
                            formatUnits(
                              pair.userSupply.totalLP,
                              pair.basePairInfo.decimals
                            )
                          ),
                          pair.userSupply.percentOwned,
                        ]}
                      />
                    ) : null;
                  })
                  .sort((a, b) => {
                    return sortColumnsByType(
                      a?.props.sortableProps?.[currentPoolsColumnClicked],
                      b?.props.sortableProps?.[currentPoolsColumnClicked]
                    );
                  })}
              </Table>
            </FadeIn>
          </div>
        ) : null}
        {userPairs?.filter(
          (pair: UserLPPairInfo) =>
            pair.userSupply.totalLP.isZero() &&
            pair.userSupply.percentOwned == 0
        ).length ? (
          <div>
            <Text type="title" align="left" className="tableName">
              pools
            </Text>
            <Table
              columns={["Asset", "TVL", "wallet", "% Share"]}
              onColumnClicked={(column) =>
                setAvailablePoolsColumnCLicked(column)
              }
              columnClicked={availablePoolsColumnClicked}
            >
              {userPairs
                ?.map((pair: UserLPPairInfo, idx) => {
                  return !(
                    pair.userSupply.totalLP.isZero() &&
                    pair.userSupply.percentOwned == 0
                  ) ? null : (
                    <Row
                      delay={0.1 * idx}
                      key={pair.basePairInfo.address}
                      iconLeft={pair.basePairInfo.token1.icon}
                      iconRight={pair.basePairInfo.token2.icon}
                      onClick={() => {
                        setActivePair(pair);
                        setModalType(
                          Number(pair.userSupply.totalLP) > 0
                            ? ModalType.ADD_OR_REMOVE
                            : ModalType.ADD
                        );
                      }}
                      assetName={
                        pair.basePairInfo.token1.symbol +
                        "/" +
                        pair.basePairInfo.token2.symbol
                      }
                      totalValueLocked={
                        noteSymbol +
                        ethers.utils.commify(
                          truncateNumber(formatUnits(pair.totalSupply.tvl))
                        )
                      }
                      apr={"23.2"}
                      position={
                        truncateNumber(formatUnits(pair.userSupply.totalLP)) +
                        " LP Tokens"
                      }
                      share={truncateNumber(
                        (pair.userSupply.percentOwned * 100).toString()
                      )}
                      sortableProps={[
                        pair.basePairInfo.token1.symbol +
                          "/" +
                          pair.basePairInfo.token2.symbol,
                        Number(formatUnits(pair.totalSupply.tvl)),
                        Number(
                          formatUnits(
                            pair.userSupply.totalLP,
                            pair.basePairInfo.decimals
                          )
                        ),
                        pair.userSupply.percentOwned,
                      ]}
                    />
                  );
                })
                .sort((a, b) => {
                  return sortColumnsByType(
                    a?.props.sortableProps?.[availablePoolsColumnClicked],
                    b?.props.sortableProps?.[availablePoolsColumnClicked]
                  );
                })}
            </Table>
          </div>
        ) : null}
      </DexContainer>
    </>
  );
};
export default Dex;
