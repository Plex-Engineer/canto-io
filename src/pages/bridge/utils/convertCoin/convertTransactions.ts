import { Chain, Fee } from "global/config/cosmosConstants";
import { getSenderObj, signAndBroadcastTxMsg } from "global/utils/cantoTransactions/helpers";
import { createTxMsgConvertCoin } from "./createMessages/msgConvertCoin";
import { createTxMsgConvertERC20 } from "./createMessages/msgConvertERC20";

export async function txConvertERC20(erc20ContractAddress : string, amount: string, receiverCantoAddress:string, nodeAddressIP:string, fee:Fee, chain:Chain, memo:string) {
    // get metamask account address
    //@ts-ignore
    if (!window.ethereum) {
      return
    }
    //@ts-ignore
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    // get sender object using eth address
    const senderObj = await getSenderObj(account, nodeAddressIP);

    const params = {
        contract_address: erc20ContractAddress,
        amount: amount,
        receiverEvmosFormatted: receiverCantoAddress,
        senderHexFormatted: account,
    }

    const msg = createTxMsgConvertERC20(chain, senderObj, fee, memo, params);
    await signAndBroadcastTxMsg(msg, senderObj, chain, nodeAddressIP, account);
}

export async function txConvertCoin(cantoAddress : string, denom:string, amount:string, nodeAddressIP:string, fee:Fee, chain:Chain, memo:string) {
    // get metamask account address
     //@ts-ignore
     if (!window.ethereum) {
        return
      }
      //@ts-ignore
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    // get sender object using eth address
    const senderObj = await getSenderObj(account, nodeAddressIP);
    const params = {
        denom: denom, //native canto asset ibcXXXXXXXXXXX
        amount: amount,
        receiverHexFormatted: account, // same metamask evm address
        senderEvmosFormatted: cantoAddress,
    }
    const msg = createTxMsgConvertCoin(chain, senderObj, fee, memo, params);
    await signAndBroadcastTxMsg(msg, senderObj, chain, nodeAddressIP, account);
}