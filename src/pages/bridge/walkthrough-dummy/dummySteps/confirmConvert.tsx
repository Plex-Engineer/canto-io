import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { PrimaryButton } from "global/packages/src";
import { UserConvertToken } from "pages/bridge/config/interfaces";

interface ConfirmConvertProps {
  amount: BigNumber;
  token: UserConvertToken;
  toERC20: boolean;
}
export const ConfirmConvert = (props: ConfirmConvertProps) => {
  return (
    <div>
      <h1>Confirm Convert</h1>
      <p>Token: {props.token.name}</p>
      <p>Amount: {formatUnits(props.amount, props.token.decimals)}</p>
      <PrimaryButton
        onClick={() => {
          console.log("clicked");
        }}
      >
        Bridge In Here
      </PrimaryButton>
    </div>
  );
};
