import { AllPairInfo } from "../hooks/useTokens";
import styled from "@emotion/styled";
import { noteSymbol } from "global/utils/utils";
import IconPair from "../components/iconPair";
import useModals, { ModalType } from "../hooks/useModals";
const Container = styled.div`
  background-color: #040404;
  height: 36rem;
  width: 30rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 0.7rem;
  .title {
    font-style: normal;
    font-weight: 300;
    font-size: 22px;
    line-height: 130%;
    text-align: center;
    letter-spacing: -0.1em;
    color: var(--primary-color);
    /* margin-top: 0.3rem; */
    width: 100%;
    background-color: #06fc991a;
    padding: 1rem;
    border-bottom: 1px solid var(--primary-color);
    z-index: 5;
  }

  .line {
    border-bottom: 1px solid #222;
  }
  #position {
    font-size: 18px;
    line-height: 140%;
    color: #606060;
    text-align: center;
    letter-spacing: -0.03em;
  }
  h1 {
    font-size: 30px;
    line-height: 130%;
    font-weight: 400;

    text-align: center;
    letter-spacing: -0.03em;
    color: white;
  }

  h4 {
    font-size: 16px;
    text-align: center;
    font-weight: 500;
    letter-spacing: -0.02em;
    text-transform: lowercase;
    color: #606060;
  }
  .logo {
    /* padding: 1rem; */
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--primary-color);
    height: 60px;
    width: 60px;
    border-radius: 50%;
    margin-bottom: 1.2rem;
  }

  .fields {
    display: flex;
    margin-top: 2rem;
    gap: 0.6rem;
  }

  .token {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 0.3rem;
    /* border: 2px solid #333; */
    background-color: #111;
    color: white;
    align-items: center;
    gap: 0.8rem;
    text-align: center;
    /* margin: .4rem; */
  }
`;

const SecondaryButton = styled.button`
  font-weight: 300;
  font-size: 18px;
  background-color: black;
  color: var(--primary-color);
  padding: 0.4rem 2rem;
  border: 1px solid var(--primary-color);
  display: flex;
  align-self: center;
  justify-content: center;
  width: 10rem;
  &:hover {
    background-color: var(--primary-color-dark);
    color: black;
    cursor: pointer;
  }
`;

const PrimaryButton = styled(SecondaryButton)`
  background-color: var(--primary-color);
  color: black;
`;

interface Props {
  value: AllPairInfo;
  onClose: () => void;
  chainId?: number;
  account?: string;
}
const AddRemoveModal = ({ value, onClose, chainId, account }: Props) => {
  const setModalType = useModals((state) => state.setModalType);



  return (
    <Container>
      <div className="title">
        {value.basePairInfo.token1.symbol +
          " / " +
          value.basePairInfo.token2.symbol}
      </div>
      <p id="position">position overview</p>
      <IconPair
        iconLeft={value.basePairInfo.token1.icon}
        iconRight={value.basePairInfo.token2.icon}
      />
      <h1>
        {value.basePairInfo.token1.symbol +
          " & " +
          value.basePairInfo.token2.symbol}
      </h1>
      <h4>pool share {(value.userSupply.percentOwned * 100).toFixed(4)}%</h4>

      <div className="fields">
        <div className="token">
          <img src={value.basePairInfo.token1.icon} height={50} width={50} />
          <p>
            {noteSymbol}
            {(
              Number(value.userSupply.token1) * Number(value.prices.token1)
            ).toFixed(4)}
          </p>

          <p>
            {Number(value.userSupply.token1).toFixed(4)}{" "}
            {value.basePairInfo.token1.symbol}
          </p>
        </div>
        <div className="token">
          <img src={value.basePairInfo.token2.icon} height={50} width={50} />
          <p>
            {noteSymbol}
            {(
              Number(value.userSupply.token2) * Number(value.prices.token2)
            ).toFixed(4)}
          </p>

          <p>
            {Number(value.userSupply.token2).toFixed(4)}{" "}
            {value.basePairInfo.token2.symbol}
          </p>
        </div>
      </div>
      <div className="fields">
        <SecondaryButton
          onClick={() => {
            setModalType(ModalType.REMOVE);
          }}
        >
          remove
        </SecondaryButton>

        <PrimaryButton
          onClick={() => {
            setModalType(ModalType.ADD);
          }}
        >
          add
        </PrimaryButton>
      </div>
    </Container>
  );
};

export default AddRemoveModal;
