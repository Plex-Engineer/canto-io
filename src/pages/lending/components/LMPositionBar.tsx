import { Hero, LimitBar, ToolTipL } from "./Styled";
import { BigNumber } from "ethers";
import { OutlinedButton, Text } from "global/packages/src";
import { noteSymbol, truncateNumber } from "global/utils/utils";
import CypherText from "./CypherText";
import { formatUnits } from "ethers/lib/utils";
import Popup from "reactjs-popup";
import RewardsBox from "./RewardsBox";
import useModalStore, { ModalType } from "../stores/useModals";

interface LMPositionBarProps {
  borrowBalance: BigNumber;
  borrowLimit: BigNumber;
  supplyBalance: BigNumber;
  rewardBalance: string;
  isMobile: boolean;
}
export const LMPositionBar = ({
  borrowBalance,
  borrowLimit,
  supplyBalance,
  rewardBalance,
  isMobile,
}: LMPositionBarProps) => {
  const borrowPercentage = !borrowLimit.isZero()
    ? borrowBalance.mul(100).div(borrowLimit)
    : BigNumber.from(0);

  const modalStore = useModalStore();

  return (
    <>
      <Hero>
        <div>
          <Text type="title" align="left" size="text1">
            supply {isMobile ? "" : "balance"}
          </Text>
          {/* <h1 className="balance">{noteSymbol}{stats?.totalSupply.toFixed(2)??"000.00000"}</h1> */}
          <h1 className="balance">
            <span
              style={{
                fontSize: "21px",
              }}
            >
              {noteSymbol}
            </span>
            <CypherText
              text={
                supplyBalance.isZero()
                  ? "000.00"
                  : truncateNumber(formatUnits(supplyBalance, 18))
              }
            />
          </h1>
        </div>
        <div
          className="middle"
          style={
            {
              // backgroundColor: "red",
            }
          }
        >
          <RewardsBox rewards={rewardBalance} />
          <OutlinedButton
            weight="bold"
            style={{
              height: "36px",
            }}
            onClick={() => {
              modalStore.open(ModalType.BALANCE);
            }}
          >
            <Text type="text">claim</Text>
          </OutlinedButton>
          <Popup
            trigger={
              <LimitBar>
                <div className="bar">
                  {borrowPercentage.lte(80) ? (
                    <div
                      className="green"
                      style={{ width: borrowPercentage.toNumber() + "%" }}
                    ></div>
                  ) : (
                    <div
                      className="red"
                      style={{ width: borrowPercentage.toNumber() + "%" }}
                    ></div>
                  )}
                  {/* <div
                    className="gray"
                    style={{
                      width: 100 - borrowPercentage.toNumber() + "%",
                    }}
                  ></div> */}
                </div>
                <div
                  className="row"
                  style={{
                    padding: "6px 0",
                  }}
                >
                  <Text
                    type="text"
                    size="text4"
                    bold
                    style={{ color: "#007245" }}
                  >
                    limit ?
                  </Text>
                  <Text type="text" size="text4">
                    {noteSymbol + formatUnits(borrowLimit)} ·{" "}
                    {borrowPercentage.toNumber()}%
                  </Text>
                </div>
              </LimitBar>
            }
            position="top center"
            on={["hover", "focus"]}
            arrow={true}
          >
            <ToolTipL>
              {borrowPercentage.lt(80) ? (
                <p>
                  you will be liquidated if you go above your borrow limit{" "}
                  <br></br>
                  Liquidity Cushion:{" "}
                  {noteSymbol +
                    truncateNumber(formatUnits(borrowLimit.sub(borrowBalance)))}
                </p>
              ) : (
                <p>
                  you will be liquidated soon<br></br> Liquidity Cushion:{" "}
                  {noteSymbol +
                    truncateNumber(formatUnits(borrowLimit.sub(borrowBalance)))}
                </p>
              )}
            </ToolTipL>
          </Popup>
        </div>
        <div
          style={{
            textAlign: "right",
          }}
        >
          <Text id="bor-bal" type="title" size="text1" align="right">
            borrow {isMobile ? "" : "balance"}
          </Text>
          {/* <h1 className="balance">{noteSymbol}{stats?.totalBorrow.toFixed(2)??"000.00000"}</h1> */}
          <h1 className="balance">
            <span
              style={{
                fontSize: "21px",
              }}
            >
              {noteSymbol}
            </span>
            <CypherText
              text={
                borrowBalance.isZero()
                  ? "000.00"
                  : truncateNumber(formatUnits(borrowBalance, 18))
              }
            />
          </h1>
        </div>
      </Hero>
    </>
  );
};
