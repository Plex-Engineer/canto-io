import { MAINPAIRS } from "pages/dexLP/config/pairs";
import { TokenPriceObject } from "./tokenPrices";
import { LPTokenInfo } from "./useLPInfo";
import { UserLMTokenDetails } from "../config/interfaces";
import { formatUnits } from "ethers/lib/utils";

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
  tokens: UserLMTokenDetails[] | undefined,
  priceObject: TokenPriceObject[] | undefined,
  LPInfo: LPTokenInfo[] | undefined
): {
  assetTokens: BalanceSheetToken[];
  debtTokens: BalanceSheetToken[];
  totals: Totals;
} {
  if (!tokens || !priceObject || !LPInfo) {
    return {
      assetTokens: [],
      debtTokens: [],
      totals: { totalAssets: 0, totalDebt: 0 },
    };
  }
  let totalAssets = 0;
  let totalDebt = 0;
  const assetTokens: BalanceSheetToken[] = [];
  const debtTokens: BalanceSheetToken[] = [];

  tokens?.map((token) => {
    const price = token.data.underlying.isLP
      ? LPInfo?.find((lpToken) => {
          return lpToken.LPAddress == token.data.underlying.address;
        })?.priceInNote ?? 0
      : priceObject?.find((priceToken) => {
          return priceToken.address == token.data.underlying.address;
        })?.priceInNote ?? 0;

    if (!(token.balanceOf.isZero() && token.balanceOfC.isZero())) {
      const balanceOf = Number(
        formatUnits(
          token.supplyBalance.add(token.balanceOf),
          token.data.underlying.decimals
        )
      );
      const balanceOfNote = balanceOf * Number(price);
      totalAssets += Number(balanceOfNote);
      assetTokens.push({
        icon: token.data.underlying.icon,
        symbol: token.data.underlying.symbol,
        balanceOf,
        balanceOfNote,
      });
    }
    if (!token.borrowBalance.isZero()) {
      const balanceOf = Number(
        formatUnits(
          token.supplyBalance.add(token.borrowBalance),
          token.data.underlying.decimals
        )
      );
      const balanceOfNote = balanceOf * Number(price);
      totalDebt += balanceOfNote;
      debtTokens.push({
        icon: token.data.underlying.icon,
        symbol: token.data.underlying.symbol,
        balanceOf,
        balanceOfNote,
      });
    }
  });
  const totals = {
    totalAssets,
    totalDebt,
  };
  return {
    assetTokens: assetTokens,
    debtTokens: debtTokens,
    totals: totals,
  };
}
