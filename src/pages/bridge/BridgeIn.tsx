import { useEffect, useState } from "react";
import { useBridgeStore } from "./stores/gravityStore";
import styled from "@emotion/styled";
import { useApprove, useCosmos } from "./hooks/useTransactions";
import { useEthers } from "@usedapp/core";
import { BigNumber, ethers } from "ethers";
import { useNetworkInfo } from "global/stores/networkInfo";
import SwitchBridging from "./components/SwitchBridging";
import cantoIcon from "assets/icons/canto-evm.svg";
import ethIcon from "assets/icons/ETH.svg";
import { ReactiveButton } from "./components/ReactiveButton";
import { ConvertTransferBox } from "./components/convertTransferBox";
import { TokenWallet } from "./components/TokenSelect";
import {
  UserGravityBridgeTokens,
  EmptySelectedETHToken,
  EmptySelectedNativeToken,
  UserConvertToken,
} from "./config/interfaces";
import { SelectedTokens, useTokenStore } from "./stores/tokenStore";
import { formatUnits } from "ethers/lib/utils";
import { convertStringToBigNumber } from "./utils/stringToBigNumber";
import { GeneralTransferBox } from "./components/generalTransferBox";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import FadeIn from "react-fade-in";
import { ADDRESSES } from "global/config/addresses";
import { Text } from "global/packages/src";

interface BridgeInProps {
  userEthTokens: UserGravityBridgeTokens[];
  gravityAddress: string | undefined;
  userConvertCoinNativeTokens: UserConvertToken[];
}
const BridgeIn = ({
  userEthTokens,
  gravityAddress,
  userConvertCoinNativeTokens,
}: BridgeInProps) => {
  const networkInfo = useNetworkInfo();
  const { switchNetwork, activateBrowserWallet } = useEthers();
  const tokenStore = useTokenStore();
  const selectedETHToken = tokenStore.selectedTokens[SelectedTokens.ETHTOKEN];
  const bridgeStore = useBridgeStore();
  const [amount, setAmount] = useState("");
  //function states for approving/bridging
  const {
    state: stateApprove,
    send: sendApprove,
    resetState: resetApprove,
  } = useApprove(selectedETHToken.address);
  const {
    state: stateCosmos,
    send: sendCosmos,
    resetState: resetCosmos,
  } = useCosmos(gravityAddress ?? ADDRESSES.ETHMainnet.GravityBridge);

  //event tracker
  useEffect(() => {
    bridgeStore.setApproveStatus(stateApprove.status);
    if (stateApprove.status == "Success") {
      tokenStore.setSelectedToken(
        {
          ...selectedETHToken,
          allowance: BigNumber.from(ethers.constants.MaxUint256),
        },
        SelectedTokens.ETHTOKEN
      );
      setTimeout(() => {
        resetApprove();
      }, 1000);
    }
  }, [stateApprove.status]);

  useEffect(() => {
    bridgeStore.setCosmosStatus(stateCosmos.status);
  }, [stateCosmos.status]);

  const send = (amount: string) => {
    //Checking if amount enter is greater than balance available in wallet and token has been approved.
    const parsedAmount = convertStringToBigNumber(
      amount,
      selectedETHToken.decimals
    );
    if (!networkInfo.cantoAddress) return;
    if (
      (parsedAmount.gte(selectedETHToken.allowance) ||
        selectedETHToken.allowance.lte(0)) &&
      stateApprove.status == "None"
    ) {
      sendApprove(
        gravityAddress,
        BigNumber.from(
          "115792089237316195423570985008687907853269984665640564039457584007913129639935"
        )
      );
    } else if (parsedAmount.gt(0) && stateCosmos.status == "None") {
      sendCosmos(
        selectedETHToken.address,
        networkInfo.cantoAddress,
        parsedAmount
      );
    }
  };

  return (
    <FadeIn wrapperTag={BridgeStyled}>
      <div className="title">
        <Text
          type="title"
          size="title2"
          color="primary"
          style={{
            fontFamily: "Silkscreen",
            lineHeight: "3rem",
          }}
        >
          send funds to canto
        </Text>

        <Text
          type="text"
          color="primary"
          style={{
            margin: "0 1rem",
            fontSize: "14px",
            lineHeight: "20.3px",
          }}
        >
          funds are transferred in two steps through our canto bridge. <br /> it
          takes several minutes. for more details{" "}
          <a
            role="button"
            tabIndex={0}
            onClick={() =>
              window.open(
                "https://docs.canto.io/user-guides/bridging-assets/ethereum",
                "_blank"
              )
            }
            style={{
              color: "var(--primary-color)",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            read here
          </a>
          .
        </Text>
      </div>
      <SwitchBridging
        left={{
          icon: ethIcon,
          name: "Ethereum",
        }}
        right={{
          icon: cantoIcon,
          name: "EVM",
        }}
      />

      {bridgeStore.transactionType == "Bridge" && (
        <GeneralTransferBox
          tokenSelector={
            <TokenWallet
              tokens={userEthTokens}
              balance={"balanceOf"}
              activeToken={selectedETHToken}
              onSelect={(value) => {
                tokenStore.setSelectedToken(
                  value ?? EmptySelectedETHToken,
                  SelectedTokens.ETHTOKEN
                );
                resetCosmos();
                resetApprove();
              }}
            />
          }
          needAddressBox={false}
          from={{
            address: networkInfo.account,
            name: "ethereum",
            // icon: ethIcon,
          }}
          to={{
            address: networkInfo.cantoAddress,
            name: "canto (bridge)",
            // icon: bridgeIcon,
          }}
          networkName="ethereum"
          onSwitch={() => {
            activateBrowserWallet();
            switchNetwork(1);
          }}
          connected={1 == Number(networkInfo.chainId)}
          onChange={(amount: string) => setAmount(amount)}
          max={formatUnits(
            selectedETHToken.balanceOf,
            selectedETHToken.decimals
          )}
          amount={amount}
          button={
            <ReactiveButton
              destination={networkInfo.cantoAddress}
              amount={amount}
              account={networkInfo.account}
              token={selectedETHToken}
              gravityAddress={gravityAddress}
              onClick={() => send(amount)}
            />
          }
        />
      )}

      {bridgeStore.transactionType == "Convert" && (
        <ConvertTransferBox
          tokenSelector={
            <TokenWallet
              tokens={userConvertCoinNativeTokens}
              balance="nativeBalance"
              activeToken={tokenStore.selectedTokens[SelectedTokens.CONVERTIN]}
              onSelect={(value) => {
                tokenStore.setSelectedToken(
                  value ?? EmptySelectedNativeToken,
                  SelectedTokens.CONVERTIN
                );
                resetCosmos();
                resetApprove();
              }}
            />
          }
          activeToken={tokenStore.selectedTokens[SelectedTokens.CONVERTIN]}
          cantoToEVM={true}
          cantoAddress={networkInfo.cantoAddress}
          ETHAddress={networkInfo.account ?? ""}
          chainId={Number(networkInfo.chainId)}
          amount={amount}
          max={
            tokenStore.selectedTokens[SelectedTokens.CONVERTIN].nativeBalance
          }
          onChange={(amount: string) => setAmount(amount)}
          onSwitch={() => {
            activateBrowserWallet();
            addNetwork();
          }}
        />
      )}
    </FadeIn>
  );
};

export const BridgeStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding: 50px 0;
  flex-grow: 1;

  @media (max-width: 1000px) {
    br {
      display: none;
    }
  }
`;
export default BridgeIn;
