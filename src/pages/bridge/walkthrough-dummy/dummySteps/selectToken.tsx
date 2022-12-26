import { TokenWallet } from "pages/bridge/components/TokenSelect";
import { BaseToken } from "pages/bridge/config/interfaces";

interface SelectTokenProps {
  tokenBalance: string;
  tokenList: BaseToken[];
  activeToken: BaseToken;
  onSelect: (token: BaseToken) => void;
}
export const SelectToken = (props: SelectTokenProps) => {
  return (
    <TokenWallet
      tokens={props.tokenList}
      activeToken={props.activeToken}
      onSelect={(token) => props.onSelect(token ?? props.activeToken)}
      balance={props.tokenBalance}
    />
  );
};
