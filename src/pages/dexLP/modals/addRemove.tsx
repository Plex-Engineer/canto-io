import { noteSymbol, truncateNumber } from "global/utils/utils";
import IconPair from "../components/iconPair";
import useModals, { ModalType } from "../hooks/useModals";
import { UserLPPairInfo } from "../config/interfaces";
import { valueInNote } from "../utils/utils";
import { formatUnits } from "ethers/lib/utils";
import { OutlinedButton, PrimaryButton } from "cantoui";
import { AddRemoveContainer } from "../components/Styled";
interface Props {
  activePair: UserLPPairInfo;
  onClose: () => void;
  chainId?: number;
  account?: string;
}
const AddRemoveModal = ({ activePair }: Props) => {
  const setModalType = useModals((state) => state.setModalType);

  return (
    <AddRemoveContainer>
      <div className="title">
        {activePair.basePairInfo.token1.symbol +
          " / " +
          activePair.basePairInfo.token2.symbol}
      </div>
      <p id="position">position overview</p>
      <IconPair
        iconLeft={activePair.basePairInfo.token1.icon}
        iconRight={activePair.basePairInfo.token2.icon}
      />
      <h1>
        {activePair.basePairInfo.token1.symbol +
          " & " +
          activePair.basePairInfo.token2.symbol}
      </h1>
      <h4>
        pool share {(activePair.userSupply.percentOwned * 100).toFixed(4)}%
      </h4>
      <div className="fields">
        <div className="token">
          <img
            src={activePair.basePairInfo.token1.icon}
            height={50}
            width={50}
          />
          <p>
            {noteSymbol}
            {truncateNumber(
              formatUnits(
                valueInNote(
                  activePair.userSupply.token1,
                  activePair.prices.token1
                )
              )
            )}
          </p>

          <p>
            {truncateNumber(
              formatUnits(
                activePair.userSupply.token1,
                activePair.basePairInfo.token1.decimals
              )
            )}{" "}
            {activePair.basePairInfo.token1.symbol}
          </p>
        </div>
        <div className="token">
          <img
            src={activePair.basePairInfo.token2.icon}
            height={50}
            width={50}
          />
          <p>
            {noteSymbol}
            {truncateNumber(
              formatUnits(
                valueInNote(
                  activePair.userSupply.token2,
                  activePair.prices.token2
                )
              )
            )}
          </p>

          <p>
            {truncateNumber(
              formatUnits(
                activePair.userSupply.token2,
                activePair.basePairInfo.token2.decimals
              )
            )}{" "}
            {activePair.basePairInfo.token2.symbol}
          </p>
        </div>
      </div>
      <div className="fields">
        <OutlinedButton
          style={{ width: "9rem" }}
          onClick={() => {
            setModalType(ModalType.REMOVE);
          }}
        >
          remove
        </OutlinedButton>

        <PrimaryButton
          style={{ width: "9rem" }}
          onClick={() => {
            setModalType(ModalType.ADD);
          }}
        >
          add
        </PrimaryButton>
      </div>
    </AddRemoveContainer>
  );
};

export default AddRemoveModal;
