import styled from "@emotion/styled";

export const Selected = styled.div`
  .react-select-container {
  }
  .react-select__input-container {
    color: var(--primary-color) !important;
  }
  .react-select__placeholder {
    opacity: 0.4;
  }
  .react-select__control {
    overflow-x: hidden;

    background-color: transparent !important;
    color: var(--primary-color) !important;
    border: 1px solid var(--primary-color);
    border-radius: 4px;
    font-size: 16px;
    letter-spacing: -0.03em;
    height: 52px;

    &:focus {
      outline: none;
    }
    &:hover {
    }
  }
  .react-select__menu-list {
    overflow-x: hidden !important;
  }
  .react-select__menu {
    backdrop-filter: blur(35px);
    background: #d9d9d933;
    border-radius: 4px;
    overflow-x: hidden !important;
    color: var(--primary-color) !important;
  }
  .react-select__indicator-separator {
    display: none;
  }
  .react-select__value-container {
    * {
      color: var(--primary-color) !important;
    }
  }
  .react-select__menu-list {
    outline: none;
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 4px 0;
    align-items: center;
    color: var(--primary-color) !important;
  }

  .react-select__option {
    width: 94%;
    background-color: transparent !important;
    margin: 0.2rem 1rem;
    padding: 0.6rem;
    &:hover {
      border-radius: 4px;
      background-color: #ffffff1a !important;
    }
  }
`;
