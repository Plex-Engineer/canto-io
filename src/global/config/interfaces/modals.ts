import { ReactNode } from "react";

export interface ConfirmTxModalProps {
  networkId?: number;
  title: string;
  //if you want to include an image under the title (token icon, symbol, etc.)
  titleIcon?: ReactNode;
  confirmationValues: { title: string; value: string | number }[];
  extraInputs: {
    header: string;
    placeholder: string;
    value: string | number;
    setValue: (s: string) => void;
  }[];
  disableConfirm: boolean;
  onConfirm: () => void;
  extraDetails?: ReactNode;
  onClose: () => void;
}
