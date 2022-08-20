import { createTransaction } from "@tharsis/proto";

import {
  createEIP712,
  generateFee,
  generateMessage,
  generateTypes,
  createMsgConvertERC20,
  MSG_CONVERT_ERC20_TYPES,
} from "@tharsis/eip712";
import * as erc20 from './prototypes/proto-tx';

export interface Fee {
  amount: string;
  denom: string;
  gas: string;
}

export interface Sender {
  accountAddress: string;
  sequence: number;
  accountNumber: number;
  pubkey: string;
}

export interface Chain {
  chainId: number;
  cosmosChainId: string;
}

/* eslint-disable camelcase */
export interface MessageMsgConvertERC20 {
  contract_address: string;
  amount: string;
  receiverEvmosFormatted: string;
  senderHexFormatted: string;
}

export function createTxMsgConvertERC20(
  chain: Chain,
  sender: Sender,
  fee: Fee,
  memo: string,
  params: MessageMsgConvertERC20
) {
  // EIP712
  const feeObject = generateFee(
    fee.amount,
    fee.denom,
    fee.gas,
    sender.accountAddress
  );
  const types = generateTypes(MSG_CONVERT_ERC20_TYPES);

  const msg = createMsgConvertERC20(
    params.contract_address,
    params.amount,
    params.receiverEvmosFormatted,
    params.senderHexFormatted
  );

  msg.type = "canto/MsgConvertERC20";

  const messages = generateMessage(
    sender.accountNumber.toString(),
    sender.sequence.toString(),
    chain.cosmosChainId,
    memo,
    feeObject,
    msg
  );

  const eipToSign = createEIP712(types, chain.chainId, messages);

  // Cosmos
  const msgCosmos = protoMsgConvertERC20(
    params.contract_address,
    params.amount,
    params.receiverEvmosFormatted,
    params.senderHexFormatted
  );

  const tx = createTransaction(
    msgCosmos,
    memo,
    fee.amount,
    fee.denom,
    parseInt(fee.gas, 10),
    "ethsecp256",
    sender.pubkey,
    sender.sequence,
    sender.accountNumber,
    chain.cosmosChainId
  );

  return {
    signDirect: tx.signDirect,
    legacyAmino: tx.legacyAmino,
    eipToSign,
  };
}







export function protoMsgConvertERC20(
    contractAddress: string,
    amount: string,
    receiver: string,
    sender: string,
  ) {
    const msg = new erc20.evmos.erc20.v1.MsgConvertERC20({
      contract_address: contractAddress,
      amount,
      receiver,
      sender,
    })
    return {
      message: msg,
      path: 'canto.erc20.v1.MsgConvertERC20',
    }
  }