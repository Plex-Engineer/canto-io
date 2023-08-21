import { ReactNode } from "react";

export interface ConfirmTxModalProps {
  title: string;
  //if you want to include an image under the title (token icon, symbol, etc.)
  titleIcon?: ReactNode;
  confirmationValues: { title: string; value: string | number }[];
  extraInputs: {
    header: string;
    placeholder: string;
    value: string | number;
    setValue: (s: string) => void;
    extraDetails?: ReactNode;
  }[];
  disableConfirm: boolean;
  onConfirm: () => void;
  extraDetails?: ReactNode;
  onClose: () => void;
}
