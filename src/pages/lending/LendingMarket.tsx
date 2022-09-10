/* eslint-disable @typescript-eslint/ban-ts-comment */
import styled from "styled-components";
import { useNotifications, Notification } from "@usedapp/core";
import { useState, useEffect } from "react";
import LendingTable from "./components/lendingTable";
import ReactTooltip from "react-tooltip";
import {
  SupplyRow,
  SupplyingRow,
  BorrowingRow,
  BorrowedRow,
  TransactionRow,
  LoadingRow,
} from "./components/lendingRow";

import { ModalType, ModalManager } from "./components/modals/modalManager";
import { useTokens } from "./hooks/useTokens";
import { toast } from "react-toastify";
import CypherText from "./components/CypherText";
import { Details } from "./hooks/useTransaction";
import Popup from "reactjs-popup";
import { Container, Button, Hero, TinyTable } from "./components/Container";
import { useNetworkInfo } from "global/stores/networkInfo";
import { Mixpanel } from "mixpanel";
import { formatBalance, noteSymbol } from "global/utils/utils";
import { CantoMainnet } from "cantoui";
import useModalStore from "./stores/useModals";
import { useLMTokenData } from "./hooks/useLMTokenData";
import { LMTokenDetails1, UserLMTokenDetails } from "./config/interfaces";
import { useUserLMTokenData } from "./hooks/useUserLMTokenData";
import { BigNumber } from "ethers";

