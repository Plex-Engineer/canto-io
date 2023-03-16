import { BigNumber, Contract, ethers } from "ethers";
import { gravityBridgeAbi } from "global/config/abi";
import { ADDRESSES } from "global/config/addresses";
import { CantoMainnet, ETHMainnet } from "global/config/networks";
import { Token } from "global/config/tokenInfo";
import { ALL_BRIDGE_OUT_NETWORKS } from "../config/bridgeOutNetworks";
import {
  findBridgeInToken,
  findNativeToken,
  getNetworkFromAddress,
} from "./findTokens";

const globalFetchOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

export interface TransactionHistoryEvent {
  bridgeType: "in" | "out";
  token?: Token;
  amount: BigNumber;
  timestamp: number;
  blockNumber: number;
  txHash: string;
  complete: boolean;
  secondsToComplete: string;
  from: string;
  to: string;
  blockExplorerUrl: string;
}

export async function getBridgeInEventsWithStatus(
  ethAccount?: string,
  cantoAccount?: string
): Promise<[TransactionHistoryEvent[], TransactionHistoryEvent[]]> {
  const completedEvents: TransactionHistoryEvent[] = [];
  const pendingEvents: TransactionHistoryEvent[] = [];
  const userBridgeInEvents = await getEthGBridgeInEvents(ethAccount);
  const latestBridgeTransactions = await getLatestGBridgeTransactions(
    ethAccount
  );
  userBridgeInEvents.forEach((event) => {
    const matchedTx = latestBridgeTransactions.find(
      (bridgeTx: DepositEvent) =>
        Number(bridgeTx.block_height) == event.blockNumber
    );
    if (matchedTx) {
      if (matchedTx.confirmed) {
        completedEvents.push(event);
      } else {
        pendingEvents.push({
          ...event,
          secondsToComplete: matchedTx.seconds_until_confirmed,
          complete: false,
        });
      }
    } else {
      //if within 5 minutes, the event might not be seen by the gbridge contract yet, so it cannot be completed yet
      if (
        event.timestamp + 60000 * 5 >
        new Date(new Date().toUTCString()).getTime()
      ) {
        pendingEvents.push({
          ...event,
          secondsToComplete: "-1",
          complete: false,
        });
      } else {
        completedEvents.push(event);
      }
    }
  });
  //add all of the ibc transfers to completed events as well
  completedEvents.push(...(await getIBCInTransactions(cantoAccount)));
  return [completedEvents, pendingEvents];
}

async function getEthGBridgeInEvents(
  ethAddress?: string
): Promise<TransactionHistoryEvent[]> {
  const provider = new ethers.providers.JsonRpcProvider(ETHMainnet.rpcUrl);
  const gBridgeContract = new Contract(
    ADDRESSES.ETHMainnet.GravityBridge,
    gravityBridgeAbi,
    provider
  );
  const eventFilters = gBridgeContract.filters.SendToCosmosEvent(
    null,
    ethAddress
  );
  const filteredEvents = await gBridgeContract.queryFilter(eventFilters);
  return await Promise.all(
    filteredEvents.map(async (event) => {
      const [tokenAddress, amount] = [event.args?.[0], event.args?.[3]];
      return {
        bridgeType: "in",
        token: findBridgeInToken(tokenAddress),
        amount,
        timestamp:
          (await provider.getBlock(event.blockNumber)).timestamp * 1000,
        blockNumber: event.blockNumber,
        txHash: event.transactionHash,
        from: "eth",
        to: "canto",
        //don't know yet, but can place default values
        complete: true,
        secondsToComplete: "0",
        blockExplorerUrl: "https://etherscan.io/tx/",
      };
    })
  );
}

interface DepositEvent {
  amount: string;
  block_height: string;
  blocks_until_confirmed: string;
  confirmed: boolean;
  destination: string;
  erc20: string;
  event_nonce: number;
  seconds_until_confirmed: string;
  sender: string;
}
async function getLatestGBridgeTransactions(
  ethAccount?: string
): Promise<DepositEvent[]> {
  const latestTransactions = await (
    await fetch("https://info.gravitychain.io:9000/eth_bridge_info")
  ).json();
  const deposits = latestTransactions?.deposit_events;
  if (deposits) {
    return deposits.filter(
      (deposit: DepositEvent) => deposit.sender == ethAccount
    );
  }
  return [];
}

