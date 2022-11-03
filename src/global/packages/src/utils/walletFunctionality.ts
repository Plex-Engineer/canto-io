import { CantoMainnet, CantoTestnet } from "global/config/networks";
import { CTOKENS, TOKENS } from "global/config/tokenInfo";

export async function addCantoToKeplr() {
  // Keplr extension injects the offline signer that is compatible with cosmJS.
  // You can get this offline signer from `window.getOfflineSigner(chainId:string)` after load event.
  // And it also injects the helper function to `window.keplr`.
  // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
  //@ts-ignore
  if (!window.getOfflineSigner || !window.keplr) {
    alert("Please install keplr extension");
  } else {
    //@ts-ignore
    if (window.keplr.experimentalSuggestChain) {
      try {
        // Keplr v0.6.4 introduces an experimental feature that supports the feature to suggests the chain from a webpage.
        // ccantoshub-3 is integrated to Keplr so the code should return without errors.
        // The code below is not needed for ccantoshub-3, but may be helpful if you’re adding a custom chain.
        // If the user approves, the chain will be added to the user's Keplr extension.
        // If the user rejects it or the suggested chain information doesn't include the required fields, it will throw an error.
        // If the same chain id is already registered, it will resolve and not require the user interactions.
        //@ts-ignore
        await window.keplr.experimentalSuggestChain({
          // Chain-id of the cantosis chain.
          chainId: "canto_7700-1",
          // The name of the chain to be displayed to the user.
          chainName: "Canto Mainnet",
          // RPC endpoint of the chain. In this case we are using blockapsis, as it's accepts connections from any host currently. No Cors limitations.
          rpc: "http://164.90.154.41:26657",
          // REST endpoint of the chain.
          rest: "http://164.90.154.41:1317",
          // Staking coin information
          stakeCurrency: {
            // Coin denomination to be displayed to the user.
            coinDenom: "CANTO",
            // Actual denom (i.e. uatom, uscrt) used by the blockchain.
            coinMinimalDenom: "acanto",
            // # of decimal points to convert minimal denomination to user-facing denomination.
            coinDecimals: 18,
            // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
            // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
            coinGeckoId: "canto",
          },
          // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
          // The 'stake' button in Keplr extension will link to the webpage.
          // walletUrlForStaking: "",
          // The BIP44 path.
          bip44: {
            // You can only set the coin type of BIP44.
            // 'Purpose' is fixed to 44.
            coinType: 60,
          },
          // Bech32 configuration to show the address to user.
          // This field is the interface of
          // {
          //   bech32PrefixAccAddr: string;
          //   bech32PrefixAccPub: string;
          //   bech32PrefixValAddr: string;
          //   bech32PrefixValPub: string;
          //   bech32PrefixConsAddr: string;
          //   bech32PrefixConsPub: string;
          // }
          bech32Config: {
            bech32PrefixAccAddr: "canto",
            bech32PrefixAccPub: "cantopub",
            bech32PrefixValAddr: "cantovaloper",
            bech32PrefixValPub: "cantovaloperpub",
            bech32PrefixConsAddr: "cantovalcons",
            bech32PrefixConsPub: "cantovalconspub",
          },
          // List of all coin/tokens used in this chain.
          currencies: [
            {
              // Coin denomination to be displayed to the user.
              coinDenom: "CANTO",
              // Actual denom (i.e. uatom, uscrt) used by the blockchain.
              coinMinimalDenom: "acanto",
              // # of decimal points to convert minimal denomination to user-facing denomination.
              coinDecimals: 18,
              // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
              // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
              coinGeckoId: "canto",
            },
          ],
          // List of coin/tokens used as a fee token in this chain.
          feeCurrencies: [
            {
              // Coin denomination to be displayed to the user.
              coinDenom: "CANTO",
              // Actual denom (i.e. ucanto, uscrt) used by the blockchain.
              coinMinimalDenom: "acanto",
              // # of decimal points to convert minimal denomination to user-facing denomination.
              coinDecimals: 18,
              // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
              // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
              coinGeckoId: "canto",
              gasPriceStep: {
                low: 125000000000,
                average: 250000000000,
                high: 375000000000,
              },
            },
          ],
          // (Optional) The number of the coin type.
          // This field is only used to fetch the address from ENS.
          // Ideally, it is recommended to be the same with BIP44 path's coin type.
          // However, some early chains may choose to use the Ccantos Hub BIP44 path of '118'.
          // So, this is separated to support such chains.
          coinType: 60,
          // (Optional) This is used to set the fee of the transaction.
          // If this field is not provided, Keplr extension will set the default gas price as (low: 0.01, average: 0.025, high: 0.04).
          // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
          // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.

          features: [
            "ibc-transfer",
            "ibc-go",
            "eth-address-gen",
            "eth-key-sign",
          ],
        });
      } catch {
        alert("Failed to suggest the chain");
      }
    } else {
      alert("Please use the recent version of keplr extension");
    }
  }

  const chainId = "canto_7700-1";

  // You should request Keplr to enable the wallet.
  // This method will ask the user whether or not to allow access if they haven't visited this website.
  // Also, it will request user to unlock the wallet if the wallet is locked.
  // If you don't request enabling before usage, there is no guarantee that other methods will work.
  //@ts-ignore
  await window.keplr.enable(chainId);

  //@ts-ignore
  const offlineSigner = window.getOfflineSigner(chainId);

  // You can get the address/public keys by `getAccounts` method.
  // It can return the array of address/public key.
  // But, currently, Keplr extension manages only one address/public key pair.
  // XXX: This line is needed to set the sender address for SigningCcantosClient.
  const accounts = await offlineSigner.getAccounts();

  // Initialize the gaia api with the offline signer that is injected by Keplr extension.
  // const cosmJS = new SigningCosmosClient(
  //     "https://rpc-cantosis.blockapsis.com",
  //     accounts[0].address,
  //     offlineSigner,
  // );

  //document.getElementById("address").append(accounts[0].address);
}

