import { generateEndpointBalances } from "@tharsis/provider";
import { BigNumber } from "ethers";
import { NativeERC20Tokens, UserNativeTokens } from "../config/interfaces";

export async function getNativeCantoBalance(
  nodeAddressIP: string,
  cantoAddress: string,
  nativeTokens: NativeERC20Tokens[]
): Promise<UserNativeTokens[]> {
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
      console.log(err);
    });
  return nativeTokens.map((token) => {
    return {
      ...token,
      wallet: cantoAddress,
      nativeBalance: BigNumber.from(
        result.find((data: any) => data.denom == token.nativeName)?.amount ?? 0
      ),
    };
  });
}
