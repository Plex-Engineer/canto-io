export async function getBaseTokenName(chainId: string) {
  const chains = await fetch("https://chainid.network/chains.json").then(
    (response) => response.json()
  );
  const chainToken = chains.find(
    (chain: ChainInfo) => chain.chainId == Number(chainId)
  );
  return chainToken?.nativeCurrency?.symbol ?? "";
}

interface ChainInfo {
  nativeCurrency: { name: string; symbol: string; decimals: number };
  chainId: number;
}
