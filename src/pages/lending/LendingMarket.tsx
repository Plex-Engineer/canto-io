import styled from "styled-components";
import { useNotifications } from "@usedapp/core";
import { useState, useEffect } from "react";
import LendingTable from "./components/lendingTable";
import { useSetToken } from "./providers/activeTokenContext";
import {
  SupplyRow,
  SupplyingRow,
  BorrowingRow,
  BorrowedRow,
  TransactionRow,
} from "./components/lendingRow";

import { ModalType, ModalManager } from "./components/modals/modalManager";
import { formatBalance, noteSymbol } from "global/utils/utils";
import { useTokens } from "./hooks/useTokens";
import { Mixpanel } from "mixpanel";
import { toast } from "react-toastify";
import CypherText from "./components/CypherText";
import { Details } from "./hooks/useTransaction";
import Popup from "reactjs-popup";
import { CantoMainnet, CantoTestnet, CTOKEN } from "cantoui";
import { useNetworkInfo } from "global/stores/networkInfo";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  color: #fff;
  margin: 2rem 1rem; //TODO: make this dynamic
  .typing {
    color: var(--primary-color);
    margin: 2rem 4rem;
    font-weight: 300;
    letter-spacing: -0.13em;
    height: 400px;

    & span {
      transition-property: all 0.1s ease-in-out;
    }
    margin: 2rem -1rem -4rem -1rem;

    @media (max-width: 1000px) {
      margin: 0;
    }
  }

  .balance {
    font-weight: 300;
    font-size: 56px;
    color: var(--primary-color);
    text-shadow: 0px 14px 14px rgba(6, 252, 153, 0.2);
    & span {
      color: var(--primary-color);
    }
  }

  .flex-h {
    display: sticky;
    margin: 0;
    right: 0;
    button {
      margin: 0;
      width: 15rem;
    }
  }

  .Typewriter {
    color: var(--primary-color);
    margin: 2rem 4rem;
    font-weight: 300;
    letter-spacing: -0.13em;
    text-shadow: 0px 4px 4px rgba(6, 252, 153, 0.4);
    font-size: 27px;
    height: 340px;
  }

  /* .fit {
    object-fit: contain;
    height: 500px;
  } */
  .tables {
    display: flex;
    width: 100%;
    & > div {
      width: 50%;
      & > p {
        color: var(--primary-color);
        padding: 4px;
      }
    }
  }
  @media (max-width: 1000px) {
    margin: 0 1rem;
    .balance {
      font-size: 30px;
    }
    .tables {
      flex-direction: column;
      div {
        width: 100%;
      }
      table {
        width: 500px;
      }
    }
  }
`;
const Hero = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  /* min-height: 20rem; */
  margin-top: 5rem;
  margin-bottom: 0rem;
  div {
    width: 50%;
  }

  p {
    font-weight: 400;
    font-size: 16px;
    color: var(--primary-color);
  }
  @media (max-width: 1000px) {
    flex-direction: column;
    margin: 0;
    justify-content: center;
    align-items: flex-start;
    gap: 0.3rem;
    div {
      text-align: left !important;
    }
    .balance {
      font-size: 48px;
    }
  }
`;

export const Button = styled.button`
  font-weight: 300;
  font-size: 18px;
  background-color: black;
  color: var(--primary-color);
  padding: 0.2rem 2rem;
  border: 1px solid var(--primary-color);
  justify-content: center;
  /* margin: 0 -4rem auto auto; */
  width: 14rem;
  display: flex;
  &:hover {
    background-color: var(--primary-color-dark);
    color: black;
    cursor: pointer;
  }
`;

