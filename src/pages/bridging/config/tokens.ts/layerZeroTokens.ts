import { TOKENS } from "global/config/tokenInfo";
import { LayerZeroToken } from "../bridgingInterfaces";

export const CANTO_OFT = (
  address: string,
  native: boolean
): LayerZeroToken => ({
  ...TOKENS.cantoMainnet.CANTO,
  address,
  isNative: native,
  symbol: native ? "CANTO-OFT" : "CANTO",
  nativeSymbol: "CANTO",
  isOFT: true,
});
