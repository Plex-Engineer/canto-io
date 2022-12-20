import { useEffect } from "react";
import { Notification } from "@usedapp/core";
import { transactionStatusActions } from "global/utils/utils";
import { toastHandler } from "global/utils/toastHandler";

export const useToast = (
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>,
  notifications: Notification[],
  notifs: Notification[],
  setNotifs: React.Dispatch<React.SetStateAction<Notification[]>>
) => {
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
        const msgName =
          Number(msg.amount) > 0
            ? `${Number(msg.amount).toFixed(2)} ${msg.name}`
            : msg.name;
        const toastMsg = transactionStatusActions(msg.type, msgName).postAction;
        const msged = `${isSuccesful ? "" : "un"}successfully ${toastMsg}`;
        toastHandler(msged, isSuccesful, noti.submittedAt);
      }
    });
  }, [notifications, notifs]);
};
