import { CantoMainnet } from "global/config/networks";
import { Contract, ethers, Event } from "ethers";
import { ETHMainnet } from "pages/bridge/config/networks";
import { gravityabi } from "../config/gravityBridgeAbi";
import { ADDRESSES } from "global/config/addresses";
import { TOKENS } from "global/config/tokenInfo";
import { DepositEvent } from "../config/interfaces";
import { allBridgeOutNetworks } from "../config/gravityBridgeTokens";

const globalFetchOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

export interface EventWithTime extends Event {
  timestamp: number;
}
export interface PendingEvent extends EventWithTime {
  secondsUntilConfirmed: string;
}

async function getEthGBridgeInEvents(
  ethAccount?: string
): Promise<EventWithTime[]> {
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
  const filteredEvents = await gbridgeContract.queryFilter(eventFilters);
  return await Promise.all(
    filteredEvents.map(async (event) => {
      return {
        ...event,
        timestamp: (await provider.getBlock(event.blockNumber)).timestamp,
      };
    })
  );
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

export async function getBridgeInEventsWithStatus(
  ethAccount?: string
): Promise<[EventWithTime[], PendingEvent[]]> {
  const completedEvents: EventWithTime[] = [];
  const pendingEvents: PendingEvent[] = [];
  const userBridgeInEvents = await getEthGBridgeInEvents(ethAccount);
  const latestBridgeTransactions = await getLatestGBridgeTransactions(
    ethAccount
  );
  userBridgeInEvents.forEach((event) => {
    const matchedTx = latestBridgeTransactions.find(
      (bridgeTx: DepositEvent) =>
        Number(bridgeTx.block_height) == event.blockNumber
    );
    if (!matchedTx) {
      completedEvents.push(event);
    } else {
      if (matchedTx.confirmed) {
        completedEvents.push(event);
      } else {
        pendingEvents.push({
          ...event,
          secondsUntilConfirmed: matchedTx.seconds_until_confirmed,
        });
      }
    }
  });
  return [completedEvents, pendingEvents];
}

//local interface to prevent use of any type
interface Attribute {
  key: string;
  value: string;
}
export async function getBridgeOutTransactions(cantoAccount?: string) {
  const bridgeOutNetworks = Object.keys(allBridgeOutNetworks).map(
    (key, network) =>
      allBridgeOutNetworks[network as keyof typeof allBridgeOutNetworks].channel
  );
  const bridgeOutData = [];
  const IBC = await (
    await fetch(
      CantoMainnet.cosmosAPIEndpoint +
        "/cosmos/tx/v1beta1/txs?events=fungible_token_packet.sender%3D'" +
        cantoAccount +
        "'",
      // "'&acknowledge_packet.packet_src_channel%3D'channel-0'",
      globalFetchOptions
    )
  ).json();
  for (const tx of IBC.tx_responses) {
    //grab token and amount from each bridge out into gravity bridge
    //@ts-ignore
    const allEvents = tx.logs.map((log) => log.events).flat();
    for (const event of allEvents) {
      if (event.type === "fungible_token_packet") {
        const denom: string = event.attributes.find(
          (att: Attribute) => att.key === "denom"
        )?.value;
        const amount = event.attributes.find(
          (att: Attribute) => att.key === "amount"
        )?.value;
        //sometimes other transaction included with different sender (check here for sender)
        const sender = event.attributes.find(
          (att: Attribute) => att.key === "sender"
        )?.value;
        //"transfer/channel-0/gravity0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" ~ return of denom
        const [type, channel, tokenAddress] = denom.split("/");
        if (
          type == "transfer" &&
          bridgeOutNetworks.includes(channel) &&
          sender == cantoAccount
        ) {
          const token =
            tokenAddress == "uatom"
              ? findGravityToken(tokenAddress)
              : findGravityToken(tokenAddress.slice(7));
          bridgeOutData.push({ token, amount, tx });
        }
      }
    }
  }
  return bridgeOutData;
}

export async function getConvertTransactionsForUser(
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

export function findGravityToken(tokenAddress: string) {
  if (tokenAddress === "uatom") {
    return TOKENS.cantoMainnet.ATOM;
  }
  return ETHMainnet.gravityTokens.find(
    (token) => token.address === tokenAddress
  );
}
export function convertSecondsToString(seconds: string) {
  if (Number(seconds) <= 60) {
    return seconds + "seconds";
  }
  const minutes = Math.ceil(Number(seconds) / 60);
  return minutes + " min";
}
