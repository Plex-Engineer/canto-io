import {
  createTxMsgDelegate,
  createMessageSend,
  createTxMsgUndelegate,
  createTxMsgMultipleWithdrawDelegatorReward,
  createTxMsgBeginRedelegate,
} from "@tharsis/transactions";
import {
  generateEndpointDistributionRewardsByAddress,
  generateEndpointGetDelegations,
  generateEndpointGetValidators,
  generateEndpointGetUndelegations,
  generateEndpointBalances,
  createTxMsgWithdrawValidatorCommission,
  generateEndpointAccount,
} from "@tharsis/provider";
import {
  getSenderObj,
  signAndBroadcastTxMsg,
  ethToCanto,
} from "../../../global/utils/cantoTransactions/helpers";
import { BigNumber } from "ethers";

const ACCEPT_APPLICATION_JSON = "application/json";
/**
 * Transaction that stakes given amount to the designataed validator
 * @param {string} validator validator address string beginning with 'cantovaloper'
 * @param {string} amount amount to stake in string format e.g. '30000000000000000'
 * @param {string} nodeAddressIP node ip with port 1317
 * @param {object} fee fee object
 * @param {object} chain chain object
 * @param {string} memo memo in string format (defautl to empty)
 */
export async function txStake(
  account,
  validator,
  amount,
  nodeAddressIP,
  fee,
  chain,
  memo
) {
  // get sender object using eth address
  const senderObj = await getSenderObj(account, nodeAddressIP);

  const params = {
    validatorAddress: validator,
    amount: amount,
    denom: "acanto",
  };

  // create the msg to delegate
  const msg = createTxMsgDelegate(chain, senderObj, fee, memo, params);
  return await signAndBroadcastTxMsg(
    msg,
    senderObj,
    chain,
    nodeAddressIP,
    account
  );
}

/**
 * Transaction that unstakes given amount to the designated validator
 * @param {string} validator validator address string beginning with 'cantovaloper'
 * @param {string} amount amount to stake in string format e.g. '30000000000000000'
 * @param {string} nodeAddressIP node ip with port 1317
 * @param {object} fee fee object
 * @param {object} chain chain object
 * @param {string} memo memo in string format (defautl to empty)
 */
export async function txUnstake(
  account,
  validator,
  amount,
  nodeAddressIP,
  fee,
  chain,
  memo
) {
  // get sender object using eth address
  const senderObj = await getSenderObj(account, nodeAddressIP);

  const params = {
    validatorAddress: validator,
    amount: amount,
    denom: "acanto",
  };

  // create the msg to delegate
  const msg = createTxMsgUndelegate(chain, senderObj, fee, memo, params);
  return await signAndBroadcastTxMsg(
    msg,
    senderObj,
    chain,
    nodeAddressIP,
    account
  );
}

/**
 * Transaction that stakes given amount to the designataed validator
 * @param {string} validator validator address string beginning with 'cantovaloper'
 * @param {string} amount amount to stake in string format e.g. '30000000000000000'
 * @param {string} nodeAddressIP node ip with port 1317
 * @param {object} fee fee object
 * @param {object} chain chain object
 * @param {string} memo memo in string format (defautl to empty)
 */
export async function txRedelegate(
  account,
  amount,
  nodeAddressIP,
  fee,
  chain,
  memo,
  source,
  dest
) {
  // get sender object using eth address
  const senderObj = await getSenderObj(account, nodeAddressIP);

  const params = {
    validatorSrcAddress: source,
    validatorDstAddress: dest,
    amount: amount,
    denom: "acanto",
  };

  // create the msg to delegate
  const msg = createTxMsgBeginRedelegate(chain, senderObj, fee, memo, params);
  return await signAndBroadcastTxMsg(
    msg,
    senderObj,
    chain,
    nodeAddressIP,
    account
  );
}

/**
 * Transaction that claims rewards for all of the validators user delegated to
 * @param {string} nodeAddressIP node ip with port 1317
 * @param {object} fee fee object
 * @param {object} chain chain object
 * @param {string} memo memo in string format (defautl to empty)
 */
export async function txClaimRewards(
  account,
  nodeAddressIP,
  fee,
  chain,
  memo,
  validators
) {
  const params = {
    validatorAddresses: Array.from(
      validators.map((validator) => {
        return validator["operator_address"];
      })
    ),
  };

  // get sender object using eth address
  const senderObj = await getSenderObj(account, nodeAddressIP);

  // create the msg to delegate
  const msg = createTxMsgMultipleWithdrawDelegatorReward(
    chain,
    senderObj,
    fee,
    memo,
    params
  );
  await signAndBroadcastTxMsg(msg, senderObj, chain, nodeAddressIP, account);
}

/**
 * Transaction that claims rewards a validator
 * @param {string} validatorAddress address of the validator
 * @param {string} nodeAddressIP node ip with port 1317
 * @param {object} fee fee object
 * @param {object} chain chain object
 * @param {string} memo memo in string format (defautl to empty)
 */
