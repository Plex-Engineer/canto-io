import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { PrimaryButton } from "global/packages/src";
import { BaseToken } from "pages/bridge/config/interfaces";

interface ConfirmConvertProps {
  amount: BigNumber;
  token: BaseToken;
  toERC20: boolean;
  txMessage: React.ReactNode;
  convertTx: () => Promise<void>;
}
export const ConfirmConvert = (props: ConfirmConvertProps) => {
  return (
    <div>
      <h1>Confirm Convert</h1>
      <p>Token: {props.token.name}</p>
      <p>Amount: {formatUnits(props.amount, props.token.decimals)}</p>
      <PrimaryButton onClick={props.convertTx}>Bridge In Here</PrimaryButton>
      <p>{props.txMessage}</p>
    </div>
  );
};
