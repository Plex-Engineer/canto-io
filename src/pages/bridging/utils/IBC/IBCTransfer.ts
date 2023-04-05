/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateEndpointIBCChannels } from "@tharsis/provider";
import {
  getSenderObj,
  signAndBroadcastTxMsg,
} from "global/utils/cantoTransactions/helpers";
import { createTxIBCMsgTransfer } from "./IBCMsgTransfer";
import { Any } from "cosmjs-types/google/protobuf/any";
import { Account, accountFromAny } from "@cosmjs/stargate";

/**
 * @dev This function is used to parse the account from keplr
 * @param account Object from keplr account
 * @returns account with type Account
 */
export function customAccountParser(input: Any): Account {
  let { typeUrl, value } = input;
  //for eth accounts (like evmos)
  if (typeUrl !== "/ethermint.types.v1.EthAccount") {
    typeUrl = "/cosmos.auth.v1beta1.BaseAccount";
    accountFromAny({ typeUrl, value });
  }
  return accountFromAny(input);
}
//this is for IBC out of canto to another chain
export async function txIBCTransfer(
  receiver: any,
  channel_id: any,
  amount: any,
  denom: any,
  nodeAddressIP: any,
  counterPartyChain: any,
  latestBlockEndpoint: any,
  fee: any,
  chain: any,
  memo: any,
  extraEndpoints?: string[]
) {
  // check metamask
  //@ts-ignore
  if (typeof window.ethereum !== "undefined") {
    console.log("MetaMask is installed!");
  } else {
    console.log("Please install Metamask!");
  }
  //retrieve account data
  //@ts-ignore
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const account = accounts[0];
  const senderObj = await getSenderObj(account, nodeAddressIP);
  //get revision number/height for construction of the timeout-height object (determines the last update of the counter-party IBC client)
  const ibcData = await getIBCData(counterPartyChain, extraEndpoints);
  let timeoutTimestamp = await getBlockTimestamp(
    counterPartyChain,
    extraEndpoints,
    latestBlockEndpoint
  );

  //decrease precision of timeoutTimestamp to avoid errors in protobuf encoding
  timeoutTimestamp = timeoutTimestamp.slice(0, 9) + "00000000000";

  //set tolerance on revision height to be 1000 blocks, (timeoutHeight is 1000 blocks higher than client concensus state height)
  const revisionHeight = Number(ibcData["height"]["revision_height"]) + 1000;

  const params = {
    sourcePort: "transfer", // ibc transfers will always be sent to the transfer port of the counterparty client
    sourceChannel: channel_id, // channel id for transfer, there will be multiple per counterparty but we designate one (the one determining the denom-trace for the transfer)
    amount: amount,
    denom: denom, // designates the denom of the asset to transfer, either acanto or ibc/<HASH>
    receiver: receiver,
    sender: senderObj.accountAddress,
    revisionNumber: ibcData["height"]["revision_number"],
    revisionHeight: revisionHeight,
    timeoutTimestamp: timeoutTimestamp,
  };

  const msg = createTxIBCMsgTransfer(chain, senderObj, fee, memo, params);
  console.log(msg);

  return await signAndBroadcastTxMsg(
    msg,
    senderObj,
    chain,
    nodeAddressIP,
    account
  );
}

async function tryEndpoint(endpoint: string) {
  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (res.ok) {
      return [await res.json(), true];
    } else {
      return [null, false];
    }
  } catch (err) {
    console.error(err);
    return [null, false];
  }
}
async function tryMultipleEndpoints(
  allEndpoints: string[],
  endpointAddon: string
) {
  let endpointUp = false;
  let data = null;
  let endpointAttempt = 0;
  while (!endpointUp && endpointAttempt < allEndpoints.length) {
    const [endpointData, okay] = await tryEndpoint(
      allEndpoints[endpointAttempt] + endpointAddon
    );
    endpointAttempt++;
    endpointUp = okay;
    data = endpointData;
  }
  return data;
}

export async function getIBCData(
  nodeAddress: string,
  extraEndpoints?: string[]
) {
  const allEndpoints = extraEndpoints
    ? [nodeAddress, ...extraEndpoints]
    : [nodeAddress];
  return await tryMultipleEndpoints(
    allEndpoints,
    generateEndpointIBCChannels()
  );
}

/**
 * @param {string} nodeAddress rest endpoint to request counter-party chain timestamp
 */
export async function getBlockTimestamp(
  nodeAddress: string,
  extraEndpoints?: string[],
  latestBlockEndpoint?: string
) {
  const urlEnding = latestBlockEndpoint ?? "";
  const allEndpoints = extraEndpoints
    ? [nodeAddress, ...extraEndpoints]
    : [nodeAddress];
  const data = await tryMultipleEndpoints(
    allEndpoints,
    urlEnding + "/blocks/latest"
  );

  if (data) {
    // get iso formatted time stamp from latest block
    const ts = data["block"]["header"]["time"];
    // parse string into microseconds UTC
    const ms = Date.parse(ts);
    // return as nano-seconds
    return Number(ms * 1e7 + 600 * 1e9).toString();
  }
  throw Error("no timestamp");
}
