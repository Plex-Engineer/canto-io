import { userTxMessages } from "global/config/transactionTypes";
import { checkCosmosTxConfirmation } from "global/utils/cantoTransactions/checkCosmosConfirmation";
import { BridgeTransactionType } from "../config/interfaces";
import { BridgeTransactionStatus } from "../stores/transactionStore";

interface Error {
  code: number;
}
export async function performBridgeCosmosTxAndSetStatus(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: () => Promise<any>,
  txType: BridgeTransactionType,
  setStatus: (status: BridgeTransactionStatus | undefined) => void,
  tokenName: string,
  amount: string,
  from: string,
  to: string
) {
  setStatus({
    type: txType,
    status: "PendingSignature",
    message: userTxMessages.waitSign,
  });
  let transaction;
  try {
    transaction = await tx();
  } catch (err: unknown) {
    if ((err as Error).code == 4001) {
      setStatus({
        status: "Exception",
        type: txType,
        message: userTxMessages.deniedTx,
      });
    }
    return;
  }
  setStatus({
    status: "Mining",
    type: txType,
    message: userTxMessages.waitVerify,
  });
  const [activeMessage, success] = await getActiveTransactionMessage(
    transaction.tx_response.txhash,
    txType,
    tokenName,
    amount,
    from,
    to
  );
  setStatus({
    status: success ? "Success" : "Fail",
    type: txType,
    message: activeMessage,
  });
}

async function getActiveTransactionMessage(
  txHash: string,
  txType: BridgeTransactionType,
  tokenName: string,
  amount: string,
  from: string,
  to: string
) {
  if (txType !== BridgeTransactionType.NONE) {
    const txSuccess = await checkCosmosTxConfirmation(txHash);
    if (txSuccess) {
      return [
        `successfully bridged ${amount} ${tokenName} from ${from} to ${to}`,
        true,
      ];
    }
    return [`error bridging ${tokenName} from ${from} to ${to}`, false];
  }
  return ["", false];
}
