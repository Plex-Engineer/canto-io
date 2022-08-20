import { generateEndpointAccount } from '@tharsis/provider';
import { createMessageSend } from '@tharsis/transactions';
import { CantoMainnet } from 'cantoui';
import { chain, fee, memo } from 'config/networks';
import { getSenderObj, signAndBroadcastTxMsg } from './IBC/signAndBroadcast';




export async function checkPubKey(bech32Address : string) {
    const endPointAccount = generateEndpointAccount(bech32Address);
    
    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
    try {
        const addressRawData = await fetch(
           CantoMainnet.cosmosAPIEndpoint + endPointAccount,
            options
        );
        const addressData = await addressRawData.json();
        return addressData['account']['base_account']['pub_key'] != null
    } catch {
        return false;
    }
}
export async function getCantoAddressFromMetaMask(address: string | undefined) {
    const nodeURLMain = CantoMainnet.cosmosAPIEndpoint;
    const result = await fetch(
      nodeURLMain + "/ethermint/evm/v1/cosmos_account/" + address,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    console.log("setting canto address");
    let cosmosAddress = (await result.json()).cosmos_address;
    return cosmosAddress;
}

export async function generatePubKey(hexAddress: string | undefined, setIsSuccess : (s :string) => void) {
  const botAddress = "canto1efrhdukv096tmjs7r80m8pqkr3udp9g0uadjfv";
  if (hexAddress === undefined) {
    setIsSuccess("please connect your metamask to this page...");
    return;
  }
  setIsSuccess("please wait...");

  const bech32Address = await getCantoAddressFromMetaMask(hexAddress);

  const hasPubKey = await checkPubKey(bech32Address);
  if (hasPubKey) {
    setIsSuccess("user already has a public key for account: " + hexAddress);
    return;
  }

  // await bot call
  const botResponse = await callBot(bech32Address);

  // await generate pub key
  setIsSuccess("waiting for the metamask transaction to be signed...");
  const response = await txSend(botAddress, hexAddress, bech32Address, "1"); // await txSend to bot
  setIsSuccess("generating account...");
  const wrapper = async () => {
    const hasPubKey = await checkPubKey(bech32Address);
    if (hasPubKey) {
      setIsSuccess("account successfully generated!");
      window.location.reload();
    } else {
      setIsSuccess("public key generatation was unsuccessful");
    }
  };
  setTimeout(wrapper, 8000);
}


async function callBot(cantoAddress: string) {
  const CANTO_BOT_URL = "https://bot.plexnode.wtf/";
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Request-Headers": "Content-Type, Authorization",
			"Access-Control-Allow-Origin": "true",
		},
		body: JSON.stringify({
			cantoAddress: cantoAddress,
		}),
	};

	const result = await fetch(CANTO_BOT_URL, options);
	return result;
}
export async function txSend(
	destinationBech32:string,
	senderHexAddress:string,
	senderBech32address:string,
	amount :string
) {
	const senderObj = await getSenderObj(senderHexAddress, CantoMainnet.cosmosAPIEndpoint);
	const params = {
		destinationAddress: destinationBech32,
		amount: amount,
		denom: "acanto",
	};
	const msg = createMessageSend(chain, senderObj, fee, memo, params);
	return signAndBroadcastTxMsg(msg, senderObj, chain, CantoMainnet.cosmosAPIEndpoint, senderHexAddress);
}