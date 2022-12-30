import { CantoMainnet } from "global/config/networks";
import { useEffect, useState } from "react";
import { useBridgeStore } from "./stores/gravityStore";
import { TokenWallet } from "./components/TokenSelect";
import { useEthers } from "@usedapp/core";
import { chain, ibcFee, memo } from "global/config/cosmosConstants";
import { txIBCTransfer } from "./utils/IBC/IBCTransfer";
import { ConvertTransferBox } from "./components/convertTransferBox";
import { useNetworkInfo } from "global/stores/networkInfo";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import cantoIcon from "assets/icons/canto-evm.svg";
import SwitchBridging from "./components/SwitchBridging";
import bridgeIcon from "assets/icons/canto-bridge.svg";

import {
  BridgeTransactionType,
  EmptySelectedConvertToken,
  EmptySelectedNativeToken,
  UserConvertToken,
  UserNativeTokens,
} from "./config/interfaces";
import { SelectedTokens, useTokenStore } from "./stores/tokenStore";
import { GeneralTransferBox } from "./components/generalTransferBox";
import { formatUnits } from "ethers/lib/utils";
import { convertStringToBigNumber } from "./utils/stringToBigNumber";
import {
  getBridgeOutButtonText,
  getConvertButtonText,
} from "./utils/reactiveButtonText";
import FadeIn from "react-fade-in";
import { PrimaryButton } from "global/packages/src";
import { Text } from "global/packages/src/components/atoms/Text";
import { BridgeStyled } from "./BridgeIn";
import { allBridgeOutNetworks } from "./config/gravityBridgeTokens";
import { Mixpanel } from "mixpanel";
import { CantoTransactionType } from "global/config/transactionTypes";
import { useTransactionChecklistStore } from "./stores/transactionChecklistStore";
import { updateLastBridgeOutTransactionStatus } from "./utils/checklistFunctions";
import { BridgeOutChecklistFunctionTracker } from "./config/transactionChecklist";
import { BridgeChecklistBox } from "./components/BridgeChecklistBox";
import useBridgeTxStore from "./stores/transactionStore";
import { performBridgeCosmosTxAndSetStatus } from "./utils/bridgeCosmosTxUtils";

