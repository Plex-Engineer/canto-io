import { BigNumber } from "ethers";
import { CantoMainnet } from "global/config/networks";
import { PrimaryButton } from "global/packages/src";
import { useNetworkInfo } from "global/stores/networkInfo";
import {
  allBridgeOutNetworks,
  convertCoinTokens,
} from "pages/bridge/config/gravityBridgeTokens";
import {
  BaseToken,
  BridgeTransactionType,
  UserConvertToken,
  UserNativeTokens,
} from "pages/bridge/config/interfaces";
import { useCantoERC20Balances } from "pages/bridge/hooks/useERC20Balances";
import { SelectedTokens, useTokenStore } from "pages/bridge/stores/tokenStore";
import useBridgeTxStore from "pages/bridge/stores/transactionStore";
import { getNativeCantoBalance } from "pages/bridge/utils/nativeBalances";
import { convertStringToBigNumber } from "pages/bridge/utils/stringToBigNumber";
import { useEffect, useState } from "react";
import { useBridgeWalkthroughStore } from "../store/bridgeWalkthroughStore";
import { didPassBridgeOutWalkthroughCheck } from "../walkthroughFunctions";
import {
  BridgeInWalkthroughSteps,
  BridgeOutWalkthroughSteps,
} from "../walkthroughTracker";
import { BridgeInStart } from "./in/bridgeInStart";
import { BridgeOutWalkthroughManager } from "./out/bridgeOutWalkthroughManager";

