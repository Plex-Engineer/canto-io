import { ADDRESSES, CantoMainnet, TOKENS } from "cantoui";
import { BigNumber, Contract, ethers, Event } from "ethers";
import { ETHMainnet } from "pages/bridge/config/networks";
import { gravityabi } from "../config/gravityBridgeAbi";

const globalFetchOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

export interface EventWithTime extends Event {
  timestamp: string;
}
export async function getAllBridgeTransactionsWithStatus(
  ethAccount?: string,
  cantoAccount?: string
): Promise<[EventWithTime[], Event[]]> {
  const ethEvents = await getEthGBridgeInEvents(ethAccount);
  const cantoEventInfo = await getCompletedBridgeInEvents(cantoAccount);
  const completedEvents: EventWithTime[] = [];
  const pendingEvents: Event[] = [];
  for (const pendingTx of ethEvents) {
    let complete = false;
    let timestamp;
    for (const completedTx of cantoEventInfo) {
      if (
        pendingTx.args?._amount.eq(BigNumber.from(completedTx.amount)) &&
        pendingTx.args?._tokenContract === completedTx.denom.slice(7)
      ) {
        complete = true;
        timestamp = completedTx.timestamp;
        break;
      }
    }
    complete
      ? completedEvents.push({ ...pendingTx, timestamp })
      : pendingEvents.push(pendingTx);
  }
  return [completedEvents, pendingEvents];
}

export async function getEthGBridgeInEvents(ethAccount?: string) {
  const provider = new ethers.providers.JsonRpcProvider(ETHMainnet.rpcUrl);
  const gbridgeContract = new Contract(
    ADDRESSES.ETHMainnet.GravityBridge,
    gravityabi,
    provider
  );
  const eventFilters = gbridgeContract.filters.SendToCosmosEvent(
    null,
    ethAccount
  );
  return await gbridgeContract.queryFilter(eventFilters);
}

export async function getCompletedBridgeInEvents(cantoAccount?: string) {
  const gBridgeIBCTransfers = [];
  const IBC = await (
    await fetch(
      CantoMainnet.cosmosAPIEndpoint +
        "/cosmos/tx/v1beta1/txs?events=fungible_token_packet.receiver%3D'" +
        cantoAccount +
        "'",
      globalFetchOptions
    )
  ).json();
  for (const tx of IBC.tx_responses) {
    //combine all events into one array to look through for gbridge identifier
    //@ts-ignore
    const allEvents = tx.logs.map((log) => log.events).flat();
    for (const event of allEvents) {
      if (event.type === "recv_packet") {
        for (const attribute of event.attributes) {
          if (
            attribute.key === "packet_dst_channel" &&
            attribute.value === "channel-0"
          ) {
            const txData = event.attributes.find(
              (att: any) => att.key === "packet_data"
            );
            gBridgeIBCTransfers.push({
              ...JSON.parse(txData.value),
              timestamp: tx.timestamp,
            });
          }
        }
      }
    }
  }
  return gBridgeIBCTransfers;
}

export async function getBridgeOutTransactions(cantoAccount?: string) {
  const bridgeOutData = [];
  const IBC = await (
    await fetch(
      CantoMainnet.cosmosAPIEndpoint +
        "/cosmos/tx/v1beta1/txs?events=fungible_token_packet.sender%3D'" +
        cantoAccount +
        "'&acknowledge_packet.packet_src_channel%3D'channel-0'",
      globalFetchOptions
    )
  ).json();
  for (const tx of IBC.tx_responses) {
    //grab token and amount from each bridge out into gravity bridge
    //@ts-ignore
    const allEvents = tx.logs.map((log) => log.events).flat();
    for (const event of allEvents) {
      if (event.type === "fungible_token_packet") {
        const denom = event.attributes.find(
          (att: any) => att.key === "denom"
        )?.value;
        const amount = event.attributes.find(
          (att: any) => att.key === "amount"
        )?.value;
        const tokenAddress = denom.split("/")[2];
        const token =
          tokenAddress == "uatom"
            ? findGravityToken(tokenAddress)
            : findGravityToken(tokenAddress.slice(7));
        bridgeOutData.push({ token, amount, tx });
      }
    }
  }
  return bridgeOutData;
}

export async function getConvertTransactionsForUser(
  cantoAccount?: string
): Promise<[any[], any[]]> {
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

export function findGravityToken(tokenAddress: string) {
  if (tokenAddress === "uatom") {
    return TOKENS.cantoMainnet.ATOM;
  }
  return ETHMainnet.gravityTokens.find(
    (token) => token.address === tokenAddress
  );
}

export function getBridgeStatus(blockNumber: number, txBlockNumber: number) {
  if (blockNumber - txBlockNumber > 100) {
    return "confirmed";
  }
  return "pending...";
}