interface BridgeOutProps {
  userConvertERC20Tokens: UserConvertToken[];
  userCantoNativeGTokens: UserNativeTokens[];
}
const BridgeOut = ({
  userCantoNativeGTokens,
  userConvertERC20Tokens,
}: BridgeOutProps) => {
  const networkInfo = useNetworkInfo();
  const bridgeTxStore = useBridgeTxStore();
  const tokenStore = useTokenStore();
  const selectedBridgeOutNetwork =
    allBridgeOutNetworks[tokenStore.bridgeOutNetwork];
  const selectedConvertToken =
    tokenStore.selectedTokens[SelectedTokens.CONVERTOUT];
  const selectedNativeToken =
    tokenStore.selectedTokens[SelectedTokens.BRIDGEOUT];

  const bridgeStore = useBridgeStore();
  const { activateBrowserWallet } = useEthers();

  //store for transactionchecklist
  const transactionChecklistStore = useTransactionChecklistStore();

  //BRIDGE OUT STATES
  const [userCosmosAddress, setUserCosmosAddress] = useState("");
  const [amount, setAmount] = useState("");

  const [bridgeButtonText, bridgeDisabled] = getBridgeOutButtonText(
    convertStringToBigNumber(amount, selectedNativeToken.decimals),
    selectedNativeToken,
    selectedNativeToken.nativeBalance,
    selectedBridgeOutNetwork.checkAddress(userCosmosAddress)
  );
  const [convertButtonText, convertDisabled] = getConvertButtonText(
    convertStringToBigNumber(amount, selectedConvertToken.decimals),
    selectedConvertToken,
    selectedConvertToken.erc20Balance,
    false
  );

  function updateLastBridgeOutChecklist() {
    const currentTx = transactionChecklistStore.getCurrentBridgeOutTx();
    if (currentTx) {
      updateLastBridgeOutTransactionStatus(
        (status, txHash) =>
          transactionChecklistStore.updateCurrentBridgeOutStatus(
            status,
            txHash
          ),
        currentTx,
        bridgeStore.transactionType,
        Number(networkInfo.chainId),
        convertDisabled,
        bridgeDisabled
      );
    }
  }
  useEffect(() => {
    if (!transactionChecklistStore.getCurrentBridgeOutTx()) {
      transactionChecklistStore.addBridgeOutTx();
    }
    updateLastBridgeOutChecklist();
  }, [
    transactionChecklistStore.getCurrentBridgeOutTx()?.currentStep,
    bridgeStore.transactionType,
    convertDisabled,
    bridgeDisabled,
    networkInfo.chainId,
  ]);

  return (
    <FadeIn wrapperTag={BridgeStyled}>
      <BridgeChecklistBox
        trackerList={BridgeOutChecklistFunctionTracker}
        totalTxs={transactionChecklistStore.bridgeOut.transactions.length}
        currentStep={
          transactionChecklistStore.getCurrentBridgeOutTx()?.currentStep ?? 0
        }
        addTx={transactionChecklistStore.addBridgeOutTx}
        removeTx={transactionChecklistStore.removeBridgeOutTx}
      />
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
          send funds from canto
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
          you must bridge your assets from the canto EVM to <br /> the canto
          (bridge) to bridge out{" "}
          <a
            role="button"
            tabIndex={0}
            onClick={() =>
              window.open(
                "https://docs.canto.io/user-guides/converting-assets",
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
          icon: cantoIcon,
          name: "EVM",
        }}
        right={{
          icon: selectedBridgeOutNetwork.icon,
          name: selectedBridgeOutNetwork.name,
          height: 48,
          selectable: true,
        }}
      />

      {bridgeStore.transactionType == "Bridge" && (
        <ConvertTransferBox
          tokenSelector={
            <TokenWallet
              tokens={userConvertERC20Tokens}
              balance="erc20Balance"
              activeToken={selectedConvertToken}
              onSelect={(value) => {
                tokenStore.setSelectedToken(
                  value ?? EmptySelectedConvertToken,
                  SelectedTokens.CONVERTOUT
                );
              }}
            />
          }
          activeToken={selectedConvertToken}
          cantoToEVM={false}
          cantoAddress={networkInfo.cantoAddress}
          ETHAddress={networkInfo.account ?? ""}
          chainId={Number(networkInfo.chainId)}
          amount={amount}
          onChange={(amount: string) => setAmount(amount)}
          onSwitch={() => {
            activateBrowserWallet();
            addNetwork();
          }}
          convertButtonText={convertButtonText}
          convertDisabled={convertDisabled}
        />
      )}

      {bridgeStore.transactionType == "Convert" && (
        <GeneralTransferBox
          tokenSelector={
            <TokenWallet
              tokens={userCantoNativeGTokens}
              balance="nativeBalance"
              activeToken={selectedNativeToken}
              onSelect={(value) => {
                tokenStore.setSelectedToken(
                  value ?? EmptySelectedNativeToken,
                  SelectedTokens.BRIDGEOUT
                );
              }}
            />
          }
          needAddressBox={true}
          onAddressChange={(value: string) => {
            setUserCosmosAddress(value);
          }}
          AddressBoxPlaceholder={`${selectedBridgeOutNetwork.name} address (${selectedBridgeOutNetwork.addressBeginning}...)`}
          from={{
            address: networkInfo.cantoAddress,
            name: "canto (bridge)",
            icon: bridgeIcon,
          }}
          to={{
            address: userCosmosAddress,
            name: selectedBridgeOutNetwork.name,
            icon: selectedBridgeOutNetwork.icon,
          }}
          networkName="canto"
          onSwitch={() => {
            activateBrowserWallet();
            addNetwork();
          }}
          connected={CantoMainnet.chainId == Number(networkInfo.chainId)}
          onChange={(amount: string) => {
            setAmount(amount);
          }}
          max={formatUnits(
            selectedNativeToken.nativeBalance,
            selectedNativeToken.decimals
          )}
          amount={amount}
          button={
            <PrimaryButton
              height="big"
              weight="bold"
              disabled={bridgeDisabled}
              onClick={async () => {
                Mixpanel.events.transactions.transactionStarted(
                  CantoTransactionType.BRIDGE_OUT,
                  {
                    tokenName: selectedNativeToken.symbol,
                    amount: amount,
                    bridgeOutNetwork: selectedBridgeOutNetwork.name,
                  }
                );
                performBridgeCosmosTxAndSetStatus(
                  async () =>
                    await txIBCTransfer(
                      userCosmosAddress,
                      selectedBridgeOutNetwork.channel,
                      convertStringToBigNumber(
                        amount,
                        selectedNativeToken.decimals
                      ).toString(),
                      selectedNativeToken.nativeName,
                      CantoMainnet.cosmosAPIEndpoint,
                      selectedBridgeOutNetwork.endpoint,
                      ibcFee,
                      chain,
                      memo
                    ),
                  BridgeTransactionType.BRIDGE_OUT,
                  bridgeTxStore.setTransactionStatus,
                  selectedNativeToken.name,
                  amount,
                  "canto bridge",
                  selectedBridgeOutNetwork.name
                );
              }}
            >
              {bridgeButtonText}
            </PrimaryButton>
          }
        />
      )}
    </FadeIn>
  );
};

export default BridgeOut;
