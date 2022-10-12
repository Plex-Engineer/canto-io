import { ADDRESSES } from "cantoui";
import { Contract, ethers, Event } from "ethers";
import { ETHMainnet } from "pages/bridge/config/networks";
import { gravityabi } from "../config/gravityBridgeAbi";

export async function getAllBridgeTransactionsForUser(
  account?: string
): Promise<[Event[], Event[]]> {
  const provider = new ethers.providers.JsonRpcProvider(ETHMainnet.rpcUrl);
  const gbridgeContract = new Contract(
    ADDRESSES.ETHMainnet.GravityBridge,
    gravityabi,
    provider
  );
  const completedEvents: Event[] = [];
  const pendingEvents: Event[] = [];
  const blockNumber = await provider.getBlockNumber();
  const eventFilters = gbridgeContract.filters.SendToCosmosEvent(null, account);
  const events = await gbridgeContract.queryFilter(eventFilters);
  for (const event of events) {
    if (blockNumber - event.blockNumber > 100) {
      completedEvents.push(event);
    } else {
      pendingEvents.push(event);
    }
  }
  return [completedEvents, pendingEvents];
}

export function findGravityToken(tokenAddress: string) {
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
