import { ADDRESSES } from "./addresses";
import CantoAtomLP from "assets/icons/LP/CantoAtomLP.svg";
import CantoETHLP from "assets/icons/LP/CantoETHLP.svg";
import CantoNoteLP from "assets/icons/LP/CantoNoteLP.svg";
import USDCNoteLP from "assets/icons/LP/USDCNoteLP.svg";
import USDTNoteLP from "assets/icons/LP/USDTNoteLP.svg";
import USDT from "assets/icons/USDT.svg";
import USDC from "assets/icons/USDC.svg";
import ETH from "assets/icons/ETH.svg";
import ATOM from "assets/icons/ATOM.svg";
import CANTO from "assets/icons/canto.png";
import Note from "assets/icons/note.svg";
import WSTETH from "assets/icons/wstETH.svg";
import { Token, TokenGroups, CTOKEN } from "./interfaces/tokens";

export const noteSymbol = "Ꞥ";

const icons = {
  Note,
  CANTO,
  USDT,
  USDC,
  ETH,
  ATOM,
  CantoAtomLP,
  CantoETHLP,
  CantoNoteLP,
  USDCNoteLP,
  USDTNoteLP,
};

const decimals = {
  Note: 18,
  CANTO: 18,
  USDC: 6,
  USDT: 6,
  ETH: 18,
  ATOM: 6,
  WETH: 18,

  cNote: 18,
  cCANTO: 18,
  cUSDC: 6,
  cUSDT: 6,
  cETH: 18,
  cATOM: 6,

  CantoNoteLP: 18,
  cCantoNoteLP: 18,
  CantoAtomLP: 18,
  cCantoAtomLP: 18,
  NoteUSDCLP: 18,
  cNoteUSDCLP: 18,
  NoteUSDTLP: 18,
  cNoteUSDTLP: 18,
  CantoETHLP: 18,
  cCantoETHLP: 18,
};

