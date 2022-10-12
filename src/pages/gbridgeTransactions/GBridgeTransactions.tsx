import { formatUnits } from "ethers/lib/utils";
import { useNetworkInfo } from "global/stores/networkInfo";
import LendingTable from "pages/lending/components/table";
import { useEffect, useState } from "react";
import {
  findGravityToken,
  getAllBridgeTransactionsForUser,
  getBridgeStatus,
} from "./utils";

export const GBridgeTransactions = () => {
  const networkInfo = useNetworkInfo();
  const [bridgeTransactions, setBridgeTransactions] = useState<any[]>([]);
  const [blockNumber, setBlockNumber] = useState(0);

  async function getData() {
    const [transactions, blockNumber] = await getAllBridgeTransactionsForUser(
      networkInfo.account
    );
    setBridgeTransactions(transactions);
    setBlockNumber(blockNumber);
  }
  useEffect(() => {
    getData();
  }, [networkInfo.account]);

  useEffect(() => {
    filterTransactionSuccess(bridgeTransactions);
  }, [bridgeTransactions.length]);

  async function filterTransactionSuccess(tx: any[]) {
    if (tx.length == 0) return;
    let localTransactions = tx;
    for (const t of tx) {
      const txReceipt = await t.getTransactionReceipt();
      if (txReceipt.status != 1) {
        localTransactions = localTransactions.filter((x) => {
          return x != t;
        });
        localTransactions.push({ ...t, statusError: "failed" });
      }
    }
    setBridgeTransactions(localTransactions);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "80%" }}>
        <LendingTable
          columns={["token", "sender", "amount", "destination", "status"]}
          isLending
        >
          {bridgeTransactions
            .sort((a: any, b: any) => {
              return a.blockNumber > b.blockNumber ? -1 : 1;
            })
            .map((tx) => {
              const token = findGravityToken(tx.args._tokenContract);
              return (
                <tr key={tx.blockNumber}>
                  <td>{token?.symbol}</td>
                  <td>{tx.args._sender.slice(0, 10)}</td>
                  <td>{formatUnits(tx.args._amount, token?.decimals)}</td>
                  <td>{tx.args._destination.slice(0, 10)}</td>
                  <td>
                    {tx.statusError ??
                      getBridgeStatus(blockNumber, tx.blockNumber)}
                  </td>
                </tr>
              );
            })}
        </LendingTable>
      </div>
    </div>
  );
};
