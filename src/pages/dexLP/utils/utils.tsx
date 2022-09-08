import { CantoMainnet, CantoTestnet } from "cantoui";
import { ethers } from "ethers";
import { truncateNumber } from "global/utils/utils";

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

export function calculateExpectedShareofLP(
  expectedLPOut: string,
  currentLP: string,
  totalLP: string
) {
  return (
    ((Number(expectedLPOut) + Number(currentLP)) /
      (Number(expectedLPOut) + Number(totalLP))) *
    100
  );
}

//getting token limits when additing liquidity

export function getToken1Limit(
  balanceA: number,
  balanceB: number,
  ratio: number
) {
  if (getTokenAFromB(balanceB, ratio) > balanceA) {
    return truncateNumber(balanceA.toString());
  } else {
    return truncateNumber(getTokenAFromB(balanceB, ratio).toString());
  }
}

export function getToken2Limit(
  balanceA: number,
  balanceB: number,
  ratio: number
) {
  if (getTokenBFromA(balanceA, ratio) > balanceB) {
    return truncateNumber(balanceB.toString());
  } else {
    return truncateNumber(getTokenBFromA(balanceA, ratio).toString());
  }
}
