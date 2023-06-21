import { generateEndpointBalances } from "@tharsis/provider";
import { BigNumber } from "ethers";
import {
  NativeToken,
  UserNativeToken,
  BasicNativeBalance,
  IBCTokenTrace,
} from "../config/bridgingInterfaces";

const options = {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
};
export async function getNativeCantoBalances(
  nodeAddressIP: string,
  cantoAddress: string,
  nativeTokens: NativeToken[]
): Promise<{
  foundTokens: UserNativeToken[];
  notFoundTokens: BasicNativeBalance[];
}> {
  const url = nodeAddressIP + "/" + generateEndpointBalances(cantoAddress);
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

//denom trace will look something like "transfer/channel-#/transfer/chanel-#/...."
//denom trace is in reverse order (last channel in list is first channel token went through)
//base denom will look something like "uatom"
export interface IBCPathInfo {
  denom_trace: {
    path: string;
    base_denom: string;
  };
  found: boolean;
}
async function getIBCPathAndDenomFromHash(
  nodeAddressIP: string,
  hash: string
): Promise<IBCPathInfo> {
  const url = nodeAddressIP + "/ibc/apps/transfer/v1/denom_traces/" + hash;
  const result = await fetch(url, options);
  if (result.ok) {
    const denomTrace = await result.json();
    return {
      ...denomTrace,
      found: true,
    };
  } else {
    return {
      denom_trace: {
        path: "",
        base_denom: hash,
      },
      found: false,
    };
  }
}
export async function getUnknownIBCTokens(
  tokens: BasicNativeBalance[],
  nodeAddressIP: string
) {
  const ibcPaths: IBCTokenTrace[] = [];
  for (const token of tokens) {
    if (token.denom.slice(0, 4) === "ibc/") {
      ibcPaths.push({
        ...token,
        ibcInfo: await getIBCPathAndDenomFromHash(
          nodeAddressIP,
          token.denom.slice(4)
        ),
      });
    }
  }
  return ibcPaths;
}
