import { useContractFunction } from "@usedapp/core";
import { Contract, utils } from "ethers";
import { cERC20Abi, ERC20Abi } from "global/config/abi";
import { CantoTransactionType } from "global/config/interfaces/transactionTypes";

export function useEnableToken(props: Details) {
  const erc20Interface = new utils.Interface(ERC20Abi);

  const { state, send } = useContractFunction(
    props.address && new Contract(props.address, erc20Interface),
    "approve",
    {
      transactionName: JSON.stringify(props),
    }
  );
  return { state, send };
}

export function useSupply(props: Details) {
  const erc20Interface = new utils.Interface(cERC20Abi);

  const { state, send } = useContractFunction(
    props.address && new Contract(props.address, erc20Interface),
    "mint",
    {
      transactionName: JSON.stringify(props),
    }
  );

  return { state, send };
}

export interface Details {
  address: string;
  name: string;
  icon: string;
  amount: string;
  type: CantoTransactionType;
}
