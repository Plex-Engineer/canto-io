import { mainnetTokens } from "../config/lendingMarketTokens";
import { MAINPAIRS } from "pages/dexLP/config/pairs";
import { getTokenPrice, TokenPriceObject } from "./tokenPrices";
import {
  BalanceSheetToken,
  LPTokenData,
  useBalanceSheetData,
} from "./useBalanceSheetData";
import { useLPInfo } from "./useLPInfo";
import { useTokens } from "../hooks/useTokens";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { truncateNumber } from "global/utils/utils";
import LendingTable from "pages/lending/components/lendingTable";
import { useNetworkInfo } from "global/stores/networkInfo";
import { noteSymbol } from "global/utils/utils";

export const BalanceSheet = () => {
  //get network info and token list
  const networkInfo = useNetworkInfo();
  const allData = useTokens(networkInfo.account, Number(networkInfo.chainId));
  const tokens = allData?.LMTokens;

  //get base token prices used for pricing LP tokens
  const [tokenPrices, setTokenPrices] = useState<TokenPriceObject[]>([]);
  async function setAllTokenPrices() {
    mainnetTokens.forEach(async (token) => {
      if (!tokenPrices.find((tokenObj) => tokenObj.address == token.address)) {
        const priceObject: TokenPriceObject = await getTokenPrice(token);
        setTokenPrices((tokens) => [...tokens, priceObject]);
      }
    });
  }
  //set the prices on load
  useEffect(() => {
    setAllTokenPrices();
  }, []);

  //get LP token information, price + tokens per LP
  const LPInfo = useLPInfo(networkInfo.chainId, tokenPrices, MAINPAIRS);

  const columns = ["ticker", "balance (supply + wallet)", "value"];

  const { assetTokens, debtTokens, LPTokens, totals } = useBalanceSheetData(
    tokens,
    tokenPrices,
    LPInfo
  );
  if (!tokens) {
    return <div></div>;
  }

  return (
    <div>
      <BalanceSheetTable
        name="assets"
        columns={columns}
        tokens={assetTokens}
        total={totals.totalAssets}
      />
      <BalanceSheetTable
        name="debt"
        columns={columns}
        tokens={debtTokens}
        total={totals.totalDebt}
      />
      <BalanceSheetTable
        name="total"
        columns={["", "", "value"]}
        tokens={[]}
        total={totals.totalAssets - totals.totalDebt}
      />
      <LPTable LPTokens={LPTokens} />
    </div>
  );
};

interface BalanceSheetRowProps {
  assetName: string;
  assetIcon?: string;
  quantity?: string;
  value: string;
}
const BalanceSheetRow = (props: BalanceSheetRowProps) => {
  return (
    <tr>
      <td>
        <img src={props.assetIcon} alt="" /> <p>{props.assetName}</p>
      </td>
      <td width={"33%"}>{props.quantity}</td>
      <td width={"33%"}>{noteSymbol + props.value}</td>
    </tr>
  );
};

interface BalanceTableProps {
  name: string;
  columns: string[];
  tokens: BalanceSheetToken[];
  total: number;
}
const BalanceSheetTable = (props: BalanceTableProps) => {
  return (
    <div style={{ color: "white" }}>
      {props.name}
      <LendingTable columns={props.columns} isLending>
        {props.tokens.map((token) => {
          return (
            <BalanceSheetRow
              key={token.symbol + props.name}
              assetName={token.symbol}
              assetIcon={token.icon}
              quantity={truncateNumber(token.balanceOf.toString())}
              value={truncateNumber(token.balanceOfNote.toString())}
            />
          );
        })}
        <BalanceSheetRow
          key={props.name}
          assetName={"total " + props.name}
          value={truncateNumber(props.total.toString())}
        />
      </LendingTable>
    </div>
  );
};

interface LPProps {
  LPTokens: LPTokenData[];
}
const LPTable = (props: LPProps) => {
  return (
    <div style={{ color: "white" }}>
      LP Tokens
      <LendingTable
        columns={["token 1", "amount", "token 2", "amount", "total value"]}
        isLending
      >
        {props.LPTokens.map((token) => {
          return (
            <LPRow
              key={token.token1.symbol + token.token2.symbol + "LP"}
              token={token}
            />
          );
        })}
      </LendingTable>
    </div>
  );
};

interface LPRowProps {
  token: LPTokenData;
}
const LPTableStyle = styled.tr`
  td:first-child,
  td:nth-child(3) {
    padding-left: 2rem;
    text-align: center;
    display: flex;
    align-items: center;
    gap: 1rem;
    text-transform: uppercase;
  }
`;

const LPRow = (props: LPRowProps) => {
  return (
    <LPTableStyle>
      <td>
        <img src={props.token.token1.icon} alt="" />{" "}
        <p>{props.token.token1.symbol}</p>
      </td>
      <td>
        {truncateNumber(props.token.token1.amount.toString()) +
          " " +
          props.token.token1.symbol}
      </td>
      <td>
        <img src={props.token.token2.icon} alt="" />{" "}
        <p>{props.token.token2.symbol}</p>
      </td>
      <td>
        {truncateNumber(props.token.token2.amount.toString()) +
          " " +
          props.token.token2.symbol}
      </td>
      <td>{noteSymbol + truncateNumber(props.token.value.toString())}</td>
    </LPTableStyle>
  );
};
