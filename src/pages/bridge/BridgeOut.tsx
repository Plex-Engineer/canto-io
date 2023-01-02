import { CantoMainnet } from "global/config/networks";
import { useEffect } from "react";
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
  BaseToken,
  BridgeTransactionType,
  EmptySelectedConvertToken,
  EmptySelectedNativeToken,
  UserConvertToken,
  UserNativeTokens,
} from "./config/interfaces";
import { SelectedTokens, TokenStore } from "./stores/tokenStore";
import { GeneralTransferBox } from "./components/generalTransferBox";
import { formatUnits } from "ethers/lib/utils";
import { convertStringToBigNumber } from "./utils/stringToBigNumber";
import FadeIn from "react-fade-in";
import { PrimaryButton } from "global/packages/src";
import { Text } from "global/packages/src/components/atoms/Text";
import { BridgeStyled } from "./BridgeIn";
import { Mixpanel } from "mixpanel";
import { CantoTransactionType } from "global/config/transactionTypes";
import { useTransactionChecklistStore } from "./stores/transactionChecklistStore";
import { updateLastBridgeOutTransactionStatus } from "./utils/checklistFunctions";
import { BridgeChecklistBox } from "./components/BridgeChecklistBox";
import useBridgeTxStore from "./stores/transactionStore";
import { performBridgeCosmosTxAndSetStatus } from "./utils/bridgeCosmosTxUtils";
import { useCustomCantoToCosmosInfo } from "./hooks/customBridgeOutInfo";
import { BridgeOutChecklistFunctionTracker } from "./config/transactionChecklist";
import { useCustomConvertInfo } from "./hooks/customConvertInfo";

interface BridgeOutProps {
  userConvertERC20Tokens: UserConvertToken[];
  userCantoNativeGTokens: UserNativeTokens[];
  selectedTokens: TokenStore["selectedTokens"];
  setToken: (token: BaseToken, selectedFrom: SelectedTokens) => void;
}
const BridgeOut = (props: BridgeOutProps) => {
  const networkInfo = useNetworkInfo();
  const bridgeTxStore = useBridgeTxStore();

  const selectedConvertToken = props.selectedTokens[SelectedTokens.CONVERTOUT];
  const selectedNativeToken = props.selectedTokens[SelectedTokens.BRIDGEOUT];
  const {
    bridgeOutNetwork,
    amount: bridgeOutAmount,
    setAmount: setBridgeOutAmount,
    userCosmosAddress,
    setUserCosmosAddress,
    bridgeDisabled,
    bridgeButtonText,
  } = useCustomCantoToCosmosInfo(selectedNativeToken);

  const {
    amount: convertAmount,
    setAmount: setConvertAmount,
    convertButtonText,
    convertDisabled,
  } = useCustomConvertInfo(false, selectedConvertToken);

  const bridgeStore = useBridgeStore();
  const { activateBrowserWallet } = useEthers();

  //store for transactionchecklist
  const transactionChecklistStore = useTransactionChecklistStore();

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
          icon: bridgeOutNetwork.icon,
          name: bridgeOutNetwork.name,
          height: 48,
          selectable: true,
        }}
      />

      {bridgeStore.transactionType == "Bridge" && (
        <ConvertTransferBox
          tokenSelector={
            <TokenWallet
              tokens={props.userConvertERC20Tokens}
              balance="erc20Balance"
              activeToken={selectedConvertToken}
              onSelect={(value) => {
                props.setToken(
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
          amount={convertAmount}
          onChange={(amount: string) => setConvertAmount(amount)}
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
              tokens={props.userCantoNativeGTokens}
              balance="nativeBalance"
              activeToken={selectedNativeToken}
              onSelect={(value) => {
                props.setToken(
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
          AddressBoxPlaceholder={`${bridgeOutNetwork.name} address (${bridgeOutNetwork.addressBeginning}...)`}
          from={{
            address: networkInfo.cantoAddress,
            name: "canto (bridge)",
            icon: bridgeIcon,
          }}
          to={{
            address: userCosmosAddress,
            name: bridgeOutNetwork.name,
            icon: bridgeOutNetwork.icon,
          }}
          networkName="canto"
          onSwitch={() => {
            activateBrowserWallet();
            addNetwork();
          }}
          connected={CantoMainnet.chainId == Number(networkInfo.chainId)}
          onChange={(amount: string) => {
            setBridgeOutAmount(amount);
          }}
          max={formatUnits(
            selectedNativeToken.nativeBalance,
            selectedNativeToken.decimals
          )}
          amount={bridgeOutAmount}
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
                    amount: bridgeOutAmount,
                    bridgeOutNetwork: bridgeOutNetwork.name,
                  }
                );
                performBridgeCosmosTxAndSetStatus(
                  async () =>
                    await txIBCTransfer(
                      userCosmosAddress,
                      bridgeOutNetwork.channel,
                      convertStringToBigNumber(
                        bridgeOutAmount,
                        selectedNativeToken.decimals
                      ).toString(),
                      selectedNativeToken.nativeName,
                      CantoMainnet.cosmosAPIEndpoint,
                      bridgeOutNetwork.endpoint,
                      ibcFee,
                      chain,
                      memo
                    ),
                  BridgeTransactionType.BRIDGE_OUT,
                  bridgeTxStore.setTransactionStatus,
                  selectedNativeToken.name,
                  bridgeOutAmount,
                  "canto bridge",
                  bridgeOutNetwork.name
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
