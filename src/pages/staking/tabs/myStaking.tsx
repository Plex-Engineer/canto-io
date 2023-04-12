import styled from "@emotion/styled";
import { formatEther } from "ethers/lib/utils";
import { Text } from "global/packages/src";
import NotConnected from "global/packages/src/components/molecules/NotConnected";
import { truncateNumber } from "global/utils/utils";
import InfoBar from "../components/InfoBar";
import { ValidatorTable } from "../components/stakingTable";
import { UndelegatingTable } from "../components/undelegatingTable";
import { MyStakingProps } from "../config/interfaces";
import walletIcon from "assets/wallet.svg";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import { useEthers } from "@usedapp/core";
import { useState } from "react";
import { setSafeConnector } from "global/components/cantoNav";

const MyStaking = (props: MyStakingProps) => {
  const { activateBrowserWallet } = useEthers();
  const [inSafe, setInSafe]= useState(false);
  setSafeConnector().then((value)=>{
    setInSafe(value);
  })
  return (
    <Styled>
      {!props.connected ? (
        <NotConnected
          style={{
            height: "calc(100vh - 14rem)",
          }}
          title="Wallet is not connected"
          subtext="to use staking you need to connect a wallet through the service metamask"
          buttonText="connect wallet"
          bgFilled
          icon={walletIcon}
          onClick={() => {
            inSafe? activateBrowserWallet({ type: "safe" }) : activateBrowserWallet({ type: "metamask" })
            addNetwork();
          }}
        />
      ) : (
        <>
          <div>
            <InfoBar
              balance={truncateNumber(formatEther(props.balance))}
              totalStaked={truncateNumber(formatEther(props.totalStaked))}
              totalUnbonding={truncateNumber(formatEther(props.totalUnbonding))}
              onRewards={props.onRewards}
              rewards={truncateNumber(formatEther(props.totalRewards))}
              apr={props.apr}
              canClaim={props.canClaim}
            />
            <Text
              type="title"
              size="title3"
              color="primary"
              align="left"
              hidden={props.userValidationInfo.length == 0}
            >
              current staking position
            </Text>
            <ValidatorTable
              validators={props.userValidationInfo}
              sortBy="userTotal"
            />

            <Text
              type="title"
              size="title3"
              color="primary"
              align="left"
              hidden={props.undelegationValidators.length == 0}
              style={{ marginTop: "2rem" }}
            >
              currently undelegating
            </Text>
            <UndelegatingTable validators={props.undelegationValidators} />
            <br />
          </div>
          <div
            style={{
              height: "60px",
            }}
          />
        </>
      )}
    </Styled>
  );
};

const Styled = styled.div`
  justify-content: center;
  width: 100vmax;
  max-width: 1200px;
`;

export default MyStaking;
