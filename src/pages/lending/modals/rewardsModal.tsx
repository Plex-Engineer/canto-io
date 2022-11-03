import logo from "assets/logo.svg";
import { useEffect } from "react";
import {
  getTransactionStatusString,
  noteSymbol,
  transactionStatusActions,
  truncateNumber,
} from "global/utils/utils";
import { useClaim, useDrip } from "pages/lending/hooks/useTransaction";
import { UserLMRewards } from "pages/lending/config/interfaces";
import { ethers } from "ethers";
import { valueInNote } from "pages/dexLP/utils/utils";
import { PrimaryButton } from "global/packages/src";
import { RewardsContainer } from "../components/Styled";
import { reservoirAdddress } from "../config/lendingMarketTokens";

interface Props {
  rewardsObj: UserLMRewards;
  onClose: () => void;
}
const formatUnits = ethers.utils.formatUnits;
const RewardsModal = ({ rewardsObj, onClose }: Props) => {
  const { send, state } = useClaim(rewardsObj.cantroller);
  const { send: sendDrip, state: stateDrip } = useDrip(reservoirAdddress);

  useEffect(() => {
    // console.log(enterState)
    if (["Success", "Fail", "Exception"].includes(state.status)) {
      setTimeout(onClose, 500);
    }
  }, [state.status]);
  const statusObj = transactionStatusActions("claim");
  //boolean for if the user needs to call drip in order to claim their rewards
  const needDrip = rewardsObj.comptrollerBalance.lt(rewardsObj.accrued);
  return (
    <RewardsContainer>
      <div className="title">canto balance</div>
      <div className="logo">
        <img src={logo} height={30} />
      </div>
      <p className="mainBalance">
        {truncateNumber(formatUnits(rewardsObj.walletBalance, 18))}
      </p>
      <p className="secondaryBalance">
        {noteSymbol}
        {truncateNumber(
          formatUnits(valueInNote(rewardsObj.walletBalance, rewardsObj.price))
        )}
      </p>
      <div className="balances">
        <div className="bal line">
          <p className="type">wallet balance</p>
          <p className="value">
            {truncateNumber(formatUnits(rewardsObj.walletBalance, 18))}
          </p>
        </div>
        <div className="bal line">
          <p className="type">unclaimed balance</p>
          <p className="value">
            {truncateNumber(formatUnits(rewardsObj.accrued, 18))}
          </p>
        </div>
        <div className="bal">
          <p className="type">value</p>
          <p className="value">
            {noteSymbol}{" "}
            {truncateNumber(
              formatUnits(valueInNote(rewardsObj.accrued, rewardsObj.price))
            )}
          </p>
        </div>
      </div>
      <PrimaryButton
        style={{ margin: "2rem" }}
        size="lg"
        disabled={rewardsObj.accrued.isZero()}
        onClick={() => {
          if (needDrip) {
            sendDrip();
          }
          if (state.status != "Mining" && state.status != "Success")
            send(rewardsObj.wallet);
        }}
      >
        {needDrip
          ? "drip and claim"
          : !rewardsObj.accrued.isZero()
          ? getTransactionStatusString(
              statusObj.action,
              statusObj.inAction,
              statusObj.postAction,
              state.status
            )
          : "nothing to claim"}
      </PrimaryButton>
    </RewardsContainer>
  );
};

// 'None' | 'PendingSignature' | 'Mining' | 'Success' | 'Fail' | 'Exception'

export default RewardsModal;
