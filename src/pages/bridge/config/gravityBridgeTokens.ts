import { TOKENS } from "global/config/tokenInfo";
import { NativeERC20Tokens } from "./interfaces";

export const gravityTokenBase = [
  TOKENS.GravityBridge.E2H,
  TOKENS.GravityBridge.BYE,
  TOKENS.GravityBridge.MAX,
];

export const mainnetGravityTokensBase = [
  TOKENS.ETHMainnet.USDC,
  TOKENS.ETHMainnet.USDT,
  TOKENS.ETHMainnet.WETH,
];

const IBCTokens = {
  USDC: "ibc/17CD484EE7D9723B847D95015FA3EBD1572FD13BC84FB838F55B18A57450F25B",
  USDT: "ibc/4F6A2DEFEA52CD8D90966ADCB2BD0593D3993AB0DF7F6AEB3EFD6167D79237B0",
  ETH: "ibc/DC186CA7A8C009B43774EBDC825C935CABA9743504CE6037507E6E5CCE12858A",
  ATOM: "ibc/9117A26BA81E29FA4F78F57DC2BD90CD3D26848101BA880445F119B22A1E254E",
};

export const CantoGravityTokens = [
  { ...TOKENS.cantoMainnet.USDT, nativeName: IBCTokens.USDT }, // mapping to the actual native token name,
  { ...TOKENS.cantoMainnet.USDC, nativeName: IBCTokens.USDC },
  { ...TOKENS.cantoMainnet.ETH, nativeName: IBCTokens.ETH },
];

export const ETHGravityTokens = [
  { ...TOKENS.ETHMainnet.USDC, nativeName: IBCTokens.USDC },
  { ...TOKENS.ETHMainnet.USDT, nativeName: IBCTokens.USDT },
  { ...TOKENS.ETHMainnet.WETH, nativeName: IBCTokens.ETH },
];

export const convertCoinTokens: NativeERC20Tokens[] = [
  { ...TOKENS.cantoMainnet.USDT, nativeName: IBCTokens.USDT }, // mapping to the actual native token name,
  { ...TOKENS.cantoMainnet.USDC, nativeName: IBCTokens.USDC },
  { ...TOKENS.cantoMainnet.ETH, nativeName: IBCTokens.ETH },
  { ...TOKENS.cantoMainnet.ATOM, nativeName: IBCTokens.ATOM },
];
