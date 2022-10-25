import styled from "@emotion/styled";

const Styled = styled.div`
  display: flex;
  align-self: center;
  max-width: 1200px;
  section {
    flex-grow: 2;
    display: flex;
    flex-direction: column;
  }
  h1 {
    font-family: "Silkscreen", cursive;
    font-size: 26px;
    font-weight: 400;
    line-height: 34px;
    letter-spacing: -0.07em;
    color: var(--primary-color);
  }
  .react-tabs__tab {
    background-color: transparent;
    color: var(--primary-color);
    font-size: 16px;
    font-weight: 500;
    line-height: 21px;
    letter-spacing: -0.01em;
  }

  .react-tabs__tab--selected {
    border: none;
    border-bottom: 4px solid var(--primary-color);
  }
  .react-tabs__tab {
    flex: 1;
    cursor: pointer;
    padding: 1rem;
    text-align: center;
    /* transition: all 0.2s ease-in-out; */
    &:hover:not(.selected) {
      background: #a7efd218;
    }
    &:focus {
      border-bottom: 4px solid var(--primary-color) !important;
      outline: none;
    }
  }
  .react-tabs__tab-list {
    list-style: none;
    border-bottom: 1px solid var(--primary-color);
    margin: 0 1rem;
    display: flex;
    justify-content: space-between;
  }
`;

export default Styled;
