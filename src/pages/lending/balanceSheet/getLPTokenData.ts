import { ADDRESSES, CantoMainnet, CantoTestnet } from "cantoui";
import { BigNumber, Contract, ethers } from "ethers";
import { routerAbi } from "global/config/abi";
import { MAINPAIRS, TESTPAIRS } from "pages/dexLP/config/pairs";
import { UserLMTokenDetails } from "../config/interfaces";
import { TokenPriceObject } from "./tokenPrices";

export async function getUserLPTokenData(
  chainId: number | undefined,
  LPTokens: UserLMTokenDetails[],
  priceObj: TokenPriceObject[] | undefined
) {
  if (!LPTokens) {
    return;
  }
  const allPairs = chainId == CantoTestnet.chainId ? TESTPAIRS : MAINPAIRS;
  const returnObj = [];
  const providerURL =
    chainId == CantoTestnet.chainId ? CantoTestnet.rpcUrl : CantoMainnet.rpcUrl;
  const provider = new ethers.providers.JsonRpcProvider(providerURL);
  const router =
    chainId == CantoTestnet.chainId
      ? ADDRESSES.testnet.PriceFeed
      : ADDRESSES.cantoMainnet.PriceFeed;
  const contract = new Contract(router, routerAbi, provider);
  for (const userToken of LPTokens) {
    const selectedPair = allPairs.find((pair) => {
      pair.address == userToken.data.underlying.address;
    });
    const res = await contract.quoteRemoveLiquidity(
      selectedPair?.token1.address,
      selectedPair?.token2.address,
      selectedPair?.stable,
      BigNumber.from(1)
    );
    console.log(res);
  }
}
