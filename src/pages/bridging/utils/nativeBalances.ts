import { generateEndpointBalances } from "@tharsis/provider";
import { BigNumber } from "ethers";
import {
  BasicNativeBalance,
  NativeToken,
  UserNativeToken,
} from "../config/interfaces";

interface NativeTokenResponse {
  denom: string;
  amount: string;
}
export async function getNativeCantoBalances(
  nodeAddressIP: string,
  cantoAddress: string,
  nativeTokens: NativeToken[]
): Promise<{
  foundTokens: UserNativeToken[];
  notFoundTokens: BasicNativeBalance[];
}> {
  const url = nodeAddressIP + "/" + generateEndpointBalances(cantoAddress);
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };
  const results = await fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      return result["balances"];
    })
    .catch((err) => {
      console.error(err);
    });
  const foundTokens: UserNativeToken[] = [];
  const notFoundTokens: BasicNativeBalance[] = [];
  for (const result of results) {
    const foundToken = nativeTokens.find(
      (token) => token.ibcDenom === result.denom
    );
    if (foundToken) {
      foundTokens.push({
        ...foundToken,
        nativeBalance: BigNumber.from(result.amount ?? 0),
      });
    } else {
      notFoundTokens.push(result);
    }
  }
  return { foundTokens, notFoundTokens };
}
