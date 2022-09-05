export async function getBaseTokenName(chainId: string) {
  const chains = await fetch("https://chainid.network/chains.json").then(
    (response) => response.json()
  );
  const chainToken = chains.find((chain: any) => chain.chainId == chainId);
  return chainToken?.nativeCurrency?.symbol ?? "";
}
