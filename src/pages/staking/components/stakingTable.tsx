import { BigNumber } from "ethers";
import { commify, formatEther } from "ethers/lib/utils";
import { truncateNumber } from "global/utils/utils";
import cantoIcon from "assets/logo.svg";
import { MasterValidatorProps } from "../config/interfaces";
import useValidatorModalStore, {
  ValidatorModalType,
} from "../stores/validatorModalStore";
import Table from "./table";
import FadeIn from "react-fade-in";
import { levenshteinDistance } from "../utils/utils";
import jailedSymbol from "assets/jailed.svg";
import { ToolTip } from "pages/lending/components/Tooltip";
import { ToolTipL } from "pages/lending/components/Styled";
import Popup from "reactjs-popup";
import { formatLiquidity } from "pages/lending/utils/utils";
import { formatPercent } from "global/packages/src/utils/formatNumbers";

interface TableProps {
  validators: MasterValidatorProps[];
  sortBy: "validatorTotal" | "userTotal";
  searched?: string;
}
export const ValidatorTable = (props: TableProps) => {
  const validatorModalStore = useValidatorModalStore();
  const sortedValidators = props.validators.sort((a, b) => {
    if (props.searched) {
      return levenshteinDistance(
        props.searched,
        a.validator.description.moniker
      ) > levenshteinDistance(props.searched, b.validator.description.moniker)
        ? 1
        : -1;
    }
    const value1 =
      props.sortBy === "userTotal"
        ? a.userDelegations?.balance.amount
        : a.validator.tokens;
    const value2 =
      props.sortBy === "userTotal"
        ? b.userDelegations?.balance.amount
        : b.validator.tokens;

    return BigNumber.from(value1).gt(BigNumber.from(value2)) ? -1 : 1;
  });

  if (props.validators.length) {
    return (
      <Table
        columns={[
          "rank",
          "name",
          `validator total ${props.sortBy === "validatorTotal" ? "^" : ""}`,
          `my stake ${props.sortBy === "userTotal" ? "^" : ""}`,
          "commission",
        ]}
      >
        <FadeIn>
          {sortedValidators.map((validator, idx) => {
            return (
              <Row
                key={idx}
                rank={idx + 1}
                name={validator.validator.description.moniker}
                totalStake={validator.validator.tokens}
                userStake={validator.userDelegations?.balance.amount ?? "0"}
                commission={Number(
                  validator.validator.commission.commission_rates.rate
                )}
                jailed={validator.validator.jailed}
                onClick={() => {
                  validatorModalStore.setActiveValidator(validator);
                  validatorModalStore.open(ValidatorModalType.STAKE);
                }}
              />
            );
          })}
        </FadeIn>
      </Table>
    );
  } else {
    return null;
  }
};

interface RowProps {
  rank: number;
  name: string;
  totalStake: string;
  userStake: string;
  commission: number;
  jailed: boolean;
  onClick?: () => void;
}
const Row = (props: RowProps) => {
  return (
    <tr onClick={props.onClick}>
      <td>{props.rank}</td>
      <td>
        {props.name}
        {props.jailed ? (
          <Popup
            trigger={<img style={{ height: "20px" }} src={jailedSymbol} />}
            on={["hover", "focus"]}
          >
            <ToolTipL style={{ width: "175px" }}>
              This validator is currently jailed
            </ToolTipL>
          </Popup>
        ) : null}
      </td>
      <td>
        {formatLiquidity(Number(truncateNumber(formatEther(props.totalStake))))}{" "}
        <img src={cantoIcon} alt="canto" height={14} />
      </td>
      <td>
        {commify(truncateNumber(formatEther(props.userStake)))}
        <img src={cantoIcon} alt="canto" height={14} />
      </td>

      <td>{formatPercent(props.commission)}</td>
    </tr>
  );
};
