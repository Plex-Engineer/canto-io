import { TOKENS } from "global/config/tokenInfo";
import { BridgeOutNetworks, NativeToken } from "./interfaces";
import { Token } from "global/config/interfaces/tokens";

const ETH_GRAVITY_BRIDGE_IN_TOKENS: Token[] = [
  TOKENS.ETHMainnet.USDC,
  TOKENS.ETHMainnet.USDT,
  TOKENS.ETHMainnet.WETH,
  TOKENS.ETHMainnet.WSTETH,
];

type IBCTOKENS = {
  [index: string]: NativeToken;
};
const ALL_IBC_TOKENS_WITH_DENOMS: IBCTOKENS = {
  USDT: {
    ...TOKENS.cantoMainnet.USDT,
    ibcDenom:
      "ibc/4F6A2DEFEA52CD8D90966ADCB2BD0593D3993AB0DF7F6AEB3EFD6167D79237B0",
    nativeName: "gravity" + TOKENS.ETHMainnet.USDT.address,
    supportedOutChannels: [BridgeOutNetworks.GRAVITY_BRIDGE],
  },
  USDC: {
    ...TOKENS.cantoMainnet.USDC,
    ibcDenom:
      "ibc/17CD484EE7D9723B847D95015FA3EBD1572FD13BC84FB838F55B18A57450F25B",
    nativeName: "gravity" + TOKENS.ETHMainnet.USDC.address,
    supportedOutChannels: [BridgeOutNetworks.GRAVITY_BRIDGE],
  },
  ETH: {
    ...TOKENS.cantoMainnet.ETH,
    ibcDenom:
      "ibc/DC186CA7A8C009B43774EBDC825C935CABA9743504CE6037507E6E5CCE12858A",
    nativeName: "gravity" + TOKENS.ETHMainnet.WETH.address,
    supportedOutChannels: [BridgeOutNetworks.GRAVITY_BRIDGE],
  },
  WSTETH: {
    ...TOKENS.cantoMainnet.WSTETH,
    ibcDenom:
      "ibc/35D050E2A1F7BEAFA783A4A4739DC802A6797E59041341D78D88F5B754948604",
    nativeName: "gravity" + TOKENS.ETHMainnet.WSTETH.address,
    supportedOutChannels: [BridgeOutNetworks.GRAVITY_BRIDGE],
  },
  ATOM: {
    ...TOKENS.cantoMainnet.ATOM,
    ibcDenom:
      "ibc/9117A26BA81E29FA4F78F57DC2BD90CD3D26848101BA880445F119B22A1E254E",
    nativeName: "uatom",
    supportedOutChannels: [BridgeOutNetworks.COSMOS_HUB],
  },
  SOMM: {
    ...TOKENS.cantoMainnet.SOMM,
    ibcDenom:
      "ibc/E341F178AB30AC89CF18B9559D90EF830419B5A4B50945EF800FD68DE840A91E",
    nativeName: "usomm",
    supportedOutChannels: [BridgeOutNetworks.SOMMELIER],
  },
  GRAV: {
    ...TOKENS.cantoMainnet.GRAV,
    ibcDenom:
      "ibc/FC9D92EC12BC974E8B6179D411351524CD5C2EBC3CE29D5BA856414FEFA47093",
    nativeName: "ugraviton",
    supportedOutChannels: [BridgeOutNetworks.GRAVITY_BRIDGE],
  },
  AKASH: {
    ...TOKENS.cantoMainnet.AKASH,
    ibcDenom:
      "ibc/C7B08BE4C7765726030DF899C78DE8FC8DFA6B580920B18AE04A3A70447BE299",
    nativeName: "uakt",
    supportedOutChannels: [BridgeOutNetworks.AKASH],
  },
  OSMOSIS: {
    ...TOKENS.cantoMainnet.OSMOSIS,
    ibcDenom:
      "ibc/D24B4564BCD51D3D02D9987D92571EAC5915676A9BD6D9B0C1D0254CB8A5EA34",
    nativeName: "uosmo",
    supportedOutChannels: [BridgeOutNetworks.OSMOSIS],
  },
  CRESCENT: {
    ...TOKENS.cantoMainnet.CRESCENT,
    ibcDenom:
      "ibc/31DCE745EBDFBB19710DF9B1B2D2378183DDB9216EA42750AD1E246CF4A6040B",
    nativeName: "ucre",
    supportedOutChannels: [BridgeOutNetworks.CRESCENT],
  },
  KAVA: {
    ...TOKENS.cantoMainnet.KAVA,
    ibcDenom:
      "ibc/147B3FF1D005512CCE4089559AF5D0C951F4211A031F15E782E505B85022DF89",
    nativeName: "ukava",
    supportedOutChannels: [BridgeOutNetworks.KAVA],
  },
  INJECTIVE: {
    ...TOKENS.cantoMainnet.INJECTIVE,
    ibcDenom:
      "ibc/4E790C04E6F00F971251E227AEA8E19A5AD274BFE18253EF0EDD7707D8AF1F7C",
    nativeName: "inj",
    supportedOutChannels: [BridgeOutNetworks.INJECTIVE],
  },
  COMDEX: {
    ...TOKENS.cantoMainnet.COMDEX,
    ibcDenom:
      "ibc/B0ADAE6558A3E9B2B49FF2EA89A9AEA312431FEB51FCF73650C8C90589F5149B",
    nativeName: "ucmdx",
    supportedOutChannels: [BridgeOutNetworks.COMDEX],
  },
  SENTINAL: {
    ...TOKENS.cantoMainnet.SENTINAL,
    ibcDenom:
      "ibc/57D140BD8A4232F69E6A9121106985BC07BAA69B15B45299C19507A7AF9D1D51",
    nativeName: "udvpn",
    supportedOutChannels: [BridgeOutNetworks.SENTINEL],
  },
  EVMOS: {
    ...TOKENS.cantoMainnet.EVMOS,
    ibcDenom:
      "ibc/ADD4A1A9CCE546D83048328686F31E089BC1154552B96A50A2BD3377B0FE4C49",
    nativeName: "aevmos",
    supportedOutChannels: [BridgeOutNetworks.EVMOS],
  },
  PERSISTENCE: {
    ...TOKENS.cantoMainnet.PERSISTENCE,
    ibcDenom:
      "ibc/B3CC9901DF8BA5F6154EDA69B3016EE16A795B6C422216AE08307FBBEAC22575",
    nativeName: "uxprt",
    supportedOutChannels: [BridgeOutNetworks.PERSISTENCE],
  },
  PSTAKEDATOM: {
    ...TOKENS.cantoMainnet.PStakedATOM,
    ibcDenom:
      "ibc/F596D425ED062FF586E9F74EA67E663BEB602EAD18F3388FB6DF57E127552BFD",
    nativeName: "stk/uatom",
    supportedOutChannels: [BridgeOutNetworks.PERSISTENCE],
  },
  STRIDE: {
    ...TOKENS.cantoMainnet.STRIDE,
    ibcDenom:
      "ibc/68930779653E62D66440AE801EE3394E9A29C4222930CBB20EC3EE179DE69E34",
    nativeName: "ustrd",
    supportedOutChannels: [BridgeOutNetworks.STRIDE],
  },
  STEVMOS: {
    ...TOKENS.cantoMainnet.STEVMOS,
    ibcDenom:
      "ibc/F33F8D7220E055E2079040C9E2BC6EC77FE77BD0D3FEB0ED5E1A9E5302E36885",
    nativeName: "staevmos",
    supportedOutChannels: [BridgeOutNetworks.STRIDE],
  },
  STATOM: {
    ...TOKENS.cantoMainnet.STATOM,
    ibcDenom:
      "ibc/E37B0A409BFF1981B1CEE15E2D766F28BE0710AFFCB4DE546FADE29A290B92B4",
    nativeName: "stuatom",
    supportedOutChannels: [BridgeOutNetworks.STRIDE],
  },
  STJUNO: {
    ...TOKENS.cantoMainnet.STJUNO,
    ibcDenom:
      "ibc/88C5B8AA229E9CCF38A70005A4DD50F758AF222244F7FF1506B57081C9E2A8BB",
    nativeName: "stujuno",
    supportedOutChannels: [BridgeOutNetworks.STRIDE],
  },
  STOSMO: {
    ...TOKENS.cantoMainnet.STOSMO,
    ibcDenom:
      "ibc/9EA05E1C36673DCFEF7AFB499B10673F0232B3AB5279EDA20E2E149969169931",
    nativeName: "stuosmo",
    supportedOutChannels: [BridgeOutNetworks.STRIDE],
  },
  STSTARS: {
    ...TOKENS.cantoMainnet.STSTARS,
    ibcDenom:
      "ibc/3E5BCCFB6C591DD08FA67C5A4C9AA1EE372CF591AA6E0B819C530AE5F653316A",
    nativeName: "stustars",
    supportedOutChannels: [BridgeOutNetworks.STRIDE],
  },
  QUICKSILVER: {
    ...TOKENS.cantoMainnet.QUICKSILVER,
    ibcDenom:
      "ibc/A4105A8226DEF5EE9AB52E7A745980D102E102C1C6A1E91DA186DB36216C3744",
    nativeName: "uqck",
    supportedOutChannels: [BridgeOutNetworks.QUICKSILVER],
  },
  QATOM: {
    ...TOKENS.cantoMainnet.QATOM,
    ibcDenom:
      "ibc/218B1A13F78796F4B4764BD36D110F0D14B452E0119C125EA8E3482D2E1FF9DB",
    nativeName: "uqatom",
    supportedOutChannels: [BridgeOutNetworks.QUICKSILVER],
  },
  QREGEN: {
    ...TOKENS.cantoMainnet.QREGEN,
    ibcDenom:
      "ibc/A310237FFAEB069D06E03AD04F0D4356AF4E4647C662C4209F8E40D0CA2F14AD",
    nativeName: "uqregen",
    supportedOutChannels: [BridgeOutNetworks.QUICKSILVER],
  },
  QSTARS: {
    ...TOKENS.cantoMainnet.QSTARS,
    ibcDenom:
      "ibc/13B6057538B93225F6EBACCB64574C49B2C1568C5AE6CCFE0A039D7DAC02BF29",
    nativeName: "uqstars",
    supportedOutChannels: [BridgeOutNetworks.QUICKSILVER],
  },
};

