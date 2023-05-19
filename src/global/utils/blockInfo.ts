import { getCurrentProvider } from "./getAddressUtils";

export async function getCurrentBlockTimestamp(chainId: number | undefined) {
  //getting current block timestamp to add to the deadline that the user inputs
  const provider = getCurrentProvider(chainId);
  const blockNumber = await provider.getBlockNumber();
  const blockData = await provider.getBlock(blockNumber);
  return blockData.timestamp;
}
