import { ADDRESSES, CantoMainnet, Text } from "cantoui";
import ethIcon from "assets/icons/ETH.svg";
import TransferBox from "./components/TransferBox";
import { GTokens, useGravityTokens } from "./hooks/useGravityTokens";
import { useEffect, useState } from "react";
import { selectedEmptyToken, useTokenStore } from "./stores/tokens";
import styled from "@emotion/styled";
import { TokenWallet } from "./components/TokenSelect";
import { getCantoBalance, NativeGTokens } from "./hooks/useCosmosTokens";
import { useApprove, useCosmos } from "./hooks/useTransactions";
import { useEthers } from "@usedapp/core";
import { ReactiveButton } from "./components/ReactiveButton";
import { BigNumber, ethers } from "ethers";
import { ConvertTransferBox } from "./components/convertTransferBox";
import { useNetworkInfo } from "global/stores/networkInfo";
import { useEthGravityTokens } from "./hooks/useEthGravityTokens";
import { getNativeCantoBalance } from "./utils/nativeBalances";
const BridgeIn = () => {
  const networkInfo = useNetworkInfo();
  const tokenStore = useTokenStore();
  const { switchNetwork, activateBrowserWallet } = useEthers();
  const activeToken = useTokenStore().selectedToken;
  const [bridgeAmount, setBridgeAmount] = useState("0");

  //set the gravity token info from ethMainnet
  const { gravityTokens, gravityAddress } = useGravityTokens(
    networkInfo.account
  );

  // const { userEthGTokens, gravityAddress: P } = useEthGravityTokens(
  //   networkInfo.account
  // );

  //will contain the eth gravity tokens with the native canto balances
  const [cantoGravityTokens, setCantoGravityTokens] = useState<
    NativeGTokens[] | undefined
  >([]);

  async function getBalances(gravityTokens: GTokens[]) {
    const tokensWithBalances: NativeGTokens[] = await getCantoBalance(
      CantoMainnet.cosmosAPIEndpoint,
      networkInfo.cantoAddress,
      gravityTokens
    );
    setCantoGravityTokens(tokensWithBalances);
  }

  //Useffect for calling data per block
  useEffect(() => {
    const interval = setInterval(async () => {
      if (gravityTokens) {
        await getBalances(gravityTokens);
        tokenStore.setSelectedToken(
          cantoGravityTokens?.find(
            (token) =>
              token.data.address == tokenStore.selectedToken.data.address
          ) ?? tokenStore.selectedToken
        );
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [gravityTokens]);

  //setting native canto balances whenever eth gravity tokens change
  useEffect(() => {
    if (gravityTokens) {
      getBalances(gravityTokens);
    }
  }, [gravityTokens?.length]);

  //function states for approving/bridging
  const {
    state: stateApprove,
    send: sendApprove,
    resetState: resetApprove,
  } = useApprove(tokenStore.selectedToken.data.address);
  const {
    state: stateCosmos,
    send: sendCosmos,
    resetState: resetCosmos,
  } = useCosmos(gravityAddress ?? ADDRESSES.ETHMainnet.GravityBridge);

  //event tracker
  useEffect(() => {
    tokenStore.setApproveStatus(stateApprove.status);
    if (stateApprove.status == "Success") {
      tokenStore.setSelectedToken({
        ...tokenStore.selectedToken,
        allowance: Number.MAX_VALUE,
      });
      setTimeout(() => {
        resetApprove();
      }, 1000);
    }
  }, [stateApprove.status]);

  useEffect(() => {
    tokenStore.setCosmosStatus(stateCosmos.status);
  }, [stateCosmos.status]);

  const send = (amount: string) => {
    //Checking if amount enter is greater than balance available in wallet and token has been approved.
    if (!networkInfo.cantoAddress) return;
    if (
      (Number(amount) >= activeToken.allowance || activeToken.allowance <= 0) &&
      stateApprove.status == "None"
    ) {
      sendApprove(
        gravityAddress,
        BigNumber.from(
          "115792089237316195423570985008687907853269984665640564039457584007913129639935"
        )
      );
    } else if (Number(amount) > 0 && stateCosmos.status == "None") {
      sendCosmos(
        activeToken.data.address,
        networkInfo.cantoAddress,
        ethers.utils.parseUnits(amount, activeToken.data.decimals)
      );
    }
  };

  return (
    <Container>
      <Text type="title" color="white">
        send funds to canto
      </Text>
      <TokenWallet
        tokens={cantoGravityTokens}
        activeToken={tokenStore.selectedToken}
        onSelect={(value) => {
          tokenStore.setSelectedToken(value ?? selectedEmptyToken);
          resetCosmos();
          resetApprove();
        }}
      />
      <Text type="text" color="white" style={{ width: "70%" }}>
        it takes several minutes for your bridged assets to arrive on the canto
        network. for more details, read more{" "}
        <a
          href="https://docs.canto.io/user-guides/bridging-assets/ethereum"
          style={{
            color: "white",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          here
        </a>
        .
      </Text>
      <TransferBox
        from={{
          address: networkInfo.account,
          name: "ethereum",
          icon: ethIcon,
        }}
        to={{
          address: networkInfo.cantoAddress,
          name: "canto (bridge)",
        }}
        tokenIcon={tokenStore.selectedToken.data.icon}
        networkName="ethereum"
        onSwitch={() => {
          activateBrowserWallet();
          switchNetwork(1);
        }}
        tokenSymbol={tokenStore.selectedToken.data.symbol}
        connected={1 == Number(networkInfo.chainId)}
        onChange={(amount: string) => setBridgeAmount(amount)}
        max={tokenStore.selectedToken.balanceOf.toString()}
        amount={bridgeAmount}
        button={
          <ReactiveButton
            destination={networkInfo.cantoAddress}
            amount={bridgeAmount}
            account={networkInfo.account}
            token={tokenStore.selectedToken}
            gravityAddress={gravityAddress}
            disabled={false}
            onClick={() =>
              1 == Number(networkInfo.chainId) ? send(bridgeAmount) : {}
            }
          />
        }
      />

      <Text type="text" color="white" style={{ width: "70%" }}>
        you must bridge your assets from canto (bridge) to the canto EVM to use
        them on the canto network. read more{" "}
        <a
          href="https://docs.canto.io/user-guides/converting-assets"
          style={{
            color: "white",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          here
        </a>
        .
      </Text>

      <ConvertTransferBox
        cantoToEVM={true}
        cantoAddress={networkInfo.cantoAddress}
        ETHAddress={networkInfo.account ?? ""}
        token={tokenStore.selectedToken}
        chainId={Number(networkInfo.chainId)}
      />
    </Container>
  );
};

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 560px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
`;
export default BridgeIn;
