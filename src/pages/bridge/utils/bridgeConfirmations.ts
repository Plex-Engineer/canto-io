import { toast } from "react-toastify";

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
