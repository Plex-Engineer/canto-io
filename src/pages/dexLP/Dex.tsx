import Table from "./components/table";
import Row, { TransactionRow } from "./components/row";
import { useState } from "react";
import { Notification, useNotifications } from "@usedapp/core";
import useModals, { ModalType } from "./hooks/useModals";
import { ModalManager } from "./modals/ModalManager";
import { ethers } from "ethers";
import { useNetworkInfo } from "global/stores/networkInfo";
import { truncateNumber } from "global/utils/formattingNumbers";
import useLPTokenData from "./hooks/useLPTokenData";
import useUserLPTokenInfo from "./hooks/useUserLPTokenData";
import { LPPairInfo, UserLPPairInfo } from "./config/interfaces";
import { formatUnits } from "ethers/lib/utils";
import FadeIn from "react-fade-in";
import { Text } from "global/packages/src";
import HelmetSEO from "global/components/seo";
import { sortColumnsByType } from "pages/lending/components/LMTables";
import { Mixpanel } from "mixpanel";
import { useOngoingTransactions } from "global/utils/handleOnGoingTransactions";
import Loading from "global/components/Loading";
import styled from "@emotion/styled";
import { noteSymbol } from "global/config/tokenInfo";
import { useTransactionStore } from "global/stores/transactionStore";
import { getShortTxStatusFromState } from "global/utils/formatTxDetails";

const LP_Interface = () => {
  const networkInfo = useNetworkInfo();
  const txStore = useTransactionStore();
  const { notifications } = useNotifications();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  useOngoingTransactions(notifications, notifs, setNotifs);

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

  const [currentPoolsColumnClicked, setCurrentPoolsColumnClicked] = useState(0);
  const [availablePoolsColumnClicked, setAvailablePoolsColumnCLicked] =
    useState(0);

  const isPositionedToken =
    userPairs?.filter(
      (pair: UserLPPairInfo) =>
        !pair.userSupply.totalLP.isZero() || pair.userSupply.percentOwned > 0
    ).length > 0;

  const isRegularToken =
    userPairs?.filter(
      (pair: UserLPPairInfo) =>
        pair.userSupply.totalLP.isZero() && pair.userSupply.percentOwned == 0
    ).length > 0;

  const ongoingTransactions = useTransactionStore().transactions.filter(
    (filterItem) => filterItem.details.status === "Mining"
  );
  return (
    <>
      <HelmetSEO
        title="Canto - LP interface"
        description="Canto Homepage serves De-fi applications"
        link="lp"
      />
      <Styled as={FadeIn}>
        <div>
          <ModalManager
            chainId={Number(networkInfo.chainId)}
            account={networkInfo.account}
            onClose={() => {
              setModalType(ModalType.NONE);
            }}
            txStore={txStore}
          />
        </div>
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
        {ongoingTransactions.length > 0 && (
          <div className="tables">
            <div className="left">
              <Table columns={["ongoing transactions"]}>
                {ongoingTransactions.map((tx) => (
                  <TransactionRow
                    key={tx.details.txId}
                    icons={tx.details.extra?.icon ?? ""}
                    name={tx.details.currentMessage ?? ""}
                    status={getShortTxStatusFromState(tx.details.status)}
                    date={new Date()}
                  />
                ))}
              </Table>
            </div>
          </div>
        )}

        {isPositionedToken && (
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
        )}

        {isRegularToken ? (
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
                      totalValueLocked={ethers.utils.commify(
                        truncateNumber(formatUnits(pair.totalSupply.tvl))
                      )}
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
        ) : (
          <div
            style={{
              height: "30rem",
            }}
          >
            <Loading />
          </div>
        )}
      </Styled>
    </>
  );
};

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  .tableName {
    width: 1200px;
    margin: 0 auto;
    padding: 0;
  }

  @media (max-width: 1000px) {
    .tableName {
      width: 100%;
      padding: 0 2rem;
    }
  }
`;

export default LP_Interface;
