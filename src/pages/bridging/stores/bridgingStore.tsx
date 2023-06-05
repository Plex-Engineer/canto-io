import create from "zustand";
import {
  BridgingMethods,
  BridgingNetwork,
  EMPTYNETWORK,
  GravityBridgeNetwork,
  LayerZeroToken,
} from "../config/bridgingInterfaces";
import { Token } from "global/config/interfaces/tokens";
import { TransactionStore } from "global/stores/transactionStore";
import {
  convertAndIbcOutTx,
  oftTransferTx,
  sendToComsosTx,
} from "../utils/transactions";
import { formatUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { NativeToken } from "../config/interfaces";

interface BridgingStore {
  allNetworks: BridgingNetwork[];
  fromNetwork: BridgingNetwork;
  toNetwork: BridgingNetwork;
  setNetwork: (network: BridgingNetwork, isFrom: boolean) => void;
  allTokens: Token[]; //include balances on the tokens
  selectedToken: Token | undefined;
  setToken: (token: Token) => void;
}

const useBridgingStore = create<BridgingStore>((set, get) => ({
  allNetworks: [],
  fromNetwork: EMPTYNETWORK, //defualt will be ETH
  toNetwork: EMPTYNETWORK, //default will be CANTO
  setNetwork: (network, isFrom) => {
    set(isFrom ? { fromNetwork: network } : { toNetwork: network });
    set({
      allTokens: getTokensFromBridgingNetworks(
        get().fromNetwork,
        get().toNetwork
      ),
    });
  },
  allTokens: [],
  selectedToken: undefined,
  setToken: (token) => set({ selectedToken: token }),
}));

function getTokensFromBridgingNetworks(
  from: BridgingNetwork,
  to: BridgingNetwork
) {
  const allTokens = [];
  if (to.isCanto) {
    //BRIDGE IN: look to see how to bridge from the other network
    for (const method of from.supportedBridgeOutMethods) {
      allTokens.push(...(from[method]?.tokens ?? []));
    }
  } else if (from.isCanto) {
    //BRIDGE OUT: look to see how to bridge into other network
    for (const method of to.supportedBridgeInMethods) {
      allTokens.push(...(to[method]?.tokens ?? []));
    }
  }
  return allTokens;
}
async function performBridgeTx(
  txStore: TransactionStore,
  from: BridgingNetwork,
  to: BridgingNetwork,
  token: Token,
  amount: BigNumber
): Promise<boolean> {
  if (!from.isEVM) {
    //this is only for EVM, ibc will be handeled separately through keplr
    return false;
  }
  const tokenDetails = {
    symbol: token.symbol,
    amount: formatUnits(amount, token.decimals),
  };
  if (to.isCanto) {
    //BRIDGE IN
    //the method to bridge must include the token that is selected
    if (doesMethodSupportToken(from, BridgingMethods.GBRIDGE, token)) {
      const gBridgeNetwork = from[
        BridgingMethods.GBRIDGE
      ] as GravityBridgeNetwork;
      return await sendToComsosTx(
        gBridgeNetwork?.chainId,
        txStore,
        gBridgeNetwork?.gravityBridgeAddress,
        gBridgeNetwork?.wethAddress,
        token.address,
        cantoAddress,
        ethAddress,
        amount,
        currentAllowance,
        tokenDetails
      );
    } else if (
      doesMethodSupportToken(from, BridgingMethods.LAYER_ZERO, token)
    ) {
      return await oftTransferTx(
        from[BridgingMethods.LAYER_ZERO]?.chainId,
        txStore,
        true,
        (token as LayerZeroToken).isNative,
        token.address,
        to["Layer Zero"]?.lzChainId,
        amount,
        ethAddress,
        [],
        BigNumber.from(0),
        tokenDetails
      );
    }
  } else if (from.isCanto) {
    if (doesMethodSupportToken(to, BridgingMethods.LAYER_ZERO, token)) {
      return await oftTransferTx(
        from["Layer Zero"].chainId,
        txStore,
        false,
        (token as LayerZeroToken).isNative,
        token.address,
        to["Layer Zero"]?.lzChainId,
        amount,
        ethAddress,
        [],
        BigNumber.from(0),
        tokenDetails
      );
    } else if (doesMethodSupportToken(to, BridgingMethods.IBC, token)) {
      return await convertAndIbcOutTx(
        from.IBC?.evmChainId,
        txStore,
        cantoAddress,
        token.address,
        amount,
        to.IBC,
        toChainAddress,
        (token as NativeToken).ibcDenom,
        tokenDetails
      );
    }
  }
  //neither to and from are CANTO network
  return false;
}

const doesMethodSupportToken = (
  network: BridgingNetwork,
  method: BridgingMethods,
  token: Token
) =>
  network[method]?.tokens.some(
    (t) => t.address.toLowerCase() === token.address.toLowerCase()
  ) ?? false;

export default useBridgingStore;
