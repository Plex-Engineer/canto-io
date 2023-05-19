import { truncateNumber } from "global/utils/formattingNumbers";
import IconPair from "../components/iconPair";
import { ModalType } from "../hooks/useModals";
import { UserLPPairInfo } from "../config/interfaces";
import { valueInNote } from "../utils/utils";
import { formatUnits } from "ethers/lib/utils";
import { AddRemoveContainer } from "../components/Styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { noteSymbol } from "global/config/tokenInfo";
interface Props {
  activePair: UserLPPairInfo;
  onClose: () => void;
  setModalType: (modalType: ModalType) => void;
}
const AddRemoveModal = ({ activePair, setModalType }: Props) => {
  return (
    <AddRemoveContainer>
      <p id="position">position overview</p>
      <div className="row">
        <IconPair
          iconLeft={activePair.basePairInfo.token1.icon}
          iconRight={activePair.basePairInfo.token2.icon}
        />
      </div>
      <div className="row">
        <Text type="title">{activePair.basePairInfo.token1.symbol}</Text>

        <Text type="title">/</Text>

        <Text type="title">{activePair.basePairInfo.token2.symbol}</Text>
      </div>
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
      <div className="btns">
        <OutlinedButton
          height="big"
          weight="bold"
          filled
          onClick={() => {
            setModalType(ModalType.REMOVE);
          }}
        >
          remove
        </OutlinedButton>

        <PrimaryButton
          height="big"
          weight="bold"
          filled
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
