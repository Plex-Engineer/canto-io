import sendImg from "assets/send.svg";
import canto from "assets/logo.svg";
import copyIcon from "assets/copyIcon.svg"
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Mixpanel } from "./../mixpanel";
import { BigNumber } from "ethers";
import { GTokens, useGravityTokens } from "hooks/useGravityTokens";
import { useNetworkInfo } from "stores/networkInfo";
import { selectedEmptyToken, useTokenStore } from "stores/tokens";
import { ReactiveButton } from "./ReactiveButton";
import { useApprove, useCosmos } from "./useTransactions";
import { TokenWallet } from "./TokenSelect";
import { Container, Balance, Center, Button } from "./styledComponents";
import { ImageButton } from "./ImageButton";
import { TOKENS, ADDRESSES, CantoMainnet, useAlert } from "cantoui";
import { getCantoBalance, getGravityTokenBalance, useCosmosTokens } from "hooks/useCosmosTokens";
import { chain, fee, memo } from "config/networks";
import { txIBCTransfer } from "utils/IBC/IBCTransfer";
import { toast } from "react-toastify";
import { GenPubKey } from "./genPubKey";
import { generatePubKey } from "utils/nodeTransactions";

const BridgePage = () => {
  const [gravReceiver, setGravReceiver] = useState("");
  const networkInfo = useNetworkInfo();
  const tokenStore = useTokenStore();
  const activeToken = useTokenStore().selectedToken;
  const [amount, setAmount] = useState("");

  const [bridgeOut, setBridgeOut] = useState(false);
  const alert = useAlert();

  //get tokens from the contract call
  const { gravityTokens, gravityAddress } = useGravityTokens(
    networkInfo.account,
    Number(networkInfo.chainId)
  );

  const [cantoTokens, setCantoTokens] = useState<any[]>([]);
  //contracts for transactions
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

  function copyAddress(value : string | undefined) {
    navigator.clipboard.writeText(value ?? "");
    toast("copied address", {
      autoClose: 300
    })
  }


const [tempPubKeyMsg, setTempPubKeyMsg] = useState("")

  //event tracker
  useEffect(() => {
    tokenStore.setApproveStatus(stateApprove.status);
    if (stateApprove.status == "Success") {
      // tokenStore.setSelectedToken(gravityTokens?.find(item => item.data.address == tokenStore.selectedToken.data.address))
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

  useEffect(() => {
    if (networkInfo.cantoAddress) {
      getBalances();
    }
  }, [networkInfo.cantoAddress]);

  useEffect(()=>{
    if (!networkInfo.hasPubKey) {
      alert.show("Failure", <GenPubKey />);
    } else {
      // alert.close();
    }
  },[networkInfo.hasPubKey])
  //send function
  const send = () => {
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

  Mixpanel.events.pageOpened("Bridge", activeToken.wallet);

  async function getBalances() {
    const tokensWithBalances = await getCantoBalance(
      CantoMainnet.cosmosAPIEndpoint,
      networkInfo.cantoAddress
    );
    setCantoTokens(tokensWithBalances);
  }

  // =========================
  return (
    <Container>
      <h1
        style={{
          margin: "2rem",
        }}
      >
        send funds {bridgeOut ? "from" : "to"} canto
      </h1>
      <div
        className="row"
        style={{
          border: "1px solid #444",
          marginBottom: "1rem",
          width: "40rem",
          justifyContent: "space-around",
          flexDirection: bridgeOut ? "column-reverse" : "column",
        }}
      >
        <div className="wallet-item">
          <h3>{bridgeOut ? "to:" : "from:"}</h3>
          <Center className="center">
            <img
              src={
                bridgeOut
                  ? "https://raw.githubusercontent.com/Gravity-Bridge/Gravity-Docs/main/assets/Graviton-Grey.svg"
                  : TOKENS.ETHMainnet.WETH.icon
              }
              alt="eth"
              width={26}
            />
            <p>{bridgeOut ? "gravity bridge" : "ethereum"}</p>
          </Center>
          <h4 style={{ color: "white", textAlign: "right", cursor: "pointer" }} id="ethAddress" onClick={() => copyAddress(networkInfo.account)}>
            {bridgeOut
              ? ""
              : networkInfo.account?.slice(0, 6) +
                "..." +
                networkInfo.account?.slice(-6, -1)}
          </h4>
        </div>
        <div className="switchBtn">
          <Center>
            <img
              className="imgBtn"
              src={sendImg}
              height={40}
              style={{
                // transform: bridgeOut ? "rotate(90deg)" : "rotate(90deg)",
                transition: "transform .3s",
              }}
              onClick={() => {
                setBridgeOut(!bridgeOut);
                tokenStore.setSelectedToken(selectedEmptyToken)
              }
            }
            />
          </Center>
          <hr />
        </div>
        <div className="wallet-item">
          <h3>{bridgeOut ? "from:" : "to:"}</h3>
          <Center className="center">
            <img src={canto} alt="canto" height={26} width={26} />
            <p>canto</p>
          </Center>
          <h4 style={{ color: "white", textAlign: "right", cursor: "pointer" }} id="cantoAddress" onClick={() => copyAddress(networkInfo.cantoAddress)}>
            {networkInfo.cantoAddress
              ? networkInfo.cantoAddress.slice(0, 10) +
                "..." +
                networkInfo.cantoAddress.slice(-5)
              : "retrieving wallet"}
          </h4>
          {/* <img src={copyIcon} style={{zIndex: "80", background: "gray", height: "15px", marginLeft: "5px", cursor: "pointer"}} onClick={() => copyAddress(networkInfo.cantoAddress)}/> */}
        </div>
      </div>
      {networkInfo.hasPubKey ? "" : <div style={{color: "white"}}><Button onClick={() => generatePubKey(networkInfo.account, setTempPubKeyMsg)}>generate a public key</Button> {tempPubKeyMsg}</div> }
      <ImageButton
        name="connect"
        networkSwitch={bridgeOut ? CantoMainnet.chainId : 1}
      />
      {((bridgeOut && (Number(networkInfo.chainId) != CantoMainnet.chainId)) || (!bridgeOut && (networkInfo.chainId != "1"))) ? <div/> : 
      <div className="column">
      <Balance>
        <TokenWallet
          tokens={bridgeOut ? cantoTokens : gravityTokens}
          activeToken={tokenStore.selectedToken}
          onSelect={(value) => {
            tokenStore.setSelectedToken(value);
            resetCosmos();
            resetApprove();
          }}
        />
        <div style={{marginTop: "1.5rem"}}>
        <input
          className="amount"
          autoComplete="off"
          type="text"
          name="amount"
          id="amount"
          value={amount}
          placeholder="0.00"
          onChange={(e) => {
            if (
              !(
                stateApprove.status == "PendingSignature" ||
                stateCosmos.status == "PendingSignature" ||
                stateApprove.status == "Mining" ||
                stateCosmos.status == "Mining"
              )
            ) {
              const val = Number(e.target.value);
              if (!isNaN(val)) {
                setAmount(e.target.value);
              }
              resetCosmos();
              resetApprove();
            }
          }}
        />
        <div style={{textAlign: "right", color: "gray", paddingTop: "0rem", cursor: "pointer"}} onClick={() => {setAmount((tokenStore.selectedToken.balanceOf))}}>
          {Number(tokenStore.selectedToken.balanceOf) < 0 ? "" : "max " + tokenStore.selectedToken.balanceOf}
        </div>
        </div>
      </Balance>
      <div className="input" style={!bridgeOut ? { visibility: "hidden" } : {}}>
        <label htmlFor="address">gravity bridge address: </label>

        <input
          className="amount"
          autoComplete="off"
          type="text"
          name="address"
          id="address"
          value={gravReceiver}
          placeholder="gravity..."
          onChange={(e) => {
            setGravReceiver(e.target.value);
          }}
          style={{ width: "120%" }}
        />
      </div>
      
      
      <ReactiveButton
        destination={networkInfo.cantoAddress}
        amount={amount}
        account={networkInfo.account}
        token={tokenStore.selectedToken}
        gravityAddress={gravityAddress}
        hasPubKey={networkInfo.hasPubKey}
        disabled={bridgeOut && gravReceiver.slice(0, 7) != "gravity"}
        onClick={
          bridgeOut
            ? async () => {
                const response = await txIBCTransfer(
                  gravReceiver,
                  "channel-0",
                  ethers.utils
                    .parseUnits(amount, tokenStore.selectedToken.data.decimals)
                    .toString(),
                  tokenStore.selectedToken.data.nativeName,
                  CantoMainnet.cosmosAPIEndpoint,
                  "https://gravitychain.io:1317",
                  fee,
                  chain,
                  memo
                );
                if (response.tx_response?.txhash) {
                  toast("bridge out successful", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progressStyle: {
                      color: "var(--primary-color)",
                    },
                    style: {
                      border: "1px solid var(--primary-color)",
                      borderRadius: "0px",
                      paddingBottom: "3px",
                      background: "black",
                      color: "var(--primary-color)",
                      height: "100px",
                      fontSize: "20px",
                    },
                  });
                } else {
                  //TODO: Show an error
                }
              }
            : send
        }
      />
      </div>
}
      <br></br>
      {bridgeOut ? (
        <div style={{ color: "white", padding: "1rem", textAlign: "center" }}>
          in order to bridge out of canto, you must convert all of your ERC20
          assets
          {" (Metamask)"} to native canto tokens{" "}
          <a
            href="https://convert.canto.io"
            style={{ color: "white", textDecoration: "underline" }}
          >
            here.
          </a>{" "}
          the balances in your Metamask will not reflect your bridgeable assets
        </div>
      ) : (
        <div style={{ color: "white", padding: "1rem", textAlign: "center" }}>
          it takes several minutes for your bridged assets to arrive on the
          canto network. go to the{" "}
          <a
            href="https://convert.canto.io"
            style={{ color: "white", textDecoration: "underline" }}
          >
            convert coin
          </a>{" "}
          page to view your bridged assets and convert them into canto ERC20
          tokens to view your assets in Metamask. for more details, please read{" "}
          <a
            href="https://docs.canto.io/user-guides/getting-started"
            style={{ color: "white", textDecoration: "underline" }}
          >
            here
          </a>
          .
        </div>
      )}
      <br/>
      <p style={{color: "white"}}>to learn how to bridge ATOM into canto, please read <a style= {{color: "white"}}href="https://docs.canto.io/user-guides/bridging-assets/bridging-atom-greater-than-canto-via-ibc-transfer"
      >
        here</a> </p>
      <br/>

      <div
        style={{
          color: "var(--primary-color)",
          textAlign: "center",
          width: "100%",
        }}
      >
        powered by Gravity Bridge
      </div>
    </Container>
  );
};

export default BridgePage;
