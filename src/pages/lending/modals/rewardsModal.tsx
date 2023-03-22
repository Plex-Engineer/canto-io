import logo from "assets/logo.svg";
import { truncateNumber } from "global/utils/utils";
import { useClaim, useDrip } from "pages/lending/hooks/useTransaction";
import { UserLMRewards } from "pages/lending/config/interfaces";
import { ethers } from "ethers";
import { valueInNote } from "pages/dexLP/utils/utils";
import { PrimaryButton, Text } from "global/packages/src";
import { RewardsContainer } from "../components/Styled";
import { reservoirAdddress } from "../config/lendingMarketTokens";
import GlobalLoadingModal from "global/components/modals/loadingModal";
import { CantoTransactionType } from "global/config/transactionTypes";
import TokenSymbol from "global/packages/src/components/atoms/NoteSymbol";

interface Props {
  rewardsObj: UserLMRewards;
  onClose: () => void;
}
const formatUnits = ethers.utils.formatUnits;
const RewardsModal = ({ rewardsObj, onClose }: Props) => {
  const { send, state } = useClaim(rewardsObj.cantroller);
  const { send: sendDrip, state: stateDrip } = useDrip(reservoirAdddress);

  //boolean for if the user needs to call drip in order to claim their rewards
  const needDrip = rewardsObj.comptrollerBalance.lt(rewardsObj.accrued);
  return (
    <RewardsContainer>
      {state.status != "None" && (
        <GlobalLoadingModal
          transactionType={CantoTransactionType.CLAIM_REWARDS}
          status={state.status}
          tokenName={"claim rewards"}
          txHash={state.transaction?.hash}
          onClose={onClose}
          mixPanelEventInfo={{
            amount: formatUnits(rewardsObj.accrued),
            tokenName: "WCANTO",
            tokenPrice: formatUnits(rewardsObj.price),
          }}
        />
      )}

      <div className="container">
        <div className="logo">
          <img src={logo} height={30} />
        </div>
        <Text type="title" size="text1">
          wcanto rewards
        </Text>
        <Text type="title" size="title1">
          {truncateNumber(formatUnits(rewardsObj.accrued, 18))}
        </Text>

        <Text type="text" size="text2" bold>
          {Number(truncateNumber(formatUnits(rewardsObj.accrued, 18))) < 0.001
            ? "Sorry, seems like you have nothing to claim yet!"
            : "Congratulations, you did a great job!"}
        </Text>
      </div>
      {/* <p className="secondaryBalance">
        {noteSymbol}
        {truncateNumber(
          formatUnits(valueInNote(rewardsObj.walletBalance, rewardsObj.price))
        )}
      </p> */}
      <div className="balances">
        <div className="bal line">
          <Text className="type">rewards in note value</Text>
          <Text className="value">
            {truncateNumber(
              formatUnits(
                valueInNote(rewardsObj.walletBalance, rewardsObj.price)
              )
            )}
            <TokenSymbol token="note" />
          </Text>
        </div>
        <div className="bal line">
          <Text className="type">current wallet balance</Text>
          <Text className="value">
            {truncateNumber(formatUnits(rewardsObj.walletBalance, 18))}
            <TokenSymbol token="canto" />
          </Text>
        </div>
        <div className="bal line">
          <Text className="type">unclaimed wcanto balance</Text>
          <Text className="value">
            {Number(truncateNumber(formatUnits(rewardsObj.accrued, 18)))}
            <TokenSymbol token="canto" />
          </Text>
        </div>
      </div>
      <PrimaryButton
        style={{ margin: "2rem" }}
        height={"big"}
        filled
        disabled={rewardsObj.accrued.isZero()}
        onClick={() => {
          if (needDrip) {
            sendDrip();
          }
          if (state.status != "Mining" && state.status != "Success")
            send(rewardsObj.wallet);
        }}
      >
        {needDrip ? "drip and claim" : "claim"}
      </PrimaryButton>
    </RewardsContainer>
  );
};

export default RewardsModal;
