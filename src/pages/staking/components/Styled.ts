import styled from "@emotion/styled";

export const StakingModalContainer = styled.div`
  background-color: #040404;
  height: fit-content;
  max-height: 90vh;
  overflow-y: scroll;
  padding-bottom: 1.4rem;
  width: 33rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  input {
    text-align: right;
  }
  hr {
    width: 100%;
    border: none;
    border-bottom: 1px solid #444444;
  }

  .agreement {
    display: flex;
    gap: 1rem;
  }
  .tabPanel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .amount {
    input {
      width: 100%;
      margin: 6px 0;
      text-align: start;
    }
    position: relative;
    .max {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 140%;
      letter-spacing: -0.03em;
      text-transform: lowercase;
      color: #efefef;
      border: 1px solid #efefef;
      opacity: 0.5;
      position: absolute;
      right: 12px;
      border-radius: 4px;
      padding: 4px 8px;
      top: 18px;
      transition: all 0.1s;
      background-color: transparent;
      cursor: pointer;
      &:hover {
        opacity: 1;
        color: var(--primary-color);
        border: 1px solid var(--primary-color);
      }
    }
    width: 100%;
  }

  .redelegate {
    width: 100%;
    .btn-grp {
      width: 100%;
      align-items: center;
      display: grid;
      grid-template-columns: 49% 49%;
      gap: 2%;
    }
    background-color: #152920;
    border: 1px solid var(--primary-color);
    padding: 1rem;

    .row {
      display: flex;
      p {
        flex: 1;
        cursor: pointer;
        &:hover {
          color: var(--primary-color);
        }
      }
      * {
        flex: 2;
      }

      input {
        border-bottom: 1px solid #1b7244;

        &:focus {
          border-bottom: 1px solid var(--primary-color);
        }
      }
    }
    .btn-grp {
      margin: 0 !important;
      margin-top: 2rem !important;
    }
  }
  .group {
    width: 100%;
  }
  .title {
    font-family: Silkscreen;
    font-size: 26px;
    font-weight: 400;
    line-height: 34px;
    letter-spacing: -0.08em;
    text-align: left;

    color: var(--primary-color);
    width: 90%;
    padding: 1rem 0;
    border-bottom: 1px solid #222;
    margin-bottom: 1rem;
  }

  .dual-h-row {
    font-size: 18px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 0.4rem 0;
  }

  .type {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 147%;
    letter-spacing: -0.03em;
    text-transform: lowercase;
    color: #06fc99;

    opacity: 0.4;
  }
  .value {
    color: var(--primary-color);
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 147%;
    text-align: right;
    letter-spacing: -0.03em;
  }
  .line {
    border-bottom: 1px solid #222;
  }
  .tabs {
    margin-top: 1rem;
  }
  .btn {
    width: 100%;
  }
  .tablist {
    list-style: none;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--primary-color);
    padding: 0;
    color: #efefef;
    font-weight: 400;
    .selected {
      background: rgba(6, 252, 153, 0.1);
      border-bottom: 4px solid var(--primary-color);
    }
    .tab {
      height: 50px;
      flex: 1;
      cursor: pointer;
      padding: 0.5rem;
      transition: all 0.2s ease-in-out;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover:not(.selected) {
        background: #a7efd218;
      }
      &:focus {
        outline: none;
      }
    }
  }

  .secondaryBalance {
    font-weight: 300;
    font-size: 16px;
    line-height: 120%;
    color: #cdcdcd;
  }

  .btn-grp {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .desc {
    margin: 0 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .textField {
    margin: 0.1rem 0;
    padding: 0.4rem 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 18px;
    border-bottom: 1px solid var(--primary-color);
  }

  input[type="text"] {
    background-color: black;
    width: 100%;
    border: none;
    font-size: 18px;
    font-weight: 600;
    color: white;
    margin-left: 4rem;
    &:focus {
      outline: none;
    }
  }
  footer {
    margin: 0 2rem;
    p {
      font-size: 14px;
    }
  }

  @media (max-width: 1000px) {
    width: 100%;
  }
`;
