import { generateEndpointIBCChannels } from "@tharsis/provider";
import { createTxIBCMsgTransfer } from "./IBCMsgTransfer";
import { signAndBroadcastTxMsg, getSenderObj } from "./signAndBroadcast";



export async function txIBCTransfer(receiver:any, channel_id:any, amount:any, denom:any, nodeAddressIP:any, counterPartyChain:any, fee:any, chain:any, memo:any) {
    // check metamask
    //@ts-ignore
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
    } else {
        console.log('Please install Metamask!');
    }
    //retrieve account data
    //@ts-ignore
    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
    const account = accounts[0]
    const senderObj = await getSenderObj(account, nodeAddressIP)
    console.log(account)
    //get revision number/height for construction of the timeout-height object (determines the last update of the counter-party IBC client)
    const ibcData = await getIBCData(counterPartyChain)

    let timeoutTimestamp = await getBlockTimestamp(counterPartyChain)
    
    //decrease precision of timeoutTimestamp to avoid errors in protobuf encoding
    timeoutTimestamp = timeoutTimestamp.slice(0,9) + '0000000000'
    
    //set tolerance on revision height to be 1000 blocks, (timeoutHeight is 1000 blocks higher than client concensus state height)
    let revisionHeight = Number(ibcData['height']['revision_height']) + 1000
    console.log(revisionHeight)

    const params =  {
        sourcePort: "transfer", // ibc transfers will always be sent to the transfer port of the counterparty client
        sourceChannel: channel_id, // channel id for transfer, there will be multiple per counterparty but we designate one (the one determining the denom-trace for the transfer)
        amount: amount,
        denom: denom, // designates the denom of the asset to transfer, either acanto or ibc/<HASH>
        receiver: receiver,
        sender: senderObj.accountAddress, 
        revisionNumber: ibcData['height']['revision_number'],
        revisionHeight: revisionHeight,
        timeoutTimestamp: timeoutTimestamp
    }   

    const msg = createTxIBCMsgTransfer(chain, senderObj, fee, memo, params)
    console.log(msg)

    let response = await signAndBroadcastTxMsg(msg, senderObj, chain, nodeAddressIP, account)
    return response;
}



export async function getIBCData(nodeAddress:string) {
    let resp = await fetch(nodeAddress + generateEndpointIBCChannels(), {
        method: 'GET',
        headers: {
            "Accept" : "application/json"
        }
    })
    .catch(error => console.log("getIBCData::error: ", error))
    //@ts-ignore
    return resp.json()
}

/**
 * @param {string} nodeAddress rest endpoint to request counter-party chain timestamp
 */
 export async function getBlockTimestamp(nodeAddress:string) {
    let resp = await fetch(nodeAddress + '/blocks/latest', {
        method: 'GET',
        headers: {
            "Accept": "application/json"
        }
    }).catch(error => console.log("getBlockTimestamp::error: ", error))
    //@ts-ignore
    let obj = await resp.json()
    // get iso formatted time stamp from latest block
    let ts = obj['block']['header']['time']
    // parse string into microseconds UTC
    let ms = Date.parse(ts)
    // return as nano-seconds
    return Number((ms * 1e7) + (600 * 1e9)).toString()
}