const TinyTable = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  margin: 2rem 0;
  /* justify-content: start; */
  align-items: flex-start;
  .tables {
    display: flex;
    z-index: 700;
  }
  .table {
    width: 15rem;
    border: 1px solid var(--primary-color);
    text-align: center;
  }
  .bar {
    /* width: 30rem; */
    width: 100%;
    display: flex;
  }
  .green {
    border: 2px solid var(--primary-color);
    background-color: #6fff8773;
    height: 10px;
    width: 0%;
  }

  .red {
    border: 2px solid var(--error-color);
    border-left: 0px;
    background-color: #ff6f6f73;
    height: 10px;
  }

  .gray {
    border: 2px solid #7b7b7b73;
    border-left: 0px;
    background-color: #1616169b;
    height: 10px;
    /* width: 66%; */
  }
  p {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  h1 {
    font-weight: 400;
    font-size: 18px;
    padding: 0.3rem;
    background-color: #49ffb611;
    border-bottom: 1px solid var(--primary-color);
    color: var(--primary-color);
  }

  /* .alt {
    text-shadow: 0 0 4px #ff2c2c, 0 0 20px var(--error-color) !important;

    h1 {
      border-bottom: 1px solid var(--error-color);
      background-color: #ff494911;
      color: var(--error-color);
    }
    border: 1px solid var(--error-color) !important;

   
  } */
`;

const LendingMarket = () => {
  //this is used to check and set the lending modal is open or not
  const [isOpen, setIsOpen] = useState(false);
  //this is used to set the kind of modal to be opened
  const [modalType, setModalType] = useState<ModalType>(ModalType.LENDING);
  //intialize network store
  const networkInfo = useNetworkInfo();

  const [supplyBalance, setSupplyBalance] = useState("00.00");
  const [borrowBalance, setborrowBalance] = useState("00.00");
  const { notifications } = useNotifications();
  const [notifs, setNotifs] = useState<any[]>([]);


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
  }, [notifications]);

  //this is used to generate some statistics about the token from the getMarkets
  Mixpanel.events.pageOpened("Lending Market", networkInfo.account);
  //this is used to set the active token for the context
  const setToken = useSetToken();

  const allData = useTokens(networkInfo.account, Number(networkInfo.chainId));
  let tokens: CTOKEN[] = allData?.[0];
  let stats = allData?.[1];
  const walletBalance = stats?.balance;

  function openModalLending() {
    setModalType(ModalType.LENDING);
    setIsOpen(true);
  }

  function openBalance() {
    setModalType(ModalType.BALANCE);
    setIsOpen(true);
  }

  function openModalBorrow() {
    setModalType(ModalType.BORROW);
    setIsOpen(true);
  }
  const borrowPercentage = stats?.totalBorrowLimitUsed
    ? (stats?.totalBorrowLimitUsed / stats?.totalBorrowLimit) * 100
    : 0;


  function SupplyingTable() {
    //this should prevent the table from showing up if there are not items to be displayed
    if (tokens?.filter((token: any) => token.inSupplyMarket).length == 0)
      return null;

    return (
      <div className="left">
        <p>supplying</p>

        <LendingTable
          columns={["asset", "apr", "balance", "collateral"]}
          isLending
        >
          {tokens ? (
            tokens
              .map((token: any) =>
                token.inSupplyMarket ? (
                  <SupplyingRow
                    collaterable={Number(token.collateralFactor) > 0}
                    key={token.data.address + "supplying"}
                    onClick={() => {
                      setToken({ token, stats });

                      openModalLending();
                    }}
                    assetIcon={token.data.underlying.icon}
                    assetName={token.data.underlying.symbol}
                    apy={token.supplyAPY.toFixed(2)}
                    distAPY={token.distAPY.toFixed(2)}
                    wallet={Number(formatBalance(token.supplyBalance))}
                    balance={formatBalance(Number(token.supplyBalanceinNote))}
                    symbol={token.data.underlying.symbol}
                    collateral={token.collateral}
                    onToggle={(state) => {
                      setToken({ token, stats });
                    }}
                  />
                ) : null
              )
              .sort((a: any, b: any) => {
                return String(a?.props.symbol).localeCompare(b?.props.symbol);
              })
          ) : (
            <tr>
              <td>loading</td>
            </tr>
          )}
        </LendingTable>
      </div>
    );
  }

  function BorrowingTable() {
    //this should prevent the table from showing up if there are not items to be displayed
    if (tokens?.filter((token: any) => token.inBorrowMarket).length == 0)
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
              .map((token: any) =>
                token.inBorrowMarket ? (
                  <BorrowedRow
                    key={token.data.address + "borrowed"}
                    onClick={() => {
                      setToken({ token, stats });

                      openModalBorrow();
                    }}
                    assetIcon={token.data.underlying.icon}
                    assetName={token.data.underlying.symbol}
                    apy={token.borrowAPY.toFixed(2)}
                    balance={formatBalance(token.borrowBalanceinNote)}
                    symbol={token.data.underlying.symbol}
                    wallet={Number(formatBalance(token.borrowBalance))}
                    liquidity={
                      (token.borrowBalanceinNote / stats?.totalBorrowLimit) *
                      100
                    }
                    onToggle={() => {
                      setToken({ token, stats });
                    }}
                  />
                ) : null
              )
              .sort((a: any, b: any) => {
                return String(a?.props.symbol).localeCompare(b?.props.symbol);
              })
          ) : (
            <tr>
              <td>loading</td>
            </tr>
          )}
        </LendingTable>
      </div>
    );
  }

  const ToolTip = styled.div`
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
              .map((token: any) =>
                !token.inSupplyMarket ? (
                  <SupplyRow
                    collaterable={token.collateralFactor > 0}
                    onClick={() => {
                      setToken({ token: token, stats: stats });
                      openModalLending();
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
                      setToken({ token, stats });
                    }}
                  />
                ) : null
              )
              .sort((a: any, b: any) => {
                return String(a?.props.symbol).localeCompare(b?.props.symbol);
              })
          ) : (
            <tr>
              <td>loading</td>
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
              .map((token: any) =>
                !token.inBorrowMarket && !token.data.underlying.isLP ? (
                  <BorrowingRow
                    onClick={() => {
                      setToken({ token, stats });
                      openModalBorrow();
                    }}
                    key={token.data.address + "borrowing"}
                    assetIcon={token.data.underlying.icon}
                    assetName={token.data.underlying.symbol}
                    apy={token.borrowAPY.toFixed(2)}
                    wallet={Number(formatBalance(token.balanceOf))}
                    symbol={token.data.underlying.symbol}
                    liquidity={Number(token.liquidity)}
                    onToggle={() => {
                      setToken({ token, stats });
                    }}
                  />
                ) : null
              )
              .sort((a: any, b: any) => {
                return String(a?.props.symbol).localeCompare(b?.props.symbol);
              })
          ) : (
            <tr>
              <td>loading</td>
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
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  let isMobile = dimensions.width < 1000;

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }
    isMobile = dimensions.width < 1000;

    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setborrowBalance(stats?.totalBorrow.toFixed(2) ?? "000.00");
    setSupplyBalance(stats?.totalSupply.toFixed(2) ?? "000.00");
    // console.log(stats?.totalBorrow.toFixed(6))
  }, [tokens]);

  return (
    <Container className="lendingMarket">
      <ModalManager
        isOpen={isOpen}
        modalType={modalType}
        onClose={() => {
          setIsOpen(false);
        }}
        data={walletBalance}
      />
      <div style={{display: 'flex', justifyContent: "flex-end"}}>
        {((Number(networkInfo.chainId) == CantoMainnet.chainId) || (Number(networkInfo.chainId) == CantoTestnet.chainId)) ? (
          <Button
            onClick={() => {
              if (networkInfo.account) {
                openBalance();
              }
            }}
            style={{width: "15rem", alignSelf: "right"}}
          >
            claim LM rewards 
          </Button>
        ) : null}
      </div>
      <div style={{textAlign: "right"}}>
          {stats?.balance?.accrued ? (Number(stats.balance.accrued)).toFixed(2) + " WCANTO " : ""}
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
            <p style={{width: "100%", textAlign: 'right'}}>{noteSymbol + stats?.totalBorrowLimit.toFixed(2)}</p>
          </TinyTable>
        }
        position="top center"
        on={["hover", "focus"]}
        arrow={true}
      >
        <ToolTip>
          {borrowPercentage < 80 ? (
            <p>
              you will be liquidated if you go above your borrow limit <br></br>
              Liquidity Cushion:{" "}
              {noteSymbol +
                (stats?.totalBorrowLimit - stats?.totalBorrow).toFixed(2)}
            </p>
          ) : (
            <p>
              you will be liquidated soon<br></br> Liquidity Cushion:{" "}
              {noteSymbol +
                (stats?.totalBorrowLimit - stats?.totalBorrow).toFixed(2)}
            </p>
          )}
        </ToolTip>
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
)};

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
  const [showSupply, setShowSupply] = useState(true);

  return (
    <TabBar>
      <Tab>supply</Tab>
      <Tab>borrow</Tab>
    </TabBar>
  );
};
export default LendingMarket;