export async function addTokens(chainId: number | undefined) {
  if (
    !chainId ||
    !(chainId == CantoMainnet.chainId || chainId == CantoTestnet.chainId)
  ) {
    return;
  }
  const tokens =
    chainId == CantoTestnet.chainId ? TOKENS.cantoTestnet : TOKENS.cantoMainnet;
  for (const [name, tokenObj] of Object.entries(tokens)) {
    try {
      if (tokenObj.name != "Canto") {
        //@ts-ignore
        ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              address: tokenObj.address, // The address that the token is at.
              symbol: tokenObj.symbol.slice(0, 11), // A ticker symbol or shorthand, up to 5 chars.
              decimals: tokenObj.decimals, // The number of decimals in the token
              image: tokenObj.icon, // A string url of the token logo
            },
          },
        });
      }
    } catch (error) {
      // console.log(error)
    }
  }
}

export async function addCTokens(chainId: number | undefined) {
  if (
    !chainId ||
    !(chainId == CantoMainnet.chainId || chainId == CantoTestnet.chainId)
  ) {
    return;
  }
  const cTokens =
    chainId == CantoTestnet.chainId
      ? CTOKENS.cantoTestnet
      : CTOKENS.cantoMainnet;

  for (const [name, tokenObj] of Object.entries(cTokens)) {
    try {
      if (tokenObj.name != "Canto") {
        //@ts-ignore
        ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              address: tokenObj.address, // The address that the token is at.
              symbol: tokenObj.symbol.slice(0, 11), // A ticker symbol or shorthand, up to 5 chars.
              decimals: tokenObj.decimals, // The number of decimals in the token
              image: tokenObj.underlying.icon, // A string url of the token logo
            },
          },
        });
      }
    } catch (error) {
      // console.log(error)
    }
  }
}
