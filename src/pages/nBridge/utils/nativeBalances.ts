import { generateEndpointBalances } from "@tharsis/provider";
import { BigNumber } from "ethers";
import { UserGravityTokens, UserNativeGTokens } from "../config/interfaces";

export async function getNativeCantoBalance(
  nodeAddressIP: string,
  cantoAddress: string,
  gravityTokens: UserGravityTokens[]
): Promise<UserNativeGTokens[]> {
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
  return gravityTokens.map((token) => {
    return {
      ...token,
      nativeBalanceOf: BigNumber.from(
        result.find((data: any) => data.denom == token.data.nativeName)
          ?.amount ?? 0
      ),
    };
  });
}