//local interface to prevent use of any type
interface Attribute {
  key: string;
  value: string;
}
interface IBCEvent {
  attributes: Attribute[];
}
async function getIBCTxs(ibcIn: boolean, cantoAccount?: string) {
  const ibcAttribute = ibcIn ? "receiver" : "sender";
  return await (
    await fetch(
      CantoMainnet.cosmosAPIEndpoint +
        "/cosmos/tx/v1beta1/txs?events=fungible_token_packet." +
        ibcAttribute +
        "%3D'" +
        cantoAccount +
        "'",
      globalFetchOptions
    )
  ).json();
}
function parseFungibleTokenPacket(event: IBCEvent) {
  const denom =
    event.attributes.find((att: Attribute) => att.key === "denom")?.value ?? "";
  const amount =
    event.attributes.find((att: Attribute) => att.key === "amount")?.value ??
    "";
  //sometimes other transaction included with different sender (check here for sender)
  const sender =
    event.attributes.find((att: Attribute) => att.key === "sender")?.value ??
    "";
  const receiver =
    event.attributes.find((att: Attribute) => att.key === "receiver")?.value ??
    "";
  const success =
    event.attributes.find((att: Attribute) => att.key === "success")?.value ??
    "";
  return [denom, amount, sender, receiver, success];
}

async function getIBCInTransactions(
  cantoAccount?: string
): Promise<TransactionHistoryEvent[]> {
  const ibcInHistory: TransactionHistoryEvent[] = [];
  const ibcIn = await getIBCTxs(true, cantoAccount);
  for (const tx of ibcIn.tx_responses) {
    //@ts-ignore
    const allEvents = tx.logs.map((log) => log.events).flat();
    for (const event of allEvents) {
      if (event.type === "fungible_token_packet") {
        const [denom, amount, sender, receiver, success] =
          parseFungibleTokenPacket(event);
        //check to make sure that we can find the token and its not already accounted for in the sendToCosmosEvent
        const token = findNativeToken(denom);
        const doNotShow =
          !token || ["USDC", "USDT", "WETH"].includes(token.symbol);
        if (receiver == cantoAccount && success == "true" && !doNotShow) {
          ibcInHistory.push({
            bridgeType: "in",
            token: token,
            amount: BigNumber.from(amount ?? "0"),
            timestamp: tx.timestamp,
            blockNumber: Number(tx.height),
            txHash: tx.txhash,
            complete: true,
            secondsToComplete: "0",
            from: getNetworkFromAddress(sender),
            to: "canto",
            blockExplorerUrl: "https://www.mintscan.io/canto/txs/",
          });
        }
      }
    }
  }
  return ibcInHistory;
}
export async function getIBCOutTransactions(
  cantoAccount?: string
): Promise<TransactionHistoryEvent[]> {
  const bridgeOutNetworks = Object.keys(ALL_BRIDGE_OUT_NETWORKS).map(
    (key, network) =>
      ALL_BRIDGE_OUT_NETWORKS[network as keyof typeof ALL_BRIDGE_OUT_NETWORKS]
        .channel
  );
  const bridgeOutData: TransactionHistoryEvent[] = [];
  const ibcOut = await getIBCTxs(false, cantoAccount);
  for (const tx of ibcOut.tx_responses) {
    //grab token and amount from each bridge out into gravity bridge
    //@ts-ignore
    const allEvents = tx.logs.map((log) => log.events).flat();
    for (const event of allEvents) {
      if (event.type === "fungible_token_packet") {
        const [denom, amount, sender, receiver, success] =
          parseFungibleTokenPacket(event);
        //"transfer/channel-0/gravity0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" ~ return of denom
        const [type, channel, tokenDenom] = denom.split("/");
        if (
          type == "transfer" &&
          bridgeOutNetworks.includes(channel) &&
          sender == cantoAccount
          // success == "true"
        ) {
          const token = findNativeToken(tokenDenom);
          bridgeOutData.push({
            bridgeType: "out",
            token,
            amount: BigNumber.from(amount),
            timestamp: tx.timestamp,
            blockNumber: Number(tx.height),
            txHash: tx.txhash,
            complete: true,
            secondsToComplete: "0",
            from: "canto",
            to: getNetworkFromAddress(receiver),
            blockExplorerUrl: "https://www.mintscan.io/canto/txs/",
          });
        }
      }
    }
  }
  // console.log("bridge out", bridgeOutData);
  return bridgeOutData;
}

async function getConvertTransactionsForUser(
  cantoAccount?: string
): Promise<[unknown[], unknown[]]> {
  const convertToERC20 = await (
    await fetch(
      CantoMainnet.cosmosAPIEndpoint +
        "/cosmos/tx/v1beta1/txs?events=convert_coin.sender%3D'" +
        cantoAccount +
        "'",
      globalFetchOptions
    )
  ).json();
  const convertToNative = await (
    await fetch(
      CantoMainnet.cosmosAPIEndpoint +
        "/cosmos/tx/v1beta1/txs?events=convert_erc20.receiver%3D'" +
        cantoAccount +
        "'",
      globalFetchOptions
    )
  ).json();
  return [convertToERC20, convertToNative];
}
