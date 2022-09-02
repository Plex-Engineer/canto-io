import { MAINPAIRS } from "pages/dexLP/config/pairs";
import { TokenPriceObject } from "./tokenPrices";
import { LPTokenInfo } from "./useLPInfo";
import { LMToken } from "../config/interfaces";

export interface BalanceSheetToken {
  icon: string;
  symbol: string;
  balanceOf: number;
  balanceOfNote: number;
}
interface Totals {
  totalAssets: number;
  totalDebt: number;
}

export interface LPTokenData {
  token1: {
    symbol: string;
    icon: string;
    amount: number;
  };
  token2: {
    symbol: string;
    icon: string;
    amount: number;
  };
  value: number;
}

export function useBalanceSheetData(
  tokens: LMToken[] | undefined,
  priceObject: TokenPriceObject[] | undefined,
  LPInfo: LPTokenInfo[] | undefined
): {
  assetTokens: BalanceSheetToken[];
  debtTokens: BalanceSheetToken[];
  LPTokens: LPTokenData[];
  totals: Totals;
} {
  if (!tokens || !priceObject || !LPInfo) {
    return {
      assetTokens: [],
      debtTokens: [],
      LPTokens: [],
      totals: { totalAssets: 0, totalDebt: 0 },
    };
  }
  let totalAssets = 0;
  let totalDebt = 0;
  const assetTokens: BalanceSheetToken[] = [];
  const debtTokens: BalanceSheetToken[] = [];
  const LPTokens: LPTokenData[] = [];

  tokens?.map((token) => {
    const price = token.data.underlying.isLP
      ? LPInfo?.find((lpToken) => {
          return lpToken.LPAddress == token.data.underlying.address;
        })?.priceInNote ?? 0
      : priceObject?.find((priceToken) => {
          return priceToken.address == token.data.underlying.address;
        })?.priceInNote ?? 0;

    if (Number(token.balanceOf) != 0 || Number(token.balanceOfC) != 0) {
      const balanceOf = Number(token.supplyBalance) + Number(token.balanceOf);
      const balanceOfNote = balanceOf * Number(price);
      totalAssets += balanceOfNote;
      assetTokens.push({
        icon: token.data.underlying.icon,
        symbol: token.data.underlying.symbol,
        balanceOf,
        balanceOfNote,
      });
    }
    if (Number(token.borrowBalance) != 0) {
      const balanceOf = Number(token.borrowBalance);
      const balanceOfNote = balanceOf * Number(price);
      totalDebt += balanceOfNote;
      debtTokens.push({
        icon: token.data.underlying.icon,
        symbol: token.data.underlying.symbol,
        balanceOf,
        balanceOfNote,
      });
    }
    if (
      token.data.underlying.isLP &&
      (Number(token.balanceOf) != 0 || Number(token.balanceOfC) != 0)
    ) {
      const pair = MAINPAIRS.find(
        (pair) => pair.address == token.data.underlying.address
      );
      if (pair) {
        const LPAmount = Number(token.balanceOf) + Number(token.supplyBalance);
        const LPTokenData = LPInfo?.find((lpToken) => {
          return lpToken.LPAddress == token.data.underlying.address;
        });
        LPTokens.push({
          token1: {
            symbol: pair?.token1.symbol,
            icon: pair.token1.icon,
            amount: LPAmount * Number(LPTokenData?.token1.tokensPerLP),
          },
          token2: {
            symbol: pair?.token2.symbol,
            icon: pair.token2.icon,
            amount: LPAmount * Number(LPTokenData?.token2.tokensPerLP),
          },
          value: Number(price) * LPAmount,
        });
      }
    }
  });
  const totals = {
    totalAssets,
    totalDebt,
  };
  return {
    assetTokens: assetTokens,
    debtTokens: debtTokens,
    LPTokens,
    totals: totals,
  };
}