export async function txClaimValidatorCommisions(
  validatorAddress,
  nodeAddressIP,
  fee,
  chain,
  memo
) {
  // get metamask account address
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const account = accounts[0];

  const params = {
    validatorAddress: validatorAddress,
  };

  // get sender object using eth address
  const senderObj = await getSenderObj(account, nodeAddressIP);

  // create the msg to delegate
  const msg = createTxMsgWithdrawValidatorCommission(
    chain,
    senderObj,
    fee,
    memo,
    params
  );
  signAndBroadcastTxMsg(msg, senderObj, chain, nodeAddressIP, account);
}

/**
 * https://github.com/evmos/evmosjs/blob/193244306f544eea6b2070e3f9563cb48ca21094/packages/provider/src/rest/staking.ts#L66-L82
 * @param {string} nodeAddressIP node ip with port 1317
 */
export async function getDelegationsForAddress(nodeAddressIP, address) {
  const cantoAddress = await ethToCanto(address, nodeAddressIP);
  const url = nodeAddressIP + generateEndpointGetDelegations(cantoAddress);

  const options = {
    method: "GET",
    headers: {
      Accept: ACCEPT_APPLICATION_JSON,
    },
  };

  return await fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      return result.delegation_responses;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
}

/**
 * https://github.com/evmos/evmosjs/blob/193244306f544eea6b2070e3f9563cb48ca21094/packages/provider/src/rest/staking.ts#L89-L109
 * @param {string} nodeAddressIP node ip with port 1317
 */
export async function getUndelegationsForAddress(nodeAddressIP, address) {
  const cantoAddress = await ethToCanto(address, nodeAddressIP);
  const url = nodeAddressIP + generateEndpointGetUndelegations(cantoAddress);

  const options = {
    method: "GET",
    headers: {
      Accept: ACCEPT_APPLICATION_JSON,
    },
  };

  return await fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      let undelegation_map = {};
      let validators = [];

      let totalUnbonding = BigNumber.from("0");
      result.unbonding_responses.forEach((undelegation) => {
        let validator_info = {};
        let validator_unbonding = BigNumber.from("0");
        const { entries, validator_address } = undelegation;
        validator_info["name"] = validator_address;

        let lockouts = [];
        entries.forEach((entry) => {
          let lockout_object_info = {};
          lockout_object_info["complete_time_stamp"] = entry.completion_time;
          lockout_object_info["value_of_coin"] = BigNumber.from(entry.balance);
          lockouts.push(lockout_object_info);
          validator_unbonding = validator_unbonding.add(
            BigNumber.from(entry.balance)
          );
          totalUnbonding = totalUnbonding.add(BigNumber.from(entry.balance));
        });
        validator_info["lockouts"] = lockouts;
        validator_info["validator_unbonding"] = validator_unbonding;
        validators.push(validator_info);
      });

      undelegation_map["total_unbonding"] = totalUnbonding;
      undelegation_map["validators"] = validators;
      return undelegation_map;
    })
    .catch((err) => {
      console.log(err);
      return {
        total_unbonding: BigNumber.from("0"),
      };
    });
}

/**
 * https://github.com/evmos/evmosjs/blob/193244306f544eea6b2070e3f9563cb48ca21094/packages/provider/src/rest/staking.ts#L22-L59
 * @param {string} nodeAddressIP node ip with port 1317
 */
export async function getValidators(nodeAddressIP) {
  const url = nodeAddressIP + generateEndpointGetValidators();

  const options = {
    method: "GET",
    headers: {
      Accept: ACCEPT_APPLICATION_JSON,
    },
  };

  return await fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      return result.validators;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
}

/**
 * https://github.com/evmos/evmosjs/blob/193244306f544eea6b2070e3f9563cb48ca21094/packages/provider/src/rest/balances.ts#L9-L15
 */
export async function getCantoBalance(nodeAddressIP, address) {
  const cantoAddress = await ethToCanto(address, nodeAddressIP);
  const url = nodeAddressIP + generateEndpointBalances(cantoAddress);

  const options = {
    method: "GET",
    headers: {
      Accept: ACCEPT_APPLICATION_JSON,
    },
  };

  return await fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      const balances = result.balances;
      let cantoBalance = BigNumber.from("0");
      balances.forEach((coin) => {
        if (coin.denom === "acanto") {
          cantoBalance = BigNumber.from(coin.amount);
        }
      });
      return cantoBalance;
    })
    .catch((err) => {
      console.log(err);
      return BigNumber.from("0");
    });
}

/**
 * https://github.com/evmos/evmosjs/blob/193244306f544eea6b2070e3f9563cb48ca21094/packages/provider/src/rest/staking.ts#L3-L19
 * @param {string} nodeAddressIP node ip with port 1317
 */
export async function getDistributionRewards(nodeAddressIP, address) {
  const cantoAddress = await ethToCanto(address, nodeAddressIP);
  const url =
    nodeAddressIP + generateEndpointDistributionRewardsByAddress(cantoAddress);

  const options = {
    method: "GET",
    headers: {
      Accept: ACCEPT_APPLICATION_JSON,
    },
  };

  return await fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      let cantoRewards = BigNumber.from("0");
      result.total.forEach((reward) => {
        if (reward.denom.includes("acanto")) {
          cantoRewards = BigNumber.from(reward.amount.split(".")[0]);
        }
      });
      return cantoRewards;
    })
    .catch((err) => {
      console.log(err);
      return BigNumber.from("0");
    });
}
