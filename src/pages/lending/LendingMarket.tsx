/* eslint-disable @typescript-eslint/ban-ts-comment */
import styled from "styled-components";
import { useNotifications, Notification } from "@usedapp/core";
import { useState, useEffect } from "react";
import LendingTable from "./components/lendingTable";
import ReactTooltip from "react-tooltip";
import {
  SupplyRow,
  BorrowingRow,
  TransactionRow,
} from "./components/lendingRow";

import { ModalType, ModalManager } from "./components/modals/modalManager";
import { toast } from "react-toastify";
import CypherText from "./components/CypherText";
import { Details } from "./hooks/useTransaction";
import Popup from "reactjs-popup";
import { Container, Button, Hero, TinyTable } from "./components/Container";
import { useNetworkInfo } from "global/stores/networkInfo";
import { Mixpanel } from "mixpanel";
import { noteSymbol, truncateNumber } from "global/utils/utils";
import useModalStore from "./stores/useModals";
import { useLMTokenData } from "./hooks/useLMTokenData";
import { LMTokenDetails } from "./config/interfaces";
import { useUserLMTokenData } from "./hooks/useUserLMTokenData";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { BorrowingTable, SupplyingTable } from "./components/LMTables";

const LendingMarket = () => {
  //intialize network store
  const networkInfo = useNetworkInfo();

  const [supplyBalance, setSupplyBalance] = useState(BigNumber.from(0));
  const [borrowBalance, setborrowBalance] = useState(BigNumber.from(0));
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

  const lmTokenData: LMTokenDetails[] = useLMTokenData(networkInfo.chainId);
  const { userLMTokens, position } = useUserLMTokenData(
    lmTokenData,
    networkInfo.account,
    networkInfo.chainId
  );

  //Useffect for calling data per block
  useEffect(() => {
    const interval = setInterval(() => {
      setborrowBalance(position.totalBorrow);
      setSupplyBalance(position.totalSupply);
      modalStore.setRewards(position.rewards);
      modalStore.setStats(position);
      ReactTooltip.rebuild();
    }, 6000);
    return () => clearInterval(interval);
  }, [position]);

  const borrowPercentage = !position.totalBorrowLimit.isZero()
    ? position.totalBorrow.mul(100).div(position.totalBorrowLimit)
    : BigNumber.from(0);

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
          {userLMTokens
            .map((token) =>
              !token.inSupplyMarket ? (
                <SupplyRow
                  collaterable={!token.collateralFactor.isZero()}
                  onClick={() => {
                    modalStore.setActiveToken(token);
                    modalStore.open(ModalType.LENDING);
                  }}
                  key={token.data.address + "supply"}
                  assetIcon={token.data.underlying.icon}
                  assetName={token.data.underlying.symbol}
                  apy={token.supplyAPY.toFixed(2)}
                  distAPY={token.distAPY.toFixed(2)}
                  wallet={truncateNumber(
                    formatUnits(token.balanceOf, token.data.underlying.decimals)
                  )}
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
            })}
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
          {userLMTokens
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
                  wallet={truncateNumber(
                    formatUnits(token.balanceOf, token.data.underlying.decimals)
                  )}
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
            })}
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
        {!position.rewards.accrued.isZero()
          ? truncateNumber(formatUnits(position.rewards.accrued)) + " WCANTO "
          : ""}
      </div>

      <Hero>
        <div>
          <p>supply balance</p>
          {/* <h1 className="balance">{noteSymbol}{stats?.totalSupply.toFixed(2)??"000.00000"}</h1> */}
          <h1 className="balance">
            {noteSymbol}
            <CypherText
              text={
                supplyBalance.isZero()
                  ? "000.00"
                  : truncateNumber(formatUnits(supplyBalance, 18))
              }
            />
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
            <CypherText
              text={
                borrowBalance.isZero()
                  ? "000.00"
                  : truncateNumber(formatUnits(borrowBalance, 18))
              }
            />
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
              {borrowPercentage.lte(80) ? (
                <div
                  className="green"
                  style={{ width: borrowPercentage.toNumber() + "%" }}
                ></div>
              ) : (
                <div
                  className="red"
                  style={{ width: borrowPercentage.toNumber() + "%" }}
                ></div>
              )}
              <div
                className="gray"
                style={{
                  width: 100 - borrowPercentage.toNumber() + "%",
                }}
              ></div>
            </div>
            <p style={{ width: "100%", textAlign: "right" }}>
              {noteSymbol + formatUnits(position.totalBorrowLimit)}
            </p>
          </TinyTable>
        }
        position="top center"
        on={["hover", "focus"]}
        arrow={true}
      >
        <ToolTipL>
          {borrowPercentage.lt(80) ? (
            <p>
              you will be liquidated if you go above your borrow limit <br></br>
              Liquidity Cushion:{" "}
              {noteSymbol +
                truncateNumber(
                  formatUnits(
                    position.totalBorrowLimit.sub(position.totalBorrow)
                  )
                )}
            </p>
          ) : (
            <p>
              you will be liquidated soon<br></br> Liquidity Cushion:{" "}
              {noteSymbol +
                truncateNumber(
                  formatUnits(
                    position.totalBorrowLimit.sub(position.totalBorrow)
                  )
                )}
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
          <SupplyingTable
            userLMTokens={userLMTokens}
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
            userLMTokens={userLMTokens}
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
