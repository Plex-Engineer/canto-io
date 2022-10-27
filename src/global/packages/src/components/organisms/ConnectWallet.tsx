import { OutlinedButton } from "global/packages/src";
import cantoIMG from "assets/logo.svg";
import ethIMG from "assets/icons/ETH.svg";
import { formatBigNumber } from "../../utils/formatNumbers";
import Popup from "reactjs-popup";
import WalletModal from "./WalletModal";
import { useEthers } from "@usedapp/core";

interface Props {
  isConnected: boolean;
  balance: string;
  currency: string;
  account: string;
  chainId: number;
  onClick: () => void;
}
const ConnectWallet = ({ isConnected, balance, currency, onClick }: Props) => {
  const { account } = useEthers();
  return (
    <div className="wallet">
      {account != null ? (
        <Popup
          arrow={false}
          offsetY={8}
          closeOnEscape
          position="bottom right"
          trigger={
            <div>
              <OutlinedButton
                onClick={() => {
                  // setIsModalOpen(true)
                }}
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  letterSpacing: "-0.03em",
                  borderRadius: "4px",
                  height: "32px",
                }}
              >
                <span className="center ">
                  {currency == "CANTO" && <img src={cantoIMG} height={14} />}
                  {currency == "ETH" && <img src={ethIMG} height={14} />}
                  {formatBigNumber(balance)}&nbsp;
                </span>
                <span
                  className="hide-on-mobile"
                  style={{
                    fontWeight: "600",
                    gap: "10px",
                  }}
                >
                  {currency != "CANTO" && currency != "ETH" ? currency : null}
                </span>
                <div
                  className="hide-on-mobile"
                  style={{
                    marginLeft: "10px",
                    marginRight: "2px",
                    height: "32px",
                    background: "var(--primary-color)",
                    width: "1px",
                  }}
                ></div>
                <span className="hide-on-mobile">
                  &nbsp;
                  {account?.substring(0, 5) + "..." + account.slice(-4)}
                </span>
              </OutlinedButton>
            </div>
          }
        >
          <WalletModal />
        </Popup>
      ) : (
        <OutlinedButton
          onClick={onClick}
          style={{
            fontSize: "14px",
            fontWeight: "500",
            letterSpacing: "-0.03em",
            borderRadius: "4px",
            height: "32px",
          }}
        >
          connect <span className="hide-on-mobile">&nbsp;wallet</span>
        </OutlinedButton>
      )}
    </div>
  );
};

export default ConnectWallet;
