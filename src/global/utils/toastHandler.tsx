import { toast } from "react-toastify";
import "App.scss";

const primaryColor = "var(--primary-color)";
const errorColor = "var(--error-color)";
export function toastHandler(
  message: string,
  successful: boolean,
  toastId: string | number,
  autoClose?: number
) {
  toast(message, {
    position: "top-right",
    autoClose: autoClose ?? 5000,
    toastId: toastId,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progressClassName: successful ? "toast-success" : "toast-error",
    style: {
      border: `1px solid ${successful ? primaryColor : errorColor}`,
      borderRadius: "0px",
      paddingBottom: "3px",
      background: "black",
      color: `${successful ? primaryColor : errorColor}`,
      height: "100px",
      fontSize: "20px",
    },
  });
}
