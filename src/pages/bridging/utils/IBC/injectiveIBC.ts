// import {
//   ChainGrpcBankApi,
//   ChainRestTendermintApi,
//   makeTimeoutTimestampInNs,
//   MsgBroadcasterWithPk,
//   MsgTransfer,
// } from "@injectivelabs/sdk-ts";
// import {
//   cosmosNativeDenomsFromChainId,
//   TokenService,
//   UiBankTransformer,
// } from "@injectivelabs/sdk-ui-ts";
// import {
// //   getEndpointsFromChainId,
// //   WalletStrategy,
// } from "@injectivelabs/wallet-ts";
// import { BigNumberInBase } from "@injectivelabs/utils";
// import { ChainId, CosmosChainId } from "@injectivelabs/ts-types";
// import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
// import { IbcToken, Token } from "@injectivelabs/token-metadata";
export const inj = "inj";

// const tokenService = new TokenService({
//   chainId: ChainId.Mainnet,
//   network: Network.Mainnet,
// });

// const destinationChainId = CosmosChainId["Canto"];
// const injectiveChainId = CosmosChainId["Injective"];

// const endpointsForNetwork = getNetworkEndpoints(Network.Mainnet);
// const bankService = new ChainGrpcBankApi(endpointsForNetwork.grpc);

// // fetch ibc assets in bank module and format to token
// const { supply } = await bankService.fetchTotalSupply();
// const uiSupply = UiBankTransformer.supplyToUiSupply(supply);
// const ibcSupplyWithToken = (await tokenService.getIbcSupplyWithToken(
//   uiSupply.ibcBankSupply
// )) as IbcToken[];

// /* get metadata for canonical denoms available for transfer between chains */
// const cosmosHubBaseDenom = "acanto";
// const tokenMeta = cosmosNativeDenomsFromChainId[destinationChainId];
// const atomToken = (
//   Array.isArray(tokenMeta)
//     ? tokenMeta.find((token) => token.denom === cosmosHubBaseDenom)
//     : tokenMeta
// ) as Token;

// /* find the ibd denom hash for the canonical denom */
// const injectiveToCosmosHubChannelId = "channel-99";
// const atomDenomFromSupply = ibcSupplyWithToken.find(
//   ({ channelId, baseDenom }) =>
//     channelId === injectiveToCosmosHubChannelId && baseDenom === atomToken.denom
// ) as IbcToken;
// const canonicalDenomHash = atomDenomFromSupply.denom;

// /* format amount for transfer */
// const amount = {
//   denom: canonicalDenomHash,
//   amount: new BigNumberInBase(0.001)
//     .toWei(atomDenomFromSupply.decimals)
//     .toString(),
// };

// const injectiveAddress = "inj...";
// const destinationAddress = "cosmos...";
// const port = "transfer";
// const timeoutTimestamp = makeTimeoutTimestampInNs();

// /* get the latestBlock from the origin chain */
// const endpointsForChainId = getEndpointsFromChainId(injectiveChainId);
// const tendermintRestApi = new ChainRestTendermintApi(endpointsForChainId.rest);

// /* Block details from the origin chain */
// const latestBlock = await tendermintRestApi.fetchLatestBlock();
// const latestHeight = latestBlock.header.height;
// const timeoutHeight = new BigNumberInBase(latestHeight).plus(
//   30 // default block timeout height
// );

// /* create message in proto format */
// const msg = MsgTransfer.fromJSON({
//   port,
//   memo: `IBC transfer from ${injectiveChainId} to ${destinationChainId}`,
//   sender: injectiveAddress,
//   receiver: destinationAddress,
//   channelId: injectiveToCosmosHubChannelId,
//   timeout: timeoutTimestamp,
//   height: {
//     revisionHeight: timeoutHeight.toNumber(),
//     revisionNumber: parseInt(latestBlock.header.version.block, 10),
//   },
//   amount,
// });

// const privateKey = "0x...";

// /* broadcast transaction */
// const txHash = await new MsgBroadcasterWithPk({
//   privateKey,
//   chainId: ChainId.Mainnet,
//   endpoints: endpointsForNetwork,
// }).broadcast({
//   msgs: msg,
//   injectiveAddress,
// });

// console.log(txHash);

// export async function ibcInjective(injectiveAddress: string) {
//   const walletStrategy = new WalletStrategy({
//     chainId: ChainId.Mainnet,
//   });
//   const pubKey = walletStrategy.getPubKey();
//   console.log(pubKey);
//   /* create message in proto format */
//   const msg = MsgTransfer.fromJSON({
//     port,
//     memo: `IBC transfer from ${injectiveChainId} to ${destinationChainId}`,
//     sender: injectiveAddress,
//     receiver: destinationAddress,
//     channelId: injectiveToCosmosHubChannelId,
//     timeout: timeoutTimestamp,
//     height: {
//       revisionHeight: timeoutHeight.toNumber(),
//       revisionNumber: parseInt(latestBlock.header.version.block, 10),
//     },
//     amount,
//   });
//   const resp = await walletStrategy.signCosmosTransaction({
//     txRaw: 0,
//   });
// }
