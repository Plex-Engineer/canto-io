/* eslint-disable */
import { SigningStargateClient } from "@cosmjs/stargate";
import { fromBase64 } from "@cosmjs/encoding";
import { makeAuthInfoBytes, makeSignDoc } from "@cosmjs/proto-signing";
import { Int53 } from "@cosmjs/math";
import { Any } from "cosmjs-types/google/protobuf/any";
import { PubKey } from "cosmjs-types/cosmos/crypto/secp256k1/keys";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { OfflineAminoSigner, OfflineDirectSigner } from "@keplr-wallet/types";
import { Coin, StdFee } from "@cosmjs/stargate";
// import { ibc, getSigningInjectiveClient } from "injectivejs";
import { ALL_BRIDGE_OUT_NETWORKS } from "pages/bridging/config/bridgeOutNetworks";
import { BridgeOutNetworks } from "pages/bridging/config/interfaces";
// import { Long } from "@osmonauts/helpers";
// const { transfer } = ibc.applications.transfer.v1.MessageComposer.withTypeUrl;
// export async function injectiveIBC(
//   signer: OfflineAminoSigner & OfflineDirectSigner,
//   sourceChannel: string,
//   coin: Coin,
//   sender: string,
//   receiver: string,
//   timeoutTimestamp: number
// ) {
//   const client = await getSigningInjectiveClient({
//     rpcEndpoint:
//       ALL_BRIDGE_OUT_NETWORKS[BridgeOutNetworks.INJECTIVE].rpcEndpoint,
//     signer,
//   });
//   console.log(client);
//   const msg = transfer({
//     sourcePort: "transfer",
//     sourceChannel: sourceChannel,
//     token: coin,
//     sender: sender,
//     receiver: receiver,
//     timeoutHeight: { revisionNumber: new Long(0), revisionHeight: new Long(0) },
//     timeoutTimestamp: new Long(timeoutTimestamp),
//   });
//   const fee: StdFee = {
//     amount: [
//       {
//         denom: "inj",
//         amount: "864",
//       },
//     ],
//     gas: "86364",
//   };
//   const reponse = await client.signAndBroadcast(sender, [msg], fee);
//   console.log(reponse);
// }

// export async function modifiedSignEvmos(
//   restEndpoint: string,
//   client: SigningStargateClient, // SigningStargateClient
//   signer: OfflineAminoSigner & OfflineDirectSigner, // keplr OfflineSigner
//   chainId: string,
//   signerAddress: string,
//   sourceChannel: string,
//   coin: Coin,
//   receiver: string,
//   timeoutTimestamp: number,
//   gasDenom: string
// ) {
//   // Query account info, because cosmjs doesn't support Evmos account
//   const resp = await (
//     await fetch(restEndpoint + "/cosmos/auth/v1beta1/accounts/" + signerAddress)
//   ).json();
//   const accountNumber = resp.account.base_account.account_number;
//   const sequence = resp.account.base_account.sequence;

//   console.log(accountNumber, sequence);
//   const accountFromSigner = (await signer.getAccounts()).find(
//     (account) => account.address === signerAddress
//   );
//   if (!accountFromSigner) {
//     throw new Error("Failed to retrieve account from signer");
//   }
//   const pubkeyBytes = accountFromSigner.pubkey;

//   // Custom typeUrl for EVMOS
//   const pubk = Any.fromPartial({
//     typeUrl: "/ethermint.crypto.v1.ethsecp256k1.PubKey",
//     value: PubKey.encode({
//       key: pubkeyBytes,
//     }).finish(),
//   });

//   const msg = transfer({
//     sourcePort: "transfer",
//     sourceChannel: sourceChannel,
//     token: coin,
//     sender: accountFromSigner.address,
//     receiver: receiver,
//     timeoutHeight: { revisionNumber: new Long(0), revisionHeight: new Long(0) },
//     timeoutTimestamp: new Long(timeoutTimestamp),
//   });
//   console.log(msg.typeUrl);
//   const fee: StdFee = {
//     amount: [
//       {
//         denom: gasDenom,
//         amount: "9999",
//       },
//     ],
//     gas: "863600",
//   };

