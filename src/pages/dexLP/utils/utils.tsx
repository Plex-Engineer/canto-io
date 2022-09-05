import { CantoMainnet, CantoTestnet } from "cantoui";
import { ethers } from "ethers";

export function getTokenBFromA(tokenAAmount: number, ratio: number): number {
  return tokenAAmount / ratio;
}

export function getTokenAFromB(tokenBAmount: number, ratio: number): number {
  return tokenBAmount * ratio;
}

export async function getCurrentBlockTimestamp(chainId: number | undefined) {
  //getting current block timestamp to add to the deadline that the user inputs
  const provider = new ethers.providers.JsonRpcProvider(
    CantoTestnet.chainId == chainId ? CantoTestnet.rpcUrl : CantoMainnet.rpcUrl
  );
  const blockNumber = await provider.getBlockNumber();
  const blockData = await provider.getBlock(blockNumber);
  return blockData.timestamp;
}
