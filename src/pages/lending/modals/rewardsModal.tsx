import logo from "assets/logo.svg";
import { truncateNumber } from "global/utils/formattingNumbers";
import { UserLMRewards } from "pages/lending/config/interfaces";
import { ethers } from "ethers";
import { valueInNote } from "pages/dexLP/utils/utils";
import { PrimaryButton, Text } from "global/packages/src";
import { RewardsContainer } from "../components/Styled";
import TokenSymbol from "global/packages/src/components/atoms/NoteSymbol";
import { claimLendingRewardsTx } from "../utils/transactions";
import { useTransactionStore } from "global/stores/transactionStore";

interface Props {
  rewardsObj: UserLMRewards;
}
const formatUnits = ethers.utils.formatUnits;
const RewardsModal = ({ rewardsObj }: Props) => {
  const txStore = useTransactionStore();

  return (
    <RewardsContainer>
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
            : ""}
        </Text>
      </div>
      <div className="balances">
        <div className="bal line">
          <Text className="type">rewards in note value</Text>
          <Text className="value">
            {truncateNumber(
              formatUnits(valueInNote(rewardsObj.accrued, rewardsObj.price))
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
        onClick={() =>
          claimLendingRewardsTx(
            txStore,
            rewardsObj.wallet,
            rewardsObj.cantroller,
            rewardsObj.accrued,
            rewardsObj.comptrollerBalance
          )
        }
      >
        claim
      </PrimaryButton>
    </RewardsContainer>
  );
};

export default RewardsModal;
