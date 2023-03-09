import { Token, TOKENS } from "global/config/tokenInfo";
import { BridgeOutNetworks } from "./bridgeOutNetworks";
import { NativeToken } from "./interfaces";

const ETH_GRAVITY_BRIDGE_IN_TOKENS: Token[] = [
  TOKENS.ETHMainnet.USDC,
  TOKENS.ETHMainnet.USDT,
  TOKENS.ETHMainnet.WETH,
];
const ALL_IBC_DENOMS = {
  USDC: "ibc/17CD484EE7D9723B847D95015FA3EBD1572FD13BC84FB838F55B18A57450F25B",
  USDT: "ibc/4F6A2DEFEA52CD8D90966ADCB2BD0593D3993AB0DF7F6AEB3EFD6167D79237B0",
  ETH: "ibc/DC186CA7A8C009B43774EBDC825C935CABA9743504CE6037507E6E5CCE12858A",
  ATOM: "ibc/9117A26BA81E29FA4F78F57DC2BD90CD3D26848101BA880445F119B22A1E254E",

  SOMM: "ibc/E341F178AB30AC89CF18B9559D90EF830419B5A4B50945EF800FD68DE840A91E",
  GRAV: "ibc/FC9D92EC12BC974E8B6179D411351524CD5C2EBC3CE29D5BA856414FEFA47093",
  AKASH: "ibc/C7B08BE4C7765726030DF899C78DE8FC8DFA6B580920B18AE04A3A70447BE299",
  OSMOSIS:
    "ibc/D24B4564BCD51D3D02D9987D92571EAC5915676A9BD6D9B0C1D0254CB8A5EA34",
  CRESCENT:
    "ibc/31DCE745EBDFBB19710DF9B1B2D2378183DDB9216EA42750AD1E246CF4A6040B",
  KAVA: "ibc/147B3FF1D005512CCE4089559AF5D0C951F4211A031F15E782E505B85022DF89",
  INJECTIVE:
    "ibc/4E790C04E6F00F971251E227AEA8E19A5AD274BFE18253EF0EDD7707D8AF1F7C",
  COMDEX:
    "ibc/B0ADAE6558A3E9B2B49FF2EA89A9AEA312431FEB51FCF73650C8C90589F5149B",
};
export type IBCTOKENS = {
  [index: string]: NativeToken;
};
const ALL_IBC_TOKENS_WITH_DENOMS: IBCTOKENS = {
  USDT: {
    ...TOKENS.cantoMainnet.USDT,
    ibcDenom: ALL_IBC_DENOMS.USDT,
    nativeName: "gravity" + TOKENS.ETHMainnet.USDT.address,
    supportedOutChannels: [BridgeOutNetworks.GRAVITY_BRIDGE],
  },
  USDC: {
    ...TOKENS.cantoMainnet.USDC,
    ibcDenom: ALL_IBC_DENOMS.USDC,
    nativeName: "gravity" + TOKENS.ETHMainnet.USDC.address,
    supportedOutChannels: [BridgeOutNetworks.GRAVITY_BRIDGE],
  },
  ETH: {
    ...TOKENS.cantoMainnet.ETH,
    ibcDenom: ALL_IBC_DENOMS.ETH,
    nativeName: "gravity" + TOKENS.ETHMainnet.WETH.address,
    supportedOutChannels: [BridgeOutNetworks.GRAVITY_BRIDGE],
  },
  ATOM: {
    ...TOKENS.cantoMainnet.ATOM,
    ibcDenom: ALL_IBC_DENOMS.ATOM,
    nativeName: "uatom",
    supportedOutChannels: [BridgeOutNetworks.COSMOS_HUB],
  },
  SOMM: {
    ...TOKENS.cantoMainnet.SOMM,
    ibcDenom: ALL_IBC_DENOMS.SOMM,
    nativeName: "usomm",
    supportedOutChannels: [BridgeOutNetworks.SOMMELIER],
  },
  GRAV: {
    ...TOKENS.cantoMainnet.GRAV,
    ibcDenom: ALL_IBC_DENOMS.GRAV,
    nativeName: "ugraviton",
    supportedOutChannels: [BridgeOutNetworks.GRAVITY_BRIDGE],
  },
  AKASH: {
    ...TOKENS.cantoMainnet.AKASH,
    ibcDenom: ALL_IBC_DENOMS.AKASH,
    nativeName: "uakt",
    supportedOutChannels: [BridgeOutNetworks.AKASH],
  },
  OSMOSIS: {
    ...TOKENS.cantoMainnet.OSMOSIS,
    ibcDenom: ALL_IBC_DENOMS.OSMOSIS,
    nativeName: "uosmo",
    supportedOutChannels: [BridgeOutNetworks.OSMOSIS],
  },
  CRESCENT: {
    ...TOKENS.cantoMainnet.CRESCENT,
    ibcDenom: ALL_IBC_DENOMS.CRESCENT,
    nativeName: "ucre",
    supportedOutChannels: [BridgeOutNetworks.CRESCENT],
  },
  KAVA: {
    ...TOKENS.cantoMainnet.KAVA,
    ibcDenom: ALL_IBC_DENOMS.KAVA,
    nativeName: "ukava",
    supportedOutChannels: [BridgeOutNetworks.KAVA],
  },
  INJECTIVE: {
    ...TOKENS.cantoMainnet.INJECTIVE,
    ibcDenom: ALL_IBC_DENOMS.INJECTIVE,
    nativeName: "inj",
    supportedOutChannels: [BridgeOutNetworks.INJECTIVE],
  },
  COMDEX: {
    ...TOKENS.cantoMainnet.COMDEX,
    ibcDenom: ALL_IBC_DENOMS.COMDEX,
    nativeName: "ucmdx",
    supportedOutChannels: [BridgeOutNetworks.COMDEX],
  },
};

const CONVERT_COIN_TOKENS: NativeToken[] = [
  ALL_IBC_TOKENS_WITH_DENOMS.USDT,
  ALL_IBC_TOKENS_WITH_DENOMS.USDC,
  ALL_IBC_TOKENS_WITH_DENOMS.ETH,
  ALL_IBC_TOKENS_WITH_DENOMS.ATOM,

  ALL_IBC_TOKENS_WITH_DENOMS.SOMM,
  ALL_IBC_TOKENS_WITH_DENOMS.GRAV,
  ALL_IBC_TOKENS_WITH_DENOMS.AKASH,
  ALL_IBC_TOKENS_WITH_DENOMS.OSMOSIS,
  ALL_IBC_TOKENS_WITH_DENOMS.CRESCENT,
  ALL_IBC_TOKENS_WITH_DENOMS.KAVA,
  ALL_IBC_TOKENS_WITH_DENOMS.INJECTIVE,
  ALL_IBC_TOKENS_WITH_DENOMS.COMDEX,
];

const TEST_GRAVITY_TOKENS = [
  TOKENS.GravityBridge.E2H,
  TOKENS.GravityBridge.BYE,
  TOKENS.GravityBridge.MAX,
];

export {
  ETH_GRAVITY_BRIDGE_IN_TOKENS,
  CONVERT_COIN_TOKENS,
  TEST_GRAVITY_TOKENS,
  ALL_IBC_TOKENS_WITH_DENOMS,
};
