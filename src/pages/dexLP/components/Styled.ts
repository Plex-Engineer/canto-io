import styled from "@emotion/styled";
export const DexModalContainer = styled.div`
  background-color: #040404;
  height: 42rem;
  width: 30rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 2rem;
  //! marked for deletion
  .title {
    width: 100%;
    /* background-color: #06fc991a; */
    padding: 1rem;
    border-bottom: 1px solid #222;
    z-index: 2;
  }

  .dual-button {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
  }

  .locked {
    position: relative;
    margin: 2rem 0;
    .icons {
      position: absolute;
      bottom: -10px;
      left: 60px;
      border: 1px solid var(--primary-color);
      border-radius: 50px;
      background-color: #111;
      padding: 2px 4px;
    }
  }

  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }

  .tokenBox {
    margin: 0 2rem !important;
    background-color: #131313;
    border: 1px solid #606060;
    padding: 1rem;
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

  #position {
    font-size: 18px;
    line-height: 140%;
    color: #606060;
    text-align: center;
    letter-spacing: -0.03em;
  }
  .line {
    border-bottom: 1px solid #222;
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
  .box {
    width: 80%;
    display: flex;
    flex-direction: column;
  }

  .fields {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0.3rem;
  }

  .rowCell {
    p:first-of-type {
      text-transform: lowercase;
      color: #888;
    }
    p:last-child {
      color: white;
    }
  }

  .tableName {
    width: 80%;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 1000px) {
    width: 100%;

    .box {
      width: 100%;
    }
    .tableName {
      width: 90%;
    }
  }
  .row {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }
`;
export const AddRemoveContainer = styled(DexModalContainer)`
  gap: 0.7rem;
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
  .fields {
    display: flex;
    margin-top: 1rem;
    gap: 0.6rem;
  }
  .btns {
    display: flex;
    flex-direction: row;
    gap: 0.6rem;
  }
`;

interface showProps {
  show: boolean;
}
export const DexLoadingOverlay = styled.div<showProps>`
  display: ${(props) => (props.show ? "block" : "none")};
  position: absolute;
  top: 0%;
  bottom: 0%;
  width: 100%;
  max-height: 45.6rem;
  z-index: 2;
  background-color: black;
  @media (max-width: 1000px) {
    width: 99vw;
  }
`;

export const SettingsPopIn = styled.div<showProps>`
  opacity: ${(showProps) => (showProps.show ? "100" : "0")};
  transition: all 0.2s;
  height: 100%;
  position: absolute;
  background-color: black;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  justify-content: center;
  top: 0;
  left: 0;
  z-index: 1;
`;

export const DexContainer = styled.div`
  display: flex;
  flex-direction: column;

  .tableName {
    width: 1200px;
    margin: 0 auto;
    padding: 0;
  }

  @media (max-width: 1000px) {
    .tableName {
      width: 100%;
      padding: 0 2rem;
    }
  }
`;

type fieldProps = {
  focused: boolean;
};
export const FieldContainer = styled.div<fieldProps>`
  display: flex;
  /* flex-direction: column; */
  background-color: ${(props) => (props.focused ? "#001A0E" : "#191919")};
  border: ${(props) =>
    props.focused ? "1px solid #06FC99" : "1px solid #191919"};
  border-radius: 4px;
  color: #efefef;
  height: 80px;

  &:hover {
    background-color: #001a0e;
    border-radius: 4px;

    cursor: text;
    input {
      border-radius: 4px;
      /* background-color: #001a0e !important; */
    }
  }
  input[type="text"] {
    padding: 0 1rem;
    margin-top: 1rem;
    background-color: transparent;
    /* background-color: ${(props) =>
      props.focused ? "#001A0E" : "#191919"}; */
    font-size: 24px;
    width: 100%;
    border: none;
    font-weight: 300;
    color: ${(props) => (props.focused ? "var(--primary-color)" : "#efefef")};
    &:focus {
      outline: none;
    }
  }

  p {
    margin-top: 0.4rem;
    color: #6f6f6f;
    letter-spacing: -0.03em;
    text-align: right;
    font-size: 16px;
    padding: 0 1rem;
  }
`;
