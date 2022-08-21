import { useContractFunction, useSendTransaction, useEthers } from "@usedapp/core";
import {  Contract, utils } from "ethers";
import { TOKENS, CantoTestnet, ADDRESSES } from "cantoui";
import { cERC20Abi, comptrollerAbi, ERC20Abi } from "global/config/abi";



//Ex : DAI 50
//On enter market : Collateralizing DAI : DAI is being collateralized: DAI has been collateralized 
//On exit market : Decollateralizing DAI : DAI is being decollateralized: DAI has been decollateralized 

//on Enable : enabling DAI : DAI has be enabled : enabled DAI

//on supply : Supplying 20 DAI : 20 DAI has been supplied : Supplied 20 DAI
//on borrow : Borrowing 20 DAI : 20 DAI has been borrowed : Borrowed 20 DAI
//on repay : Repaying 20 DAI : 20 DAI has been repayed : Repayed 20 DAI
//on withdraw : withdrawing 20 DAI : 20 DAI has been withdrew : Withdrew 20 DAI
// {type} {amount} {symbol}



  export function useEnterMarkets(props : Details) {
    const { chainId } = useEthers();
    const comptroller = chainId == CantoTestnet.chainId ? ADDRESSES.testnet.Comptroller : ADDRESSES.cantoMainnet.Comptroller;

    const compInterface = new utils.Interface(comptrollerAbi);
    const contract = new Contract(comptroller, compInterface)

    const { state, send } = useContractFunction(
      contract,
      "enterMarkets",
      {
          transactionName: JSON.stringify(props),
      }
    );
  
    return {state, send};
  }

  export function useExitMarket(props : Details) {
    const { chainId } = useEthers();
    const comptroller = chainId == CantoTestnet.chainId ? ADDRESSES.testnet.Comptroller : ADDRESSES.cantoMainnet.Comptroller;
    
    const compInterface = new utils.Interface(comptrollerAbi);
    const contract = new Contract(comptroller, compInterface)

    const { state, send } = useContractFunction(
      contract,
      "exitMarket",
      {
        transactionName: JSON.stringify(props),
    }
    );
    return {state, send};
  }
  export function useEnableToken(props : Details) {

    const erc20Interface = new utils.Interface(ERC20Abi);
    

    const { state, send } = useContractFunction(props.address &&
      new Contract(props.address, erc20Interface),
      "approve",
      {
          transactionName: JSON.stringify(props),
      }
    );
    return {state, send};
  }

  export function useSupplyEth (props : Details){
    return useSendTransaction({
      transactionName : JSON.stringify(props)
    })
  }

  export function useRepayEth (props : Details){
    return useSendTransaction({
      transactionName : JSON.stringify(props)
    })
  }
  export function useSupply(props : Details)  {
    const erc20Interface = new utils.Interface(cERC20Abi);
   
    const { state, send } = useContractFunction(props.address &&
      new Contract(props.address, erc20Interface),
      "mint",
      {
          transactionName: JSON.stringify(props),
      }, 
    );

   
    return {state, send};
  }

  export function useClaim(address : string)  {
    
    const compInterface = new utils.Interface(comptrollerAbi);
   
    const { state, send } = useContractFunction(address &&
      new Contract(address, compInterface),
      "claimComp",
      {
          transactionName: JSON.stringify({
            name : "CANTO",
            icon : TOKENS.cantoMainnet.CANTO.icon,
            amount : -1,
            type : "Claim"
          }),
      }, 

    );
    return {state, send};
  }

  export interface Details {
    address: string,
    name : string,
    icon : string,
    amount : string,
    type : string,
  }


  export function useReedem(props : Details) {

    const erc20Interface = new utils.Interface(cERC20Abi);

    const { state, send } = useContractFunction( props.address &&
      new Contract(props.address, erc20Interface),
      "redeemUnderlying",
      {
          transactionName: JSON.stringify(props),
      }
    );
    return {state, send};
  }
  export function useReedemToken(props : Details) {

    const erc20Interface = new utils.Interface(cERC20Abi);
    

    const { state, send } = useContractFunction( props.address &&
      new Contract(props.address, erc20Interface),
      "redeem",
      {
          transactionName: JSON.stringify(props),
      }
    );
    return {state, send};
  }

  export function useRepay(props : Details) {

    const erc20Interface = new utils.Interface(cERC20Abi);
   

    const { state, send } = useContractFunction( props.address &&
      new Contract(props.address, erc20Interface),
      "repayBorrow",
      {
          transactionName: JSON.stringify(props),
      }
    );
    return {state, send};
  }

  export function useBorrow(props : Details) {

    const erc20Interface = new utils.Interface(cERC20Abi);
    const { state, send } = useContractFunction( props.address &&
      new Contract(props.address, erc20Interface),
      "borrow",
      {
          transactionName: JSON.stringify(props),
      }
    );
    return {state, send};
  }
  
  

