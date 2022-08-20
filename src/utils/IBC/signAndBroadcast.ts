//@ts-nocheck
import { generateEndpointAccount, generateEndpointBroadcast, generatePostBodyBroadcast, generateEndpointProposals } from '@tharsis/provider';
import { createTxRawEIP712, signatureToWeb3Extension, createTxMsgDelegate, createTxMsgVote } from '@tharsis/transactions';
import {signatureToPubkey} from "@hanchon/signature-to-pubkey"
import { ethers } from 'ethers';
import {Buffer} from 'buffer'
/**
 * Signs msg using metamask and broadcasts to node
 * @param {object} msg msg object
 * @param {object} senderObj sender object
 * @param {object} chain chain object
 * @param {string} nodeAddress ip address and port of node
 * @param {string} account eth hex address
 */
 export async function signAndBroadcastTxMsg(msg:any, senderObj:any, chain:any, nodeAddress:string, account:string) {
    // @ts-ignore
    const signature = await window.ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [account, JSON.stringify(msg.eipToSign)],
    });
    
    const raw = generateRawTx(chain, senderObj, signature, msg);

    const postOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: generatePostBodyBroadcast(raw),
    };
    console.log(     nodeAddress + generateEndpointBroadcast(),
    postOptions)
    const broadcastPost = await fetch(
        nodeAddress + generateEndpointBroadcast(),
        postOptions
    );
    const response = await broadcastPost.json();
    return response
}

function generateRawTx(chain:any, senderObj:any, signature:any, msg:any) {
    let extension = signatureToWeb3Extension(chain, senderObj, signature)
    let rawTx = createTxRawEIP712(msg.legacyAmino.body, msg.legacyAmino.authInfo, extension)
    return rawTx;
}

/**
 * Uses the eth hex address, converts it to a canto address, 
 * then gets the sender object. 
 * @param {string} address The eth address
 * @param {string} nodeAddress The address of the node: xxx.xxx.x.xx:1317
 * @return {string} The sender object
 */
 export async function getSenderObj(address:string, nodeAddress:string) {
    const accountCanto = await ethToCanto(address, nodeAddress);
    const endPointAccount = generateEndpointAccount(accountCanto??"");
    
    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
    
    const addressRawData = await fetch(
        nodeAddress + endPointAccount,
        options
    );
    
    const addressData = await addressRawData.json();
    const senderObj = reformatSender(addressData['account']['base_account']);

    return senderObj;
}

/**
 * Convert an eth hex address to bech32 canto address.
 * @param {string} address The eth address to convert into a canto address
 * @return {string} The converted address
 */
 async function ethToCanto(address:string, nodeAddress:string) {
    return fetch(nodeAddress+ "/ethermint/evm/v1/cosmos_account/" + address, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    })
        .then(response => response.json())
        .then(result => {
            console.log(result)
            address = result.cosmos_address
            return address;
        })
        .catch(error => console.log("error", error));
}

/**
 * Reformats the addressData into senderObj
 * @param {object} addressData The eth address
 * @return {string} The sender object
 */

 async function reformatSender(addressData : string) {
    let pubkey;
    if (addressData['pub_key'] == null) {
        const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
        await provider.send("eth_requestAccounts", [1]);
        const signer = provider.getSigner();
        const signature = await signer.signMessage('generate_pubkey');

        pubkey = signatureToPubkey(
            signature,
            Buffer.from([
                50, 215, 18, 245, 169, 63, 252, 16, 225, 169, 71, 95, 254, 165, 146, 216,
                40, 162, 115, 78, 147, 125, 80, 182, 25, 69, 136, 250, 65, 200, 94, 178,
            ]),
        );
    } else {
        pubkey = addressData['pub_key']['key'];
    }
    return {
        accountNumber: addressData['account_number'],
        pubkey: pubkey,
        sequence: addressData['sequence'],
        accountAddress: addressData['address'],
    }
    
}