enum Paths {
  NONE,
  BRIDGE_IN,
  BRIDGE_OUT,
}
export const WalkthroughHomeScreen = () => {
  //all stores we needed here:
  const walkthroughStore = useBridgeWalkthroughStore();
  const networkInfo = useNetworkInfo();
  const tokenStore = useTokenStore();
  const bridgeTxStore = useBridgeTxStore();

  //constants to stop reference repetition
  const bridgeOutToken = tokenStore.selectedTokens[SelectedTokens.BRIDGEOUT];
  const convertOutToken = tokenStore.selectedTokens[SelectedTokens.CONVERTOUT];

  const [amount, setAmount] = useState("");

  const [pathSelected, setPathSelected] = useState(Paths.NONE);
  const [userConvertTokens, setUserConvertTokens] = useState<
    UserConvertToken[]
  >([]);
  const [userBridgeOutTokens, setUserBridgeOutTokens] = useState<
    UserNativeTokens[]
  >([]);

  //set the convert erc20 tokens
  const { userTokens: userConvertERC20Tokens, fail: cantoERC20Fail } =
    useCantoERC20Balances(
      networkInfo.account,
      convertCoinTokens,
      CantoMainnet.chainId
    );
  async function getConvertCoinTokens() {
    const convertNativeWithBalance = await getNativeCantoBalance(
      CantoMainnet.cosmosAPIEndpoint,
      networkInfo.cantoAddress,
      convertCoinTokens
    );
    if (!cantoERC20Fail) {
      setUserConvertTokens(
        userConvertERC20Tokens.map((token) => {
          return {
            ...token,
            nativeBalance:
              convertNativeWithBalance.find(
                (nativeToken) => nativeToken.nativeName === token.nativeName
              )?.nativeBalance ?? BigNumber.from(0),
          };
        })
      );
    }
  }
  async function getBridgeOutTokens() {
    const bridgeOutTokens = await getNativeCantoBalance(
      CantoMainnet.cosmosAPIEndpoint,
      networkInfo.cantoAddress,
      allBridgeOutNetworks[tokenStore.bridgeOutNetwork].tokens
    );
    setUserBridgeOutTokens(bridgeOutTokens);
  }
  async function getAllBalances() {
    await getConvertCoinTokens();
    await getBridgeOutTokens();
  }
  useEffect(() => {
    if (networkInfo.account && networkInfo.cantoAddress) {
      getAllBalances();
    }
  }, [networkInfo.account, networkInfo.cantoAddress]);
  useEffect(() => {
    getConvertCoinTokens();
  }, [cantoERC20Fail]);
  useEffect(() => {
    getBridgeOutTokens();
  }, [tokenStore.bridgeOutNetwork]);

  //Useffect for calling data per block
  useEffect(() => {
    if (networkInfo.account && networkInfo.cantoAddress) {
      const interval = setInterval(async () => {
        await getAllBalances();
        //reselecting the tokens so it is the most updated version
        // tokenStore.resetSelectedToken(SelectedTokens.ETHTOKEN, userEthGTokens);
        tokenStore.resetSelectedToken(
          SelectedTokens.CONVERTIN,
          userConvertTokens
        );
        tokenStore.resetSelectedToken(
          SelectedTokens.CONVERTOUT,
          userConvertTokens
        );
        tokenStore.resetSelectedToken(
          SelectedTokens.BRIDGEOUT,
          userBridgeOutTokens
        );
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [userBridgeOutTokens, userConvertTokens]);

  function checkIfCanContinue() {
    const bridgeIn = pathSelected === Paths.BRIDGE_IN;
    if (bridgeIn) {
      return false;
    } else {
      const currentStep = walkthroughStore.bridgeOutStep;
      return didPassBridgeOutWalkthroughCheck(
        currentStep,
        Number(networkInfo.chainId),
        convertOutToken,
        convertStringToBigNumber(amount, convertOutToken.decimals),
        convertOutToken.erc20Balance,
        bridgeTxStore.transactionStatus?.type ===
          BridgeTransactionType.CONVERT_OUT
          ? bridgeTxStore.transactionStatus.status
          : "None",
        allBridgeOutNetworks[tokenStore.bridgeOutNetwork],
        bridgeOutToken,
        convertStringToBigNumber(amount, bridgeOutToken.decimals),
        bridgeOutToken.nativeBalance,
        bridgeTxStore.transactionStatus?.type ===
          BridgeTransactionType.BRIDGE_OUT
          ? bridgeTxStore.transactionStatus.status
          : "None"
      );
    }
  }
  function checkIfPrevIsHome() {
    const currentStep =
      pathSelected === Paths.BRIDGE_IN
        ? walkthroughStore.bridgeInStep
        : walkthroughStore.bridgeOutStep;
    if (currentStep === 0) {
      setPathSelected(Paths.NONE);
    } else {
      walkthroughStore.previousStep(pathSelected === Paths.BRIDGE_IN);
    }
  }
  function checkIfNextIsComplete() {
    const currentWalkthroughStep =
      pathSelected === Paths.BRIDGE_IN
        ? BridgeInWalkthroughSteps[walkthroughStore.bridgeInStep]
        : BridgeOutWalkthroughSteps[walkthroughStore.bridgeOutStep];
    if (currentWalkthroughStep.next == undefined) {
      setPathSelected(Paths.NONE);
      walkthroughStore.resetState(false);
    } else {
      walkthroughStore.nextStep(pathSelected === Paths.BRIDGE_IN);
    }
  }
  return (
    <div>
      {pathSelected === Paths.NONE && (
        <>
          <h1>Walkthrough Home Screen</h1>
          <p>Select PATH</p>
          <button
            onClick={() => {
              walkthroughStore.resetState(true);
              setPathSelected(Paths.BRIDGE_IN);
            }}
          >
            Bridge In
          </button>
          <button
            onClick={() => {
              walkthroughStore.resetState(false);
              setPathSelected(Paths.BRIDGE_OUT);
            }}
          >
            Bridge Out
          </button>
        </>
      )}
      {pathSelected === Paths.BRIDGE_IN && <BridgeInStart />}
      {pathSelected === Paths.BRIDGE_OUT && (
        <BridgeOutWalkthroughManager
          cantoAddress={networkInfo.cantoAddress}
          currentStep={walkthroughStore.bridgeOutStep}
          convertTokens={userConvertTokens}
          currentConvertToken={convertOutToken}
          bridgeOutNetwork={allBridgeOutNetworks[tokenStore.bridgeOutNetwork]}
          bridgeOutTokens={userBridgeOutTokens}
          currentBridgeOutToken={bridgeOutToken}
          selectToken={(token: BaseToken, from: SelectedTokens) =>
            tokenStore.setSelectedToken(token, from)
          }
          amount={amount}
          setAmount={(amount) => setAmount(amount)}
          setTxStatus={bridgeTxStore.setTransactionStatus}
          txMessage={bridgeTxStore.transactionStatus?.message}
        />
      )}
      {pathSelected !== Paths.NONE && (
        <>
          <PrimaryButton onClick={() => checkIfPrevIsHome()}>
            prev
          </PrimaryButton>
          <PrimaryButton
            disabled={!checkIfCanContinue()}
            onClick={() => checkIfNextIsComplete()}
          >
            next
          </PrimaryButton>
        </>
      )}
    </div>
  );
};