interface FullTokenList {
  [chain: string]: {
    [key: string]: Token;
  };
}
export const TOKENS: FullTokenList = {
  cantoTestnet: {
    CANTO: {
      symbol: "CANTO",
      name: "Canto",
      decimals: decimals.CANTO,
      address: ADDRESSES.testnet.WCANTO,
      isERC20: false,
      isLP: false,
      icon: icons.CANTO,
      tokenGroups: [TokenGroups.DEX_TOKENS],
    },
    WCANTO: {
      symbol: "WCANTO",
      name: "WCanto",
      decimals: decimals.CANTO,
      address: ADDRESSES.testnet.WCANTO,
      isERC20: true,
      isLP: false,
      icon: icons.CANTO,
      tokenGroups: [TokenGroups.DEX_TOKENS],
    },
    NOTE: {
      symbol: "NOTE",
      name: "Note",
      decimals: decimals.Note,
      address: ADDRESSES.testnet.Note,
      isERC20: true,
      isLP: false,
      icon: icons.Note,
      tokenGroups: [TokenGroups.DEX_TOKENS],
    },
    ETH: {
      symbol: "ETH",
      name: "ETH",
      decimals: decimals.ETH,
      address: ADDRESSES.testnet.ETH,
      isERC20: true,
      isLP: false,
      icon: icons.ETH,
      tokenGroups: [TokenGroups.DEX_TOKENS],
    },
    ATOM: {
      symbol: "ATOM",
      name: "ATOM",
      decimals: decimals.ATOM,
      address: ADDRESSES.testnet.ATOM,
      isERC20: true,
      isLP: false,
      icon: icons.ATOM,
      tokenGroups: [TokenGroups.DEX_TOKENS, TokenGroups.IBC_TOKENS],
    },
    USDC: {
      symbol: "USDC",
      name: "USDC",
      decimals: decimals.USDC,
      address: ADDRESSES.testnet.USDC,
      isERC20: true,
      isLP: false,
      icon: icons.USDC,
      tokenGroups: [TokenGroups.DEX_TOKENS],
    },
    USDT: {
      symbol: "USDT",
      name: "USDT",
      decimals: decimals.USDT,
      address: ADDRESSES.testnet.USDT,
      isERC20: true,
      isLP: false,
      icon: icons.USDT,
      tokenGroups: [TokenGroups.DEX_TOKENS],
    },
    CantoNote: {
      symbol: "CantoNoteLP",
      name: "CantoNoteLP",
      decimals: decimals.CantoNoteLP,
      address: ADDRESSES.testnet.CantoNoteLP,
      isERC20: true,
      isLP: true,
      icon: icons.CantoNoteLP,
      tokenGroups: [TokenGroups.LP_TOKENS],
    },
    CantoAtom: {
      symbol: "CantoAtomLP",
      name: "CantoAtomLP",
      decimals: decimals.CantoAtomLP,
      address: ADDRESSES.testnet.CantoAtomLP,
      isERC20: true,
      isLP: true,
      icon: icons.CantoAtomLP,
      tokenGroups: [TokenGroups.LP_TOKENS],
    },
    NoteUSDC: {
      symbol: "NoteUSDCLP",
      name: "NoteUSDCLP",
      decimals: decimals.NoteUSDCLP,
      address: ADDRESSES.testnet.NoteUSDCLP,
      isERC20: true,
      isLP: true,
      icon: icons.USDCNoteLP,
      tokenGroups: [TokenGroups.LP_TOKENS],
    },
    NoteUSDT: {
      symbol: "NoteUSDTLP",
      name: "NoteUSDTLP",
      decimals: decimals.NoteUSDTLP,
      address: ADDRESSES.testnet.NoteUSDTLP,
      isERC20: true,
      isLP: true,
      icon: icons.USDTNoteLP,
      tokenGroups: [TokenGroups.LP_TOKENS],
    },
    CantoETH: {
      symbol: "CantoETHLP",
      name: "CantoETHLP",
      decimals: decimals.CantoETHLP,
      address: ADDRESSES.testnet.CantoETHLP,
      isERC20: true,
      isLP: true,
      icon: icons.CantoETHLP,
      tokenGroups: [TokenGroups.LP_TOKENS],
    },
  },
  cantoMainnet: {
    CANTO: {
      symbol: "CANTO",
      name: "Canto",
      decimals: decimals.CANTO,
      address: ADDRESSES.cantoMainnet.WCANTO,
      isERC20: false,
      isLP: false,
      icon: icons.CANTO,
      tokenGroups: [TokenGroups.DEX_TOKENS],
    },
    WCANTO: {
      symbol: "WCANTO",
      name: "WCanto",
      decimals: decimals.CANTO,
      address: ADDRESSES.cantoMainnet.WCANTO,
      isERC20: true,
      isLP: false,
      icon: icons.CANTO,
      tokenGroups: [TokenGroups.DEX_TOKENS],
    },
    NOTE: {
      symbol: "NOTE",
      name: "Note",
      decimals: decimals.Note,
      address: ADDRESSES.cantoMainnet.Note,
      isERC20: true,
      isLP: false,
      icon: icons.Note,
      tokenGroups: [TokenGroups.DEX_TOKENS],
    },
    ETH: {
      symbol: "ETH",
      name: "ETH",
      decimals: decimals.ETH,
      address: ADDRESSES.cantoMainnet.ETH,
      isERC20: true,
      isLP: false,
      icon: icons.ETH,
      tokenGroups: [TokenGroups.DEX_TOKENS],
    },
    ATOM: {
      symbol: "ATOM",
      name: "ATOM",
      decimals: decimals.ATOM,
      address: ADDRESSES.cantoMainnet.ATOM,
      isERC20: true,
      isLP: false,
      icon: icons.ATOM,
      tokenGroups: [TokenGroups.DEX_TOKENS, TokenGroups.IBC_TOKENS],
    },
    USDC: {
      symbol: "USDC",
      name: "USDC",
      decimals: decimals.USDC,
      address: ADDRESSES.cantoMainnet.USDC,
      isERC20: true,
      isLP: false,
      icon: icons.USDC,
      tokenGroups: [TokenGroups.DEX_TOKENS],
    },
    USDT: {
      symbol: "USDT",
      name: "USDT",
      decimals: decimals.USDT,
      address: ADDRESSES.cantoMainnet.USDT,
      isERC20: true,
      isLP: false,
      icon: icons.USDT,
      tokenGroups: [TokenGroups.DEX_TOKENS],
    },
    CantoNote: {
      symbol: "CantoNoteLP",
      name: "CantoNoteLP",
      decimals: decimals.CantoNoteLP,
      address: ADDRESSES.cantoMainnet.CantoNoteLP,
      isERC20: true,
      isLP: true,
      icon: icons.CantoNoteLP,
      tokenGroups: [TokenGroups.LP_TOKENS],
    },
    CantoAtom: {
      symbol: "CantoAtomLP",
      name: "CantoAtomLP",
      decimals: decimals.CantoAtomLP,
      address: ADDRESSES.cantoMainnet.CantoAtomLP,
      isERC20: true,
      isLP: true,
      icon: icons.CantoAtomLP,
      tokenGroups: [TokenGroups.LP_TOKENS],
    },
    NoteUSDC: {
      symbol: "NoteUSDCLP",
      name: "NoteUSDCLP",
      decimals: decimals.NoteUSDCLP,
      address: ADDRESSES.cantoMainnet.NoteUSDCLP,
      isERC20: true,
      isLP: true,
      icon: icons.USDCNoteLP,
      tokenGroups: [TokenGroups.LP_TOKENS],
    },
    NoteUSDT: {
      symbol: "NoteUSDTLP",
      name: "NoteUSDTLP",
      decimals: decimals.NoteUSDTLP,
      address: ADDRESSES.cantoMainnet.NoteUSDTLP,
      isERC20: true,
      isLP: true,
      icon: icons.USDTNoteLP,
      tokenGroups: [TokenGroups.LP_TOKENS],
    },
    CantoETH: {
      symbol: "CantoETHLP",
      name: "CantoETHLP",
      decimals: decimals.CantoETHLP,
      address: ADDRESSES.cantoMainnet.CantoETHLP,
      isERC20: true,
      isLP: true,
      icon: icons.CantoETHLP,
      tokenGroups: [TokenGroups.LP_TOKENS],
    },
    //ibc tokens new
    SOMM: {
      symbol: "SOMM",
      name: "Sommelier",
      decimals: 6,
      address: "0xFA3C22C069B9556A4B2f7EcE1Ee3B467909f4864",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/sommelier/images/somm.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    GRAV: {
      symbol: "GRAV",
      name: "Graviton",
      decimals: 6,
      address: "0xc03345448969Dd8C00e9E4A85d2d9722d093aF8E",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/gravitybridge/images/grav.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    AKASH: {
      symbol: "AKT",
      name: "Akash",
      decimals: 6,
      address: "0x5aD523d94Efb56C400941eb6F34393b84c75ba39",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/akash/images/akt.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    OSMOSIS: {
      symbol: "OSMO",
      name: "Osmosis",
      decimals: 6,
      address: "0x0CE35b0D42608Ca54Eb7bcc8044f7087C18E7717",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    CRESCENT: {
      symbol: "CRE",
      name: "Crescent",
      decimals: 6,
      address: "0x5db67696C3c088DfBf588d3dd849f44266ff0ffa",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/crescent/images/cre.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    KAVA: {
      symbol: "KAVA",
      name: "Kava",
      decimals: 6,
      address: "0xC5e00D3b04563950941f7137B5AfA3a534F0D6d6",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/kava/images/kava.png",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    INJECTIVE: {
      symbol: "INJ",
      name: "Injective",
      decimals: 18,
      address: "0x1D54EcB8583Ca25895c512A8308389fFD581F9c9",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/injective/images/inj.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    COMDEX: {
      symbol: "CMDX",
      name: "Comdex",
      decimals: 6,
      address: "0x3452e23F9c4cC62c70B7ADAd699B264AF3549C19",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/comdex/images/cmdx.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    //new ibc tokens batch II
    SENTINAL: {
      symbol: "DVPN",
      name: "Sentinal",
      decimals: 6,
      address: "0x15C3Eb3B621d1Bff62CbA1c9536B7c1AE9149b57",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/sentinel/images/dvpn.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    EVMOS: {
      symbol: "EVMOS",
      name: "Evmos",
      decimals: 18,
      address: "0xF5b24c0093b65408ACE53df7ce86a02448d53b25",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/evmos/images/evmos.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    PERSISTENCE: {
      symbol: "XPRT",
      name: "Persistence",
      decimals: 6,
      address: "0xc8B4d3e67238e38B20d38908646fF6F4F48De5EC",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/persistence/images/xprt.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    PStakedATOM: {
      symbol: "stkATOM",
      name: "PSTAKE staked ATOM",
      decimals: 6,
      address: "0x50dE24B3f0B3136C50FA8A3B8ebc8BD80a269ce5",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/persistence/images/stkatom.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    STRIDE: {
      symbol: "STRD",
      name: "Stride",
      decimals: 6,
      address: "0x13974cf36984216C90D1F4FC815C156092feA396",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/strd.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    STEVMOS: {
      symbol: "stEVMOS",
      name: "stEVMOS",
      decimals: 18,
      address: "0x205CF44075E77A3543abC690437F3b2819bc450a",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stevmos.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    STATOM: {
      symbol: "stATOM",
      name: "stATOM",
      decimals: 6,
      address: "0x4A2a90D444DbB7163B5861b772f882BbA394Ca67",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/statom.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    STJUNO: {
      symbol: "stJUNO",
      name: "stJUNO",
      decimals: 6,
      address: "0xe01C6D4987Fc8dCE22988DADa92d56dA701d0Fe0",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stjuno.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    STOSMO: {
      symbol: "stOSMO",
      name: "stOSMO",
      decimals: 6,
      address: "0x3515F25AB7637adcF1b69F4D384ed5936B83431F",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stosmo.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    STSTARS: {
      symbol: "stSTARS",
      name: "stSTARS",
      decimals: 6,
      address: "0x4AF57825b86Abf93D4F9D720bEF7c1C1b300A6F3",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/ststars.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    QUICKSILVER: {
      symbol: "QCK",
      name: "Quicksilver",
      decimals: 6,
      address: "0xF0965c8f0755CF080a61C91EDd6707F0532c8fE7",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/quicksilver/images/qck.png",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    QATOM: {
      symbol: "qATOM",
      name: "Quicksilver Liquid Staked ATOM",
      decimals: 6,
      address: "0x9d6F2a9fDB32708e1AC07788cc29D6125ac73027",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/quicksilver/images/qatom.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    QREGEN: {
      symbol: "qREGEN",
      name: "Quicksilver Liquid Staked Regen",
      decimals: 6,
      address: "0xB5124FA2b2cF92B2D469b249433BA1c96BDF536D",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/quicksilver/images/qregen.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    QSTARS: {
      symbol: "qSTARS",
      name: "Quicksilver Liquid Staked STARS",
      decimals: 6,
      address: "0xD32eB974468ed767338533842D2D4Cc90B9BAb46",
      isERC20: true,
      isLP: false,
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/quicksilver/images/qstars.svg",
      tokenGroups: [TokenGroups.IBC_TOKENS],
    },
    WSTETH: {
      symbol: "wstETH",
      name: "wrapped staked eth",
      decimals: 18,
      address: "0xc71aAf8e486e3F33841BB56Ca3FD2aC3fa8D29a8",
      isERC20: true,
      isLP: false,
      icon: WSTETH,
      tokenGroups: [],
    },
  },
  ETHMainnet: {
    USDT: {
      symbol: "USDT",
      name: "USDT",
      decimals: decimals.USDT,
      address: ADDRESSES.ETHMainnet.USDT,
      isERC20: true,
      isLP: false,
      icon: icons.USDT,
      tokenGroups: [TokenGroups.DEX_TOKENS],
    },
    USDC: {
      symbol: "USDC",
      name: "USDC",
      decimals: decimals.USDC,
      address: ADDRESSES.ETHMainnet.USDC,
      isERC20: true,
      isLP: false,
      icon: icons.USDC,
      tokenGroups: [TokenGroups.DEX_TOKENS],
    },
    WETH: {
      symbol: "WETH",
      name: "WETH",
      decimals: decimals.WETH,
      address: ADDRESSES.ETHMainnet.WETH,
      isERC20: true,
      isLP: false,
      icon: icons.ETH,
      tokenGroups: [TokenGroups.DEX_TOKENS],
      isNative: true,
      nativeSymbol: "ETH",
    },
    WSTETH: {
      symbol: "wstETH",
      name: "wrapped staked eth",
      decimals: 18,
      address: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
      isERC20: true,
      isLP: false,
      icon: WSTETH,
      tokenGroups: [],
    },
  },
  GravityBridge: {
    E2H: {
      symbol: "E2H",
      name: "E2H",
      decimals: 18,
      address: ADDRESSES.gravityBridgeTest.E2H,
      isERC20: true,
      isLP: false,
      icon: "https://s2.coinmarketcap.com/static/img/coins/32x32/1.png",
      tokenGroups: [],
    },
    BYE: {
      symbol: "BYE",
      name: "BYE",
      decimals: 18,
      address: ADDRESSES.gravityBridgeTest.BYE,
      isERC20: true,
      isLP: false,
      icon: "https://s2.coinmarketcap.com/static/img/coins/32x32/2.png",
      tokenGroups: [],
    },
    MAX: {
      symbol: "MAX",
      name: "MAX",
      decimals: 18,
      address: ADDRESSES.gravityBridgeTest.MAX,
      isERC20: true,
      isLP: false,
      icon: "https://s2.coinmarketcap.com/static/img/coins/32x32/3.png",
      tokenGroups: [],
    },
  },
};

interface FullCTokenList {
  [chain: string]: {
    [token: string]: CTOKEN;
  };
}
export const CTOKENS: FullCTokenList = {
  cantoTestnet: {
    CCANTO: {
      symbol: "cCANTO",
      name: "cCanto",
      decimals: decimals.cCANTO,
      address: ADDRESSES.testnet.CCanto,
      underlying: TOKENS.cantoTestnet.CANTO,
    },
    CNOTE: {
      symbol: "cNOTE",
      name: "CNote",
      decimals: decimals.cNote,
      address: ADDRESSES.testnet.CNote,
      underlying: TOKENS.cantoTestnet.NOTE,
    },
    CETH: {
      symbol: "cETH",
      name: "CETH",
      decimals: decimals.cETH,
      address: ADDRESSES.testnet.CETH,
      underlying: TOKENS.cantoTestnet.ETH,
    },
    CATOM: {
      symbol: "cATOM",
      name: "CATOM",
      decimals: decimals.cATOM,
      address: ADDRESSES.testnet.CATOM,
      underlying: TOKENS.cantoTestnet.ATOM,
    },
    CUSDC: {
      symbol: "cUSDC",
      name: "CUSDC",
      decimals: decimals.cUSDC,
      address: ADDRESSES.testnet.CUSDC,
      underlying: TOKENS.cantoTestnet.USDC,
    },
    CUSDT: {
      symbol: "cUSDT",
      name: "CUSDT",
      decimals: decimals.cUSDT,
      address: ADDRESSES.testnet.CUSDT,
      underlying: TOKENS.cantoTestnet.USDT,
    },
    CCantoNote: {
      symbol: "cCantoNoteLP",
      name: "CCantoNoteLP",
      decimals: decimals.cCantoNoteLP,
      address: ADDRESSES.testnet.cCantoNoteLP,
      underlying: TOKENS.cantoTestnet.CantoNote,
    },
    CCantoAtom: {
      symbol: "cCantoAtomLP",
      name: "CCantoAtomLP",
      decimals: decimals.cCantoAtomLP,
      address: ADDRESSES.testnet.cCantoAtomLP,
      underlying: TOKENS.cantoTestnet.CantoAtom,
    },
    CNoteUSDC: {
      symbol: "cNoteUSDCLP",
      name: "CNoteUSDCLP",
      decimals: decimals.cNoteUSDCLP,
      address: ADDRESSES.testnet.cNoteUSDCLP,
      underlying: TOKENS.cantoTestnet.NoteUSDC,
    },
    CNoteUSDT: {
      symbol: "cNoteUSDTLP",
      name: "CNoteUSDTLP",
      decimals: decimals.cNoteUSDTLP,
      address: ADDRESSES.testnet.cNoteUSDTLP,
      underlying: TOKENS.cantoTestnet.NoteUSDT,
    },
    CCantoETH: {
      symbol: "cCantoETHLP",
      name: "CCantoETHLP",
      decimals: decimals.cCantoETHLP,
      address: ADDRESSES.testnet.cCantoETHLP,
      underlying: TOKENS.cantoTestnet.CantoETH,
    },
  },
  cantoMainnet: {
    CCANTO: {
      symbol: "cCANTO",
      name: "CCanto",
      decimals: decimals.cCANTO,
      address: ADDRESSES.cantoMainnet.CCanto,
      underlying: TOKENS.cantoMainnet.CANTO,
    },
    CNOTE: {
      symbol: "cNOTE",
      name: "CNote",
      decimals: decimals.cNote,
      address: ADDRESSES.cantoMainnet.CNote,
      underlying: TOKENS.cantoMainnet.NOTE,
    },
    CETH: {
      symbol: "cETH",
      name: "CETH",
      decimals: decimals.cETH,
      address: ADDRESSES.cantoMainnet.CETH,
      underlying: TOKENS.cantoMainnet.ETH,
    },
    CATOM: {
      symbol: "cATOM",
      name: "CATOM",
      decimals: decimals.cATOM,
      address: ADDRESSES.cantoMainnet.CATOM,
      underlying: TOKENS.cantoMainnet.ATOM,
    },
    CUSDC: {
      symbol: "cUSDC",
      name: "CUSDC",
      decimals: decimals.cUSDC,
      address: ADDRESSES.cantoMainnet.CUSDC,
      underlying: TOKENS.cantoMainnet.USDC,
    },
    CUSDT: {
      symbol: "cUSDT",
      name: "CUSDT",
      decimals: decimals.cUSDT,
      address: ADDRESSES.cantoMainnet.CUSDT,
      underlying: TOKENS.cantoMainnet.USDT,
    },
    CCantoNote: {
      symbol: "cCantoNoteLP",
      name: "CCantoNoteLP",
      decimals: decimals.cCantoNoteLP,
      address: ADDRESSES.cantoMainnet.cCantoNoteLP,
      underlying: TOKENS.cantoMainnet.CantoNote,
    },
    CCantoAtom: {
      symbol: "cCantoAtomLP",
      name: "CCantoAtomLP",
      decimals: decimals.cCantoAtomLP,
      address: ADDRESSES.cantoMainnet.cCantoAtomLP,
      underlying: TOKENS.cantoMainnet.CantoAtom,
    },
    CNoteUSDC: {
      symbol: "cNoteUSDCLP",
      name: "CNoteUSDCLP",
      decimals: decimals.cNoteUSDCLP,
      address: ADDRESSES.cantoMainnet.cNoteUSDCLP,
      underlying: TOKENS.cantoMainnet.NoteUSDC,
    },
    CNoteUSDT: {
      symbol: "cNoteUSDTLP",
      name: "CNoteUSDTLP",
      decimals: decimals.cNoteUSDTLP,
      address: ADDRESSES.cantoMainnet.cNoteUSDTLP,
      underlying: TOKENS.cantoMainnet.NoteUSDT,
    },
    CCantoETH: {
      symbol: "cCantoETHLP",
      name: "CCantoETHLP",
      decimals: decimals.cCantoETHLP,
      address: ADDRESSES.cantoMainnet.cCantoETHLP,
      underlying: TOKENS.cantoMainnet.CantoETH,
    },
  },
};
