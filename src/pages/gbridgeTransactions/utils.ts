import { ADDRESSES } from "cantoui";
import { Contract, ethers } from "ethers";
import { ETHMainnet } from "pages/bridge/config/networks";
import { gravityabi } from "./gravityBridgeAbi";

export async function getAllBridgeTransactionsForUser(
  account?: string
): Promise<[any[], number]> {
  const provider = new ethers.providers.JsonRpcProvider(ETHMainnet.rpcUrl);
  const gbridgeContract = new Contract(
    ADDRESSES.ETHMainnet.GravityBridge,
    gravityabi,
    provider
  );
  const blockNumber = await provider.getBlockNumber();
  const eventFilters = gbridgeContract.filters.SendToCosmosEvent(null, account);
  const events = await gbridgeContract.queryFilter(eventFilters);
  return [events, blockNumber];
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
