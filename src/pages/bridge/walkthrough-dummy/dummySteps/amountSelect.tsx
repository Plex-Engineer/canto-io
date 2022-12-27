import { Text } from "global/packages/src";
import { truncateNumber } from "global/utils/utils";

interface AmountSelectProps {
  onChange: (s: string) => void;
  amount: string;
  max: string;
}
export const AmountSelect = (props: AmountSelectProps) => {
  return (
    <div className="amount">
      <div className="amount-input">
        <Text type="text" size="text2" align="left" color="primary">
          amount :
        </Text>

        <input
          autoComplete="off"
          type="number"
          name="amount-bridge"
          id="amount-bridge"
          placeholder="0.00"
          value={props.amount}
          onChange={(e) => props.onChange(e.target.value)}
        />
        {Number(props.max) < 0 ? null : (
          <div className="max">
            balance {truncateNumber(props.max)}{" "}
            <span
              tabIndex={0}
              role="button"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => props.onChange(props.max)}
            >
              max
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
