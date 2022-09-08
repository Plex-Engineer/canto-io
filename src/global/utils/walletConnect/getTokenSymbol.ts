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
  name: string;
  chain: string;
  icon: string;
  rpc: string[];
  faucets: string[];
  nativeCurrency: { name: string; symbol: string; decimals: number };
  infoURL: string;
  shortName: string;
  chainId: number;
  networkId: number;
  slip44: number;
  ens: { registry: string };
  explorers: string[];
}
