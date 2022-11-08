import { Details } from "./../../lending/hooks/useTransaction";
import styled from "@emotion/styled";

export const GovernanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: #fff;
  width: 1200px;
  margin: 0 auto 3rem auto;
  .title {
    font-weight: 300;
    font-size: 140px;
    line-height: 130%;
    text-align: center;
    letter-spacing: -0.13em;
    color: #06fc99;
    text-shadow: 0px 12.2818px 12.2818px rgba(6, 252, 153, 0.2);
    margin-top: 4rem;
    margin-bottom: 2rem;
  }

  .subtitle {
    margin: 0;
    margin-bottom: 5rem;
    a {
      color: var(--primary-color);
    }
    margin-top: 40px;
    text-shadow: none;
    color: white;
    text-align: center;
    font-size: 35px;
    font-weight: 400;
  }

  & > button {
    background-color: var(--primary-color);
    border: none;
    border-radius: 0px;
    padding: 0.6rem 2.4rem;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: -0.03em;
    width: fit-content;
    margin: 0 auto;
    margin-top: 2rem;

    margin-bottom: 3rem;

    &:hover {
      background-color: var(--primary-color-dark);
      cursor: pointer;
    }
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 1rem;
    column-gap: 0.8rem;
  }

  @media (max-width: 1000px) {
    width: 100%;
    .grid {
      grid-template-columns: 1fr;
      row-gap: 1rem;
      column-gap: 0.8rem;
    }
  }
`;
export const ProposalContainer = styled.div`
  overflow-wrap: break-word;
  padding: 4rem;
  display: flex;
  width: 1200px;
  align-items: stretch;
  gap: 4rem;
  background-color: black;
  margin: 0 auto; /* width */

  .details {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  .pie {
    height: 200px;
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .title {
    font-weight: 300;
    font-size: 184px;
    line-height: 130%;
    text-align: center;
    letter-spacing: -0.13em;
    color: #06fc99;
    text-shadow: 0px 12.2818px 12.2818px rgba(6, 252, 153, 0.2);
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
  .tiny {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    display: flex;
    justify-content: space-between;
    letter-spacing: -0.03em;

    color: #878787;
  }
  h1 {
    font-weight: 300;
    font-size: 22px;
    line-height: 130%;
    /* identical to box height, or 29px */

    text-align: left;
    letter-spacing: -0.1em;

    /* almost white */

    color: #efefef;
  }

  @media (max-width: 1000px) {
    padding: 2rem;
    width: 100%;
  }
`;
