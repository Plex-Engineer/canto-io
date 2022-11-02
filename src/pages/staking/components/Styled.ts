import styled from "@emotion/styled";

export const StakingModalContainer = styled.div`
  background-color: #040404;
  height: fit-content;
  max-height: 90vh;
  overflow-y: scroll;
  padding-bottom: 1rem;
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

  /* padding: 1rem; */
  .react-select-container {
    background-color: red;
  }
  .react-select__input-container {
    background-color: red;
    color: var(--primary-color) !important;
  }
  .react-select__control {
    background-color: #040404 !important;
    color: var(--primary-color) !important;
    border: 1px solid transparent !important;
    border-radius: 0%;
    background-color: red;

    &:focus,
    &:hover {
      outline: none;
    }
  }
  /* .react-select__input {
  color: var(--primary-color) !important;
  &::placeholder {
    color: var(--primary-color) !important;
  }
  input[type="text"] {
    &::placeholder {
      color: var(--primary-color) !important;
    }
  }
} */
  .react-select__menu {
    background-color: #040404 !important;
    background-color: red;
    color: var(--primary-color) !important;
  }
  .react-select__value-container {
    * {
      color: var(--primary-color) !important;
      background-color: red;
    }
  }
  .react-select__menu-list {
    background-color: red;
    outline: none;
    color: var(--primary-color) !important;
  }

  .react-select__option {
    background-color: #040404 !important;
    &:hover {
      background-color: #1b2b24 !important;
    }
  }

  .redelegate {
    width: 100%;
    margin: 2rem 0;
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
  .title {
    font-weight: 300;
    font-size: 22px;
    text-align: center;
    letter-spacing: -0.1em;
    text-transform: lowercase;
    color: var(--primary-color);
    width: 100%;
    background-color: #06fc991a;
    padding: 1rem;
    border-bottom: 1px solid var(--primary-color);
    margin-bottom: 1rem;
  }

  .dual-h-row {
    font-size: 18px;
    width: 28rem;
    display: flex;
    justify-content: space-between;
    margin: 0.4rem 0;
  }

  .type {
    color: #8b8b8b;
  }
  .value {
    color: var(--primary-color);
  }
  .line {
    border-bottom: 1px solid #222;
  }

  h2 {
    color: #777;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    text-align: left;
    line-height: 120%;
    margin-bottom: 0.4rem;
  }

  h4 {
    width: 100%;
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
    margin: 2rem 0;
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
    width: 28rem;
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
`;
