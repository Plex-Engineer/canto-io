import { Token, TOKENS } from "cantoui";
import { ethers } from "ethers";

function createPostOptions(from: string, to: string, amount: string) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ["liquidityZone"]: "canto",
    },
    body: JSON.stringify({
      ["from"]: from,
      ["to"]: to,
      ["fromAmount"]: amount,
    }),
  };
}
const slingShotAPI = "https://slingshot.finance/api/v3/trade";
export interface TokenPriceObject {
  name: string;
  symbol: string;
  address: string;
  priceInNote: string;
}

export async function getTokenPrice(token: Token) {
  if (token.address == TOKENS.cantoMainnet.NOTE.address) {
    return {
      name: token.name,
      symbol: token.symbol,
      address: token.address,
      priceInNote: "1",
    };
  }
  if (token.address == TOKENS.cantoMainnet.CANTO.address) {
    token.address = TOKENS.cantoMainnet.WCANTO.address;
  }
  const response = await fetch(
    slingShotAPI,
    createPostOptions(
      token.address,
      TOKENS.cantoMainnet.NOTE.address,
      ethers.utils.parseUnits("1", token.decimals).toString()
    )
  );
  const prices = await response.json();
  const priceObject: TokenPriceObject = {
    name: token.name,
    symbol: token.symbol,
    address: token.address,
    priceInNote: ethers.utils.formatUnits(prices.estimatedOutput, 18),
  };
  return priceObject;
}
