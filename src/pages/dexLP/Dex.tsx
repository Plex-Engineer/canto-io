import Table from "./components/table";
import Row, { TransactionRow } from "./components/row";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNotifications } from "@usedapp/core";
import useModals, { ModalType } from "./hooks/useModals";
import { ModalManager } from "./modals/ModalManager";
import { ethers } from "ethers";
import { useNetworkInfo } from "global/stores/networkInfo";
import { noteSymbol, truncateNumber } from "global/utils/utils";
import useLPTokenData from "./hooks/useLPTokenData";
import useUserLPTokenInfo from "./hooks/useUserLPTokenData";
import { LPPairInfo, UserLPPairInfo } from "./config/interfaces";
import { formatUnits } from "ethers/lib/utils";
import { DexContainer } from "./components/Styled";
import FadeIn from "react-fade-in";
const Dex = () => {
  // Mixpanel.events.pageOpened("Dex Market", '');

  //get network info from store
  const networkInfo = useNetworkInfo();

  const { notifications } = useNotifications();
  const [notifs, setNotifs] = useState<any[]>([]);

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
          case "add":
            msg.type = "added";
            break;
          case "remove":
            msg.type = "removed";
            break;
          case "Enable":
            msg.type = "enabled";
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

  return (
    <DexContainer as={FadeIn}>
      <div style={{ marginBottom: "75px" }}>
        <ModalManager
          chainId={Number(networkInfo.chainId)}
          account={networkInfo.account}
          onClose={() => {
            setModalType(ModalType.NONE);
          }}
        />
      </div>
      <h4 style={{ textAlign: "center" }}>
        to swap tokens, visit{" "}
        <a
          style={{ color: "#a2fca3", textDecoration: "underline" }}
          href="https://app.slingshot.finance/trade/"
        >
          Slingshot
        </a>
      </h4>
      {notifs.filter((filterItem) => filterItem.type == "transactionStarted")
        .length > 0 ? (
        <div>
          <p className="tableName">ongoing transaction</p>
          <Table columns={["name", "transaction", "time"]}>
            {notifs.map((item) => {
              if (
                //@ts-ignore
                item?.transactionName?.includes("type") &&
                item.type == "transactionStarted"
              ) {
                //@ts-ignore
                const msg: Details = JSON.parse(item?.transactionName);

                switch (msg.type) {
                  case "add":
                    msg.type = "adding";
                    break;
                  case "remove":
                    msg.type = "removing";
                    break;
                  case "Enable":
                    msg.type = "enabling";
                    break;
                }
                return (
                  <TransactionRow
                    key={item.submittedAt}
                    icons={msg.icon}
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
          </Table>
        </div>
      ) : null}
      {userPairs?.filter(
        (pair: UserLPPairInfo) =>
          !pair.userSupply.totalLP.isZero() || pair.userSupply.percentOwned > 0
      ).length ? (
        <div>
          <p className="tableName">current position</p>
          <Table columns={["Asset", "TVL", "wallet", "% Share"]}>
            {userPairs?.map((pair: UserLPPairInfo, idx) => {
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
                />
              ) : null;
            })}
          </Table>
        </div>
      ) : null}

      {
        userPairs?.filter(
          (pair: UserLPPairInfo) =>
            pair.userSupply.totalLP.isZero() &&
            pair.userSupply.percentOwned == 0
        ).length ? (
          <div>
            <p className="tableName">pools</p>
            <Table columns={["Asset", "TVL", "wallet", "% Share"]}>
              {userPairs?.map((pair: UserLPPairInfo, idx) => {
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
                  />
                );
              })}
            </Table>
          </div>
        ) : null
        // <Table columns={["Asset", "TVL", "wallet", "% Share"]}>
        //   <LoadingRow colSpan={4} />
        //   <LoadingRow colSpan={4} />
        //   <LoadingRow colSpan={4} />
        //   <LoadingRow colSpan={4} />
        // </Table>
      }
    </DexContainer>
  );
};
export default Dex;
