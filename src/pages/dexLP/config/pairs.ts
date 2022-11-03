import { ADDRESSES } from "global/config/addresses";
import { CTOKENS, Token, TOKENS } from "global/config/tokenInfo";

export interface PAIR {
  address: string;
  cLPaddress: string;
  token1: Token;
  token2: Token;
  decimals: number;
  cDecimals: number;
  stable: boolean;
}

export const TESTPAIRS: PAIR[] = [
  {
    address: ADDRESSES.testnet.CantoNoteLP,
    cLPaddress: ADDRESSES.testnet.cCantoNoteLP,
    token1: { ...TOKENS.cantoTestnet.WCANTO, symbol: "CANTO" }, // CANTO,
    token2: TOKENS.cantoTestnet.NOTE, // NOTE,
    decimals: TOKENS.cantoTestnet.CantoNote.decimals,
    cDecimals: CTOKENS.cantoTestnet.CCantoNote.decimals,
    stable: false,
  },
  {
    address: ADDRESSES.testnet.CantoETHLP,
    cLPaddress: ADDRESSES.testnet.cCantoETHLP,
    token1: { ...TOKENS.cantoTestnet.WCANTO, symbol: "CANTO" }, // CANTO,
    token2: TOKENS.cantoTestnet.ETH, // ETH,
    decimals: TOKENS.cantoTestnet.CantoETH.decimals,
    cDecimals: CTOKENS.cantoTestnet.CCantoETH.decimals,
    stable: false,
  },
  {
    address: ADDRESSES.testnet.CantoAtomLP,
    cLPaddress: ADDRESSES.testnet.cCantoAtomLP,
    token1: { ...TOKENS.cantoTestnet.WCANTO, symbol: "CANTO" }, // CANTO,
    token2: TOKENS.cantoTestnet.ATOM, // ATOM,
    decimals: TOKENS.cantoTestnet.CantoAtom.decimals,
    cDecimals: CTOKENS.cantoTestnet.CCantoAtom.decimals,
    stable: false,
  },
  {
    address: ADDRESSES.testnet.NoteUSDCLP,
    cLPaddress: ADDRESSES.testnet.cNoteUSDCLP,
    token1: TOKENS.cantoTestnet.NOTE, // NOTE,
    token2: TOKENS.cantoTestnet.USDC, // USDC,
    decimals: TOKENS.cantoTestnet.NoteUSDC.decimals,
    cDecimals: CTOKENS.cantoTestnet.CNoteUSDC.decimals,
    stable: true,
  },
  {
    address: ADDRESSES.testnet.NoteUSDTLP,
    cLPaddress: ADDRESSES.testnet.cNoteUSDTLP,
    token1: TOKENS.cantoTestnet.NOTE, // NOTE,
    token2: TOKENS.cantoTestnet.USDT, // USDT,
    decimals: TOKENS.cantoTestnet.NoteUSDT.decimals,
    cDecimals: CTOKENS.cantoTestnet.CNoteUSDT.decimals,
    stable: true,
  },
];
export const MAINPAIRS: PAIR[] = [
  {
    address: ADDRESSES.cantoMainnet.CantoNoteLP,
    cLPaddress: ADDRESSES.cantoMainnet.cCantoNoteLP,
    token1: { ...TOKENS.cantoMainnet.WCANTO, symbol: "CANTO" }, // CANTO,
    token2: TOKENS.cantoMainnet.NOTE, // NOTE,
    decimals: TOKENS.cantoMainnet.CantoNote.decimals,
    cDecimals: CTOKENS.cantoMainnet.CCantoNote.decimals,
    stable: false,
  },
  {
    address: ADDRESSES.cantoMainnet.CantoETHLP,
    cLPaddress: ADDRESSES.cantoMainnet.cCantoETHLP,
    token1: { ...TOKENS.cantoMainnet.WCANTO, symbol: "CANTO" }, // CANTO,
    token2: TOKENS.cantoMainnet.ETH, // ETH,
    decimals: TOKENS.cantoMainnet.CantoETH.decimals,
    cDecimals: CTOKENS.cantoMainnet.CCantoETH.decimals,
    stable: false,
  },
  {
    address: ADDRESSES.cantoMainnet.CantoAtomLP,
    cLPaddress: ADDRESSES.cantoMainnet.cCantoAtomLP,
    token1: { ...TOKENS.cantoMainnet.WCANTO, symbol: "CANTO" }, // CANTO,
    token2: TOKENS.cantoMainnet.ATOM, // ATOM,
    decimals: TOKENS.cantoMainnet.CantoAtom.decimals,
    cDecimals: CTOKENS.cantoMainnet.CCantoAtom.decimals,
    stable: false,
  },
  {
    address: ADDRESSES.cantoMainnet.NoteUSDCLP,
    cLPaddress: ADDRESSES.cantoMainnet.cNoteUSDCLP,
    token1: TOKENS.cantoMainnet.NOTE, // NOTE,
    token2: TOKENS.cantoMainnet.USDC, // USDC,
    decimals: TOKENS.cantoMainnet.NoteUSDC.decimals,
    cDecimals: CTOKENS.cantoMainnet.CNoteUSDC.decimals,
    stable: true,
  },
  {
    address: ADDRESSES.cantoMainnet.NoteUSDTLP,
    cLPaddress: ADDRESSES.cantoMainnet.cNoteUSDTLP,
    token1: TOKENS.cantoMainnet.NOTE, // NOTE,
    token2: TOKENS.cantoMainnet.USDT, // USDT,
    decimals: TOKENS.cantoMainnet.NoteUSDT.decimals,
    cDecimals: CTOKENS.cantoMainnet.CNoteUSDT.decimals,
    stable: true,
  },
];
