import { utils, Contract } from "ethers";
import { useContractFunction } from "@usedapp/core";
import { CantoTestnet } from "global/config/networks";
import { ERC20Abi, routerAbi } from "global/config/abi";
import { ADDRESSES } from "global/config/addresses";
import { CantoTransactionType } from "global/config/interfaces/transactionTypes";

interface Details {
  address: string;
  name: string;
  icon:
    | {
        icon1: string;
        icon2: string;
      }
    | string;
  amount: string;
  type: CantoTransactionType;
}

export function getRouterAddress(chainId: number | undefined) {
  return CantoTestnet.chainId == chainId
    ? ADDRESSES.testnet.PriceFeed
    : ADDRESSES.cantoMainnet.PriceFeed;
}

export function useSetAllowance(token: Details) {
  const ERC20Interface = new utils.Interface(ERC20Abi);
  const contract = new Contract(token.address, ERC20Interface);

  const { state, send } = useContractFunction(contract, "approve", {
    transactionName: JSON.stringify(token),
  });

  return { state, send };
}

//addLiquidity(address tokenA,address tokenB,bool stable, uint amountADesired,uint amountBDesired,uint amountAMin,uint amountBMin,address to,uint deadline)
export function useAddLiquidity(chainId: number | undefined, details: Details) {
  const routerAddress = getRouterAddress(chainId);

  const RouterInterface = new utils.Interface(routerAbi);
  const contract = new Contract(routerAddress, RouterInterface);

  const { state, send } = useContractFunction(contract, "addLiquidity", {
    transactionName: JSON.stringify(details),
  });

  return { state, send };
}

//addLiquidityCANTO(address token,bool stable,uint amountTokenDesired,uint amountTokenMin,uint amountCANTOMin,address to,uint deadline)
export function useAddLiquidityCANTO(
  chainId: number | undefined,
  details: Details
) {
  const routerAddress = getRouterAddress(chainId);
  const RouterInterface = new utils.Interface(routerAbi);
  const contract = new Contract(routerAddress, RouterInterface);

  const { state, send } = useContractFunction(contract, "addLiquidityCANTO", {
    transactionName: JSON.stringify(details),
  });

  return { state, send };
}

//removeLiquidity(address tokenA,address tokenB,bool stable,uint liquidity,uint amountAMin,uint amountBMin,address to,uint deadline)
export function useRemoveLiquidity(
  chainId: number | undefined,
  details: Details
) {
  const routerAddress = getRouterAddress(chainId);
  const RouterInterface = new utils.Interface(routerAbi);
  const contract = new Contract(routerAddress, RouterInterface);

  const { state, send } = useContractFunction(contract, "removeLiquidity", {
    transactionName: JSON.stringify(details),
  });

  return { state, send };
}

//removeLiquidityCANTO(address token,bool stable,uint liquidity,uint amountTokenMin,uint amountCANTOMin,address to,uint deadline)
export function useRemoveLiquidityCANTO(
  chainId: number | undefined,
  details: Details
) {
  const routerAddress = getRouterAddress(chainId);
  const RouterInterface = new utils.Interface(routerAbi);
  const contract = new Contract(routerAddress, RouterInterface);

  const { state, send } = useContractFunction(
    contract,
    "removeLiquidityCANTO",
    {
      transactionName: JSON.stringify(details),
    }
  );

  return { state, send };
}
