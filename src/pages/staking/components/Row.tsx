import styled from "@emotion/styled";
import { commify, formatEther } from "ethers/lib/utils";
import { truncateNumber } from "global/utils/formattingNumbers";
import { UndelegatingValidator } from "../config/interfaces";

interface RowProps {
  rank: number;
  name: string;
  totalStake: string;
  userStake: string;
  undelegationInfo?: UndelegatingValidator;
  commission: number;
  onClick: () => void;
  delay?: number;
}

const RowStyle = styled.tr<RowProps>`
  opacity: 0;
  animation: fadein 0.6s ${(props) => props.delay}s, fader 0.5s;
  animation-fill-mode: forwards;
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
const Row = (props: RowProps) => {
  return (
    <RowStyle
      {...props}
      onClick={() => {
        props.onClick();
      }}
    >
      <td>{props.rank}</td>
      <td>{props.name}</td>
      <td>
        {commify(truncateNumber(formatEther(props.totalStake))) + " canto"}
      </td>
      <td>
        {commify(truncateNumber(formatEther(props.userStake))) + " canto"}
      </td>
      <td>{props.undelegationInfo?.validator_unbonding.toString()}</td>
      <td>{props.commission * 100 + "%"}</td>
    </RowStyle>
  );
};

export default Row;