//   const txBodyEncodeObject = {
//     typeUrl: "/cosmos.tx.v1beta1.TxBody",
//     value: {
//       messages: [msg],
//       memo: "ibc transfer",
//     },
//   };
//   const txBodyBytes = client.registry.encode(txBodyEncodeObject);
//   const gasLimit = Int53.fromString(fee.gas).toNumber();
//   const authInfoBytes = makeAuthInfoBytes(
//     [{ pubkey: pubk, sequence }],
//     fee.amount,
//     gasLimit,
//     undefined,
//     undefined
//   );
//   const signDoc = makeSignDoc(
//     txBodyBytes,
//     authInfoBytes,
//     chainId,
//     accountNumber
//   );
//   const { signature, signed } = await signer.signDirect(signerAddress, signDoc);

//   // returns txBytes for broadcast
//   return TxRaw.encode({
//     bodyBytes: signed.bodyBytes,
//     authInfoBytes: signed.authInfoBytes,
//     signatures: [fromBase64(signature.signature)],
//   }).finish();
// }

// export async function generalSendIBC(
//   chainId: string,
//   sourceChannel: string,
//   coin: Coin,
//   sender: string,
//   receiver: string,
//   timeoutTimestamp: number
// ) {
//   const msg = transfer({
//     sourcePort: "transfer",
//     sourceChannel: sourceChannel,
//     token: coin,
//     sender: sender,
//     receiver: receiver,
//     timeoutHeight: { revisionNumber: new Long(0), revisionHeight: new Long(0) },
//     timeoutTimestamp: new Long(timeoutTimestamp),
//   });
//   // const singedMessage = await window.keplr?.signArbitrary(chainId, sender, msg);
// }

// export async function sign(
//   restEndpoint: string,
//   client: SigningStargateClient, // SigningStargateClient
//   signer: OfflineAminoSigner & OfflineDirectSigner, // keplr OfflineSigner
//   chainId: string,
//   signerAddress: string,

//   sourceChannel: string,
//   coin: Coin,
//   receiver: string,
//   timeoutTimestamp: number,
//   gasDenom: string
// ) {
//   console.log(timeoutTimestamp);
//   // Query account info, because cosmjs doesn't support Evmos account
//   const resp = await (
//     await fetch(restEndpoint + "/cosmos/auth/v1beta1/accounts/" + signerAddress)
//   ).json();
//   const accountNumber = resp.account.base_account.account_number;
//   const sequence = 6;

//   console.log(accountNumber, sequence);

//   const accountFromSigner = (await signer.getAccounts()).find(
//     (account) => account.address === signerAddress
//   );
//   if (!accountFromSigner) {
//     throw new Error("Failed to retrieve account from signer");
//   }
//   const pubkeyBytes = accountFromSigner.pubkey;

//   // Custom typeUrl for EVMOS
//   const pubk = Any.fromPartial({
//     typeUrl: "/ethermint.crypto.v1.ethsecp256k1.PubKey",
//     value: PubKey.encode({
//       key: pubkeyBytes,
//     }).finish(),
//   });
//   const msg = transfer({
//     sourcePort: "transfer",
//     sourceChannel: sourceChannel,
//     token: coin,
//     sender: accountFromSigner.address,
//     receiver: receiver,
//     timeoutHeight: {
//       revisionNumber: new Long(timeoutTimestamp).multiply(1000),
//       revisionHeight: new Long(1000000000000000),
//     },
//     timeoutTimestamp: new Long(timeoutTimestamp).multiply(1000000),
//   });

//   const txBodyEncodeObject = {
//     typeUrl: "/cosmos.tx.v1beta1.TxBody",
//     value: {
//       messages: [msg],
//       memo: "memo",
//     },
//   };

//   const fee: StdFee = {
//     amount: [
//       {
//         denom: gasDenom,
//         amount: "9999",
//       },
//     ],
//     gas: "863600",
//   };
//   const txBodyBytes = client.registry.encode(txBodyEncodeObject);
//   const gasLimit = Int53.fromString(fee.gas).toNumber();
//   const authInfoBytes = makeAuthInfoBytes(
//     [{ pubkey: pubk, sequence }],
//     fee.amount,
//     gasLimit,
//     undefined,
//     undefined
//   );
//   const signDoc = makeSignDoc(
//     txBodyBytes,
//     authInfoBytes,
//     chainId,
//     accountNumber
//   );
//   const { signature, signed } = await signer.signDirect(signerAddress, signDoc);

//   // returns txBytes for broadcast
//   return TxRaw.encode({
//     bodyBytes: signed.bodyBytes,
//     authInfoBytes: signed.authInfoBytes,
//     signatures: [fromBase64(signature.signature)],
//   }).finish();
// }

// export async function newEvmosIBC() {
//   const account = await window.keplr.getKey("evmos_9001-2");
//   const pk = Buffer.from(account.pubKey).toString("base64");


// }