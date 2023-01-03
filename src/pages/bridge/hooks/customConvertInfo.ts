import { useState } from "react";
import { UserConvertToken } from "../config/interfaces";
import { getConvertButtonText } from "../utils/reactiveButtonText";
import { convertStringToBigNumber } from "../utils/stringToBigNumber";

interface ConvertInfoProps {
  amount: string;
  setAmount: (amount: string) => void;
  convertButtonText: string;
  convertDisabled: boolean;
}
export function useCustomConvertInfo(
  convertIn: boolean,
  selectedConvertToken: UserConvertToken
): ConvertInfoProps {
  const [amount, setAmount] = useState<string>("");

  const [convertButtonText, convertDisabled] = getConvertButtonText(
    convertStringToBigNumber(amount, selectedConvertToken.decimals),
    selectedConvertToken,
    convertIn
      ? selectedConvertToken.nativeBalance
      : selectedConvertToken.erc20Balance,
    convertIn
  );

  return {
    amount,
    setAmount,
    convertButtonText,
    convertDisabled,
  };
}
