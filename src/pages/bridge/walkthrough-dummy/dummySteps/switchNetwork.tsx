import { useEthers } from "@usedapp/core";
import { PrimaryButton } from "global/packages/src";

export const SwitchNetwork = (props: { chainId: number }) => {
  const { switchNetwork } = useEthers();
  return (
    <div>
      <PrimaryButton
        onClick={() => {
          switchNetwork(props.chainId);
        }}
      >
        Switch Network
      </PrimaryButton>
    </div>
  );
};
