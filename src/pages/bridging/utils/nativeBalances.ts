import { generateEndpointBalances } from "@tharsis/provider";
import { BigNumber } from "ethers";
import { NativeToken, UserNativeToken } from "../config/interfaces";

interface NativeTokenResponse {
  denom: string;
  amount: string;
}
export async function getNativeCantoBalances(
  nodeAddressIP: string,
  cantoAddress: string,
  nativeTokens: NativeToken[]
): Promise<UserNativeToken[]> {
  const url = nodeAddressIP + "/" + generateEndpointBalances(cantoAddress);
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };
  const result = await fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      return result["balances"];
    })
    .catch((err) => {
      console.error(err);
    });
  return nativeTokens.map((token) => {
    return {
      ...token,
      nativeBalance: BigNumber.from(
        result
          ? result.find(
              (data: NativeTokenResponse) => data.denom == token.ibcDenom
            )?.amount ?? 0
          : 0
      ),
    };
  });
}