const NATIVE_COMSOS_TOKENS: NativeToken[] = [
  ALL_IBC_TOKENS_WITH_DENOMS.ATOM,
  ALL_IBC_TOKENS_WITH_DENOMS.SOMM,
  ALL_IBC_TOKENS_WITH_DENOMS.GRAV,
  ALL_IBC_TOKENS_WITH_DENOMS.AKASH,
  ALL_IBC_TOKENS_WITH_DENOMS.OSMOSIS,
  ALL_IBC_TOKENS_WITH_DENOMS.CRESCENT,
  ALL_IBC_TOKENS_WITH_DENOMS.KAVA,
  ALL_IBC_TOKENS_WITH_DENOMS.INJECTIVE,
  ALL_IBC_TOKENS_WITH_DENOMS.COMDEX,
  ALL_IBC_TOKENS_WITH_DENOMS.SENTINAL,
  ALL_IBC_TOKENS_WITH_DENOMS.EVMOS,
  ALL_IBC_TOKENS_WITH_DENOMS.PERSISTENCE,
  ALL_IBC_TOKENS_WITH_DENOMS.PSTAKEDATOM,
  ALL_IBC_TOKENS_WITH_DENOMS.STRIDE,
  ALL_IBC_TOKENS_WITH_DENOMS.STEVMOS,
  ALL_IBC_TOKENS_WITH_DENOMS.STATOM,
  ALL_IBC_TOKENS_WITH_DENOMS.STJUNO,
  ALL_IBC_TOKENS_WITH_DENOMS.STOSMO,
  ALL_IBC_TOKENS_WITH_DENOMS.STSTARS,
  ALL_IBC_TOKENS_WITH_DENOMS.QUICKSILVER,
  ALL_IBC_TOKENS_WITH_DENOMS.QATOM,
  ALL_IBC_TOKENS_WITH_DENOMS.QREGEN,
  ALL_IBC_TOKENS_WITH_DENOMS.QSTARS,
];
const CONVERT_COIN_TOKENS: NativeToken[] = [
  ALL_IBC_TOKENS_WITH_DENOMS.USDT,
  ALL_IBC_TOKENS_WITH_DENOMS.USDC,
  ALL_IBC_TOKENS_WITH_DENOMS.ETH,
  ALL_IBC_TOKENS_WITH_DENOMS.WSTETH,
  ...NATIVE_COMSOS_TOKENS,
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
  NATIVE_COMSOS_TOKENS,
};
