// import {
//   generateEndpointAccount,
//   generateEndpointBroadcast,
//   generatePostBodyBroadcast,
//   generateEndpointBalances,
// } from "@tharsis/provider";
// import { ethers } from "ethers";
// // import { signatureToPubkey } from "@hanchon/signature-to-pubkey";
// import { createTxMsgConvertERC20 } from "./msgConvertERC20";
// import {
//   createTxRawEIP712,
//   signatureToWeb3Extension,
// } from "@tharsis/transactions";


// export async function txConvertERC20(
//   erc20ContractAddress,
//   amount,
//   receiverCantoAddress,
//   nodeAddressIP,
//   fee,
//   chain,
//   memo
// ) {
//   // get metamask account address
//   const accounts = await window.ethereum.request({
//     method: "eth_requestAccounts",
//   });
//   const account = accounts[0];

//   // get sender object using eth address
//   const senderObj = await getSenderObj(account, nodeAddressIP);

//   const params = {
//     contract_address: erc20ContractAddress,
//     amount: amount,
//     receiverEvmosFormatted: receiverCantoAddress,
//     senderHexFormatted: account,
//   };
//   const msg = createTxMsgConvertERC20(chain, senderObj, fee, memo, params);
//   await signAndBroadcastTxMsg(msg, senderObj, chain, nodeAddressIP, account);
// }

// export async function getSenderObj(address, nodeAddress) {
//   const accountCanto = await ethToCanto(address, nodeAddress);

//   const endPointAccount = generateEndpointAccount(accountCanto);
//   const url = nodeAddress + endPointAccount;

//   const options = {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//   };

//   const addressRawData = await fetch(url, options);

//   const addressData = await addressRawData.json();

//   const senderObj = await reformatSender(
//     addressData["account"]["base_account"]
//   );
//   return senderObj;
// }

// export async function ethToCanto(address, nodeAddress) {
//   return fetch(nodeAddress + "/ethermint/evm/v1/cosmos_account/" + address, {
//     method: "GET",
//     headers: {
//       Accept: "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((result) => {
//       address = result.cosmos_address;
//       return address;
//     })
//     .catch((error) => console.log("error", error));
// }

// async function reformatSender(addressData) {
//   let pubkey = addressData["pub_key"]["key"];
//   return {
//     accountNumber: addressData["account_number"],
//     pubkey: pubkey,
//     sequence: addressData["sequence"],
//     accountAddress: addressData["address"],
//   };
// }

// export async function signAndBroadcastTxMsg(msg, senderObj, chain, nodeAddress, account) {
//   const signature = await window.ethereum.request({
//       method: 'eth_signTypedData_v4',
//       params: [account, JSON.stringify(msg.eipToSign)],
//   });

//   const raw = generateRawTx(chain, senderObj, signature, msg);

//   const postOptions = {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: generatePostBodyBroadcast(raw),
//   };

//   const broadcastPost = await fetch(
//       nodeAddress + generateEndpointBroadcast(),
//       postOptions
//   );
    
//   const response = await broadcastPost.json();
// }

// function generateRawTx(chain, senderObj, signature, msg) {
//   let extension = signatureToWeb3Extension(chain, senderObj, signature)
//   let rawTx = createTxRawEIP712(msg.legacyAmino.body, msg.legacyAmino.authInfo, extension)
//   return rawTx;
// }