const LendingMarket = () => {
  //intialize network store
  const networkInfo = useNetworkInfo();

  const [supplyBalance, setSupplyBalance] = useState("00.00");
  const [borrowBalance, setborrowBalance] = useState("00.00");
  const { notifications } = useNotifications();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const modalStore = useModalStore();

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

  const allData = useTokens(networkInfo.account, Number(networkInfo.chainId));
  const tokens = allData?.LMTokens;
  const stats = allData?.balances;

  const newData: LMTokenDetails1[] = useLMTokenData(networkInfo.chainId);
  const { userLMTokens, position } = useUserLMTokenData(
    newData,
    networkInfo.account,
    networkInfo.chainId
  );
  console.log(userLMTokens, position);
  useEffect(() => {
    setborrowBalance(stats?.totalBorrow?.toFixed(2) ?? "000.00");
    setSupplyBalance(stats?.totalSupply?.toFixed(2) ?? "000.00");
    modalStore.setBalance(allData?.balances.balance);
    modalStore.setStats(allData?.balances);
    ReactTooltip.rebuild();
  }, [stats?.totalBorrow, stats?.totalSupply, tokens?.length]);

  const borrowPercentage = stats?.totalBorrowLimitUsed
    ? (stats?.totalBorrowLimitUsed / (stats?.totalBorrowLimit ?? 0)) * 100
    : 0;

  function SupplyingTable() {
    //this should prevent the table from showing up if there are not items to be displayed
    if (tokens?.filter((token) => token.inSupplyMarket).length == 0)
      return null;

    return (
      <div className="left">
        <p>supplying</p>

        <LendingTable
          columns={["asset", "apr", "rewards", "balance", "collateral"]}
          isLending
        >
          {tokens ? (
            tokens
              .map((token) =>
                token.inSupplyMarket ? (
                  <SupplyingRow
                    collaterable={Number(token.collateralFactor) > 0}
                    key={token.data.address + "supplying"}
                    onClick={() => {
                      modalStore.setActiveToken(token);
                      modalStore.open(ModalType.LENDING);
                    }}
                    assetIcon={token.data.underlying.icon}
                    assetName={token.data.underlying.symbol}
                    apy={token.supplyAPY.toFixed(2)}
                    distAPY={token.distAPY.toFixed(2)}
                    wallet={formatBalance(token.supplyBalance)}
                    balance={formatBalance(Number(token.supplyBalanceinNote))}
                    symbol={token.data.underlying.symbol}
                    collateral={token.collateral}
                    rewards={token.rewards}
                    onToggle={() => {
                      modalStore.setActiveToken(token);
                      token.collateral
                        ? modalStore.open(ModalType.DECOLLATERAL)
                        : modalStore.open(ModalType.COLLATERAL);
                    }}
                  />
                ) : null
              )
              .sort((a, b) => {
                return String(a?.props.symbol).localeCompare(b?.props.symbol);
              })
          ) : (
            <tr>
              <LoadingRow colSpan={5}>loading</LoadingRow>
            </tr>
          )}
        </LendingTable>
      </div>
    );
  }

  function BorrowingTable() {
    //this should prevent the table from showing up if there are not items to be displayed
    if (tokens?.filter((token) => token.inBorrowMarket).length == 0)
      return null;

    return (
      <div className="right">
        <p
          style={{
            textAlign: "right",
          }}
        >
          borrowing
        </p>
        <LendingTable
          columns={["asset", "apr/accrued", "balance", "% of limit"]}
          isLending={false}
        >
          {tokens ? (
            tokens
              .map((token) =>
                token.inBorrowMarket ? (
                  <BorrowedRow
                    key={token.data.address + "borrowed"}
                    onClick={() => {
                      modalStore.setActiveToken(token);

                      modalStore.open(ModalType.BORROW);
                    }}
                    assetIcon={token.data.underlying.icon}
                    assetName={token.data.underlying.symbol}
                    apy={token.borrowAPY.toFixed(2)}
                    balance={formatBalance(token.borrowBalanceinNote)}
                    symbol={token.data.underlying.symbol}
                    wallet={formatBalance(token.borrowBalance)}
                    liquidity={
                      (Number(token.borrowBalanceinNote) /
                        (stats?.totalBorrowLimit ?? 0)) *
                      100
                    }
                    onToggle={() => {
                      modalStore.setActiveToken(token);
                    }}
                  />
                ) : null
              )
              .sort((a, b) => {
                return String(a?.props.symbol).localeCompare(b?.props.symbol);
              })
          ) : (
            <tr>
              <LoadingRow colSpan={4}>loading</LoadingRow>
            </tr>
          )}
        </LendingTable>
      </div>
    );
  }

  const ToolTipL = styled.div`
    border: 1px solid var(--primary-color);
    background-color: #111;
    padding: 1rem;
    width: 20rem;
    color: white;
  `;

  function SupplyTable() {
    return (
      <div className="left">
        <p>available</p>
        <LendingTable
          columns={["asset", "apr", "wallet", "collateral"]}
          isLending
        >
          {tokens ? (
            tokens
              .map((token) =>
                !token.inSupplyMarket ? (
                  <SupplyRow
                    collaterable={Number(token.collateralFactor) > 0}
                    onClick={() => {
                      modalStore.setActiveToken(token);
                      modalStore.open(ModalType.LENDING);
                      console.log(
                        "🚀 ~ file: LendingMarket.tsx ~ line 283 ~ SupplyTable ~   modalStore.open(ModalType.LENDING);"
                      );
                    }}
                    key={token.data.address + "supply"}
                    assetIcon={token.data.underlying.icon}
                    assetName={token.data.underlying.symbol}
                    apy={token.supplyAPY.toFixed(2)}
                    distAPY={token.distAPY.toFixed(2)}
                    wallet={Number(formatBalance(token.balanceOf))}
                    symbol={token.data.underlying.symbol}
                    collateral={token.collateral}
                    onToggle={() => {
                      modalStore.setActiveToken(token);
                      token.collateral
                        ? modalStore.open(ModalType.DECOLLATERAL)
                        : modalStore.open(ModalType.COLLATERAL);
                    }}
                  />
                ) : null
              )
              .sort((a, b) => {
                return String(a?.props.symbol).localeCompare(b?.props.symbol);
              })
          ) : (
            <tr>
              <LoadingRow colSpan={4}>loading</LoadingRow>
            </tr>
          )}
        </LendingTable>
      </div>
    );
  }

  function BorrowTable() {
    return (
      <div className="right">
        <p
          style={{
            textAlign: "right",
          }}
        >
          available
        </p>
        <LendingTable
          columns={["asset", "apr", "wallet", "liquidity"]}
          isLending={false}
        >
          {tokens ? (
            tokens
              .map((token) =>
                !token.inBorrowMarket && !token.data.underlying.isLP ? (
                  <BorrowingRow
                    onClick={() => {
                      modalStore.setActiveToken(token);
                      modalStore.open(ModalType.BORROW);
                    }}
                    key={token.data.address + "borrowing"}
                    assetIcon={token.data.underlying.icon}
                    assetName={token.data.underlying.symbol}
                    apy={token.borrowAPY.toFixed(2)}
                    wallet={formatBalance(token.balanceOf)}
                    symbol={token.data.underlying.symbol}
                    liquidity={Number(token.liquidity)}
                    onToggle={() => {
                      modalStore.setActiveToken(token);
                    }}
                  />
                ) : null
              )
              .sort((a, b) => {
                return String(a?.props.symbol).localeCompare(b?.props.symbol);
              })
          ) : (
            <tr>
              <LoadingRow colSpan={4}>loading</LoadingRow>
            </tr>
          )}
        </LendingTable>
      </div>
    );
  }
  // console.log(
  //   notifications.filter((notif)=>{

  //     return notif?.transactionName?.includes("Suppl")})
  // )

  //in this we first check if the user is logged in by checking the account
  //then we get the tokens from the getMarkets and set them to the state
  //and also generate stats about the token
  //and this only updates if the account changes (logs in or out)

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <Container className="lendingMarket">
      <ModalManager isOpen={modalStore.currentModal != ModalType.NONE} />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {Number(networkInfo.chainId) == CantoMainnet.chainId ? (
          <Button
            onClick={() => {
              if (networkInfo.account) {
                modalStore.open(ModalType.BALANCE);
              }
            }}
            style={{ width: "15rem", alignSelf: "right" }}
          >
            claim LM rewards
          </Button>
        ) : null}
      </div>
      <div style={{ textAlign: "right" }}>
        {stats?.balance.accrued
          ? Number(stats.balance.accrued).toFixed(2) + " WCANTO "
          : ""}
      </div>

      <Hero>
        <div>
          <p>supply balance</p>
          {/* <h1 className="balance">{noteSymbol}{stats?.totalSupply.toFixed(2)??"000.00000"}</h1> */}
          <h1 className="balance">
            {noteSymbol}
            <CypherText text={supplyBalance} />
          </h1>
        </div>

        <div
          style={{
            textAlign: "right",
          }}
        >
          <p>borrow balance</p>
          {/* <h1 className="balance">{noteSymbol}{stats?.totalBorrow.toFixed(2)??"000.00000"}</h1> */}
          <h1 className="balance">
            {noteSymbol}
            <CypherText text={borrowBalance} />
          </h1>
        </div>
      </Hero>
      {/* This table is used for cERC20Tokens */}
      <Popup
        trigger={
          <TinyTable>
            {/* <div className="tables">
              <div className="table">
                <h1>Assets</h1>
                <p>{supplyBalance}</p>
                <p>apy:23%</p>
                <p>$37</p>
              </div>
              <div className="table alt">
                <h1>Liabilities</h1>
                <p>{borrowBalance}</p>
                <p>apy:21%</p>
                <p>$23</p>
              </div>
            </div> */}
            <div>
              <p>borrow limit</p>
            </div>
            <div className="bar">
              {borrowPercentage < 80 ? (
                <div
                  className="green"
                  style={{ width: borrowPercentage + "%" }}
                ></div>
              ) : (
                <div
                  className="red"
                  style={{ width: borrowPercentage + "%" }}
                ></div>
              )}
              <div
                className="gray"
                style={{
                  width: 100 - borrowPercentage + "%",
                }}
              ></div>
            </div>
            <p style={{ width: "100%", textAlign: "right" }}>
              {noteSymbol + (stats?.totalBorrowLimit?.toFixed(2) ?? "000.00")}
            </p>
          </TinyTable>
        }
        position="top center"
        on={["hover", "focus"]}
        arrow={true}
      >
        <ToolTipL>
          {borrowPercentage < 80 ? (
            <p>
              you will be liquidated if you go above your borrow limit <br></br>
              Liquidity Cushion:{" "}
              {noteSymbol +
                (
                  (stats?.totalBorrowLimit ?? 0) - (stats?.totalBorrow ?? 0)
                ).toFixed(2)}
            </p>
          ) : (
            <p>
              you will be liquidated soon<br></br> Liquidity Cushion:{" "}
              {noteSymbol +
                (
                  (stats?.totalBorrowLimit ?? 0) - (stats?.totalBorrow ?? 0)
                ).toFixed(2)}
            </p>
          )}
        </ToolTipL>
      </Popup>

      <SpecialTabs></SpecialTabs>

      <div>
        <div
          className="tables"
          style={{
            marginBottom: "4rem",
          }}
        >
          {SupplyingTable()}

          {BorrowingTable()}
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
          {SupplyTable()}

          {BorrowTable()}
        </div>
      </div>
    </Container>
  );
};

const SpecialTabs = () => {
  const TabBar = styled.div`
    display: flex;
  `;
  const Tab = styled.div`
    width: 50%;
    text-align: center;
    background-color: #0a2d15;
    &:hover {
      background-color: #0f742f;
      cursor: pointer;
    }
  `;

  return (
    <TabBar>
      <Tab>supply</Tab>
      <Tab>borrow</Tab>
    </TabBar>
  );
};
export default LendingMarket;
