import { toastHandler } from "global/utils/toastHandler";

export function toastBridge(success: boolean) {
  const successful = success ? "successful" : "unsuccessful";
  toastHandler(`Bridge ${successful}`, success, "0");
}
