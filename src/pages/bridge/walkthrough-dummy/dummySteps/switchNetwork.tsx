import { useEthers } from "@usedapp/core";
import { PrimaryButton } from "global/packages/src";

export const SwitchNetwork = (props: {
  chainId: number;
  onClick: () => void;
}) => {
  const { switchNetwork } = useEthers();
  return (
    <div>
      <PrimaryButton onClick={props.onClick}>Switch Network</PrimaryButton>
    </div>
  );
};
