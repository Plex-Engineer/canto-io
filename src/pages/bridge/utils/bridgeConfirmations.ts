import { toast } from "react-toastify";

export function checkBridgeAmountConfirmation(amount: number, max: number) {
  if (amount <= 0 || !amount) {
    return "enter amount";
  } else {
    if (amount > max) {
      return "insufficient funds";
    }
  }
  return "bridge out";
}

export function checkGravityAddress(address: string) {
  return address.slice(0, 7) == "gravity" && address.length == 46;
}

export function toastBridge(success: boolean) {
  if (success) {
    toast("bridge successful", {
      toastId: 1,
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progressStyle: {
        color: "var(--primary-color)",
      },
      style: {
        border: "1px solid var(--primary-color)",
        borderRadius: "0px",
        paddingBottom: "3px",
        background: "black",
        color: "var(--primary-color)",
        height: "100px",
        fontSize: "20px",
      },
    });
  }
}

const increaseAllowanceString = "increase allowance";
const sendTokenString = "send token";
const approveString = "approve";

export function getStatus(value: string, status: string) {
  switch (status) {
    case "None":
      return value;
    case "Mining":
      switch (value) {
        case increaseAllowanceString:
          return "increasing allowance";
        case approveString:
          return "approving";
        case sendTokenString:
          return "sending token";
      }
      break;
    case "Success":
      switch (value) {
        case increaseAllowanceString:
          return "allowance increased";
        case approveString:
          return "approved";
        case sendTokenString:
          return "token sent";
      }
      break;
    case "Exception":
      return "couldn't " + value;
    case "Fail":
      return "couldn't " + value;
    case "PendingSignature":
      switch (value) {
        case increaseAllowanceString:
        case approveString:
        case sendTokenString:
          return "waiting for confirmation";
      }
  }
  return value;
}
