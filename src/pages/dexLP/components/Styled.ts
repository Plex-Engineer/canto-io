import styled from "@emotion/styled";
export const DexModalContainer = styled.div`
  background-color: #040404;
  height: 40rem;
  width: 30rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 1rem;
  /* padding: 1rem; */
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
    z-index: 2;
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
    padding: 1rem;
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
    padding-bottom: 100px;
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
  color: #fff;
  min-height: 100vh;
  h1 {
    font-size: 12rem;
    color: var(--primary-color);
    text-align: center;
    font-weight: 300;
    letter-spacing: -0.13em;
    position: relative;
    height: 26rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-shadow: 0px 14px 14px rgba(6, 252, 153, 0.2);
  }

  .tableName {
    width: 1200px;
    margin: 0 auto;
    padding: 0;
  }

  & > button {
    background-color: var(--primary-color);
    border: none;
    border-radius: 0px;
    padding: 0.6rem 2.4rem;
    font-size: 1.2rem;
    font-weight: 500;
    letter-spacing: -0.03em;
    width: fit-content;
    margin: 0 auto;
    margin-bottom: 3rem;

    &:hover {
      background-color: var(--primary-color-dark);
    }
  }

  @media (max-width: 1000px) {
    h1 {
      font-size: 20vw;
    }
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
  flex-direction: column;
  background-color: ${(props) => (props.focused ? "#001A0E" : "#191919")};
  border: ${(props) =>
    props.focused ? "1px solid #06FC99" : "1px solid #191919"};
  color: #efefef;
  height: 130px;
  flex: 1;
  margin: 1px;

  &:hover {
    background-color: #001a0e;
    cursor: text;
    input {
      background-color: #001a0e !important;
    }
  }
  input[type="text"] {
    padding: 0 1rem;
    margin-top: 1rem;
    background-color: ${(props) => (props.focused ? "#001A0E" : "#191919")};
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
