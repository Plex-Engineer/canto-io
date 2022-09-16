import styled from "@emotion/styled";

export const Styled = styled.div`
  display: flex;
  flex-direction: column;
  color: #fff;
  margin: 2rem 1rem;
  .typing {
    color: var(--primary-color);
    margin: 2rem 4rem;
    font-weight: 300;
    letter-spacing: -0.13em;
    height: 400px;
    & span {
      transition-property: all 0.1s ease-in-out;
    }
    margin: 2rem -1rem -4rem -1rem;
    @media (max-width: 1000px) {
      margin: 0;
    }
  }
  .balance {
    font-weight: 300;
    font-size: 56px;
    color: var(--primary-color);
    text-shadow: 0px 14px 14px rgba(6, 252, 153, 0.2);
    & span {
      color: var(--primary-color);
    }
  }
  .flex-h {
    display: sticky;
    margin: 0;
    right: 0;
    button {
      margin: 0;
      width: 15rem;
    }
  }
  .Typewriter {
    color: var(--primary-color);
    margin: 2rem 4rem;
    font-weight: 300;
    letter-spacing: -0.13em;
    text-shadow: 0px 4px 4px rgba(6, 252, 153, 0.4);
    font-size: 27px;
    height: 340px;
  }
  /* .fit {
    object-fit: contain;
    height: 500px;
  } */
  .tables {
    display: flex;
    width: 100%;
    & > div {
      width: 50%;
      & > p {
        color: var(--primary-color);
        padding: 4px;
      }
    }
  }
  @media (max-width: 1000px) {
    margin: 0 1rem;
    .balance {
      font-size: 30px;
    }
    .tables {
      flex-direction: column;
      div {
        width: 100%;
      }
      table {
        min-width: 600px;
        width: 100%;
      }
    }
  }
`;
export const Hero = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  /* min-height: 20rem; */
  margin-top: 5rem;
  margin-bottom: 0rem;
  div {
    width: 50%;
  }
  p {
    font-weight: 400;
    font-size: 16px;
    color: var(--primary-color);
  }
  @media (max-width: 1000px) {
    flex-direction: column;
    margin: 0;
    margin-top: 2rem;
    justify-content: center;
    align-items: flex-start;
    gap: 0.3rem;
    div {
      text-align: left !important;
    }
    .balance {
      font-size: 48px;
    }
  }
`;

export const Button = styled.button`
  font-weight: 300;
  font-size: 18px;
  background-color: black;
  color: var(--primary-color);
  padding: 0.2rem 2rem;
  border: 1px solid var(--primary-color);
  justify-content: center;
  /* margin: 0 -4rem auto auto; */
  width: 14rem;
  display: flex;
  &:hover {
    background-color: var(--primary-color-dark);
    color: black;
    cursor: pointer;
  }
`;
export const TinyTable = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  margin: 2rem 0;
  /* justify-content: start; */
  align-items: flex-start;
  .tables {
    display: flex;
    z-index: 700;
  }
  .table {
    width: 15rem;
    border: 1px solid var(--primary-color);
    text-align: center;
  }
  .bar {
    /* width: 30rem; */
    width: 100%;
    display: flex;
  }
  .green {
    border: 2px solid var(--primary-color);
    background-color: #6fff8773;
    height: 10px;
    width: 0%;
  }
  .red {
    border: 2px solid var(--error-color);
    border-left: 0px;
    background-color: #ff6f6f73;
    height: 10px;
  }
  .gray {
    border: 2px solid #7b7b7b73;
    border-left: 0px;
    background-color: #1616169b;
    height: 10px;
    /* width: 66%; */
  }
  p {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  h1 {
    font-weight: 400;
    font-size: 18px;
    padding: 0.3rem;
    background-color: #49ffb611;
    border-bottom: 1px solid var(--primary-color);
    color: var(--primary-color);
  }
  /* .alt {
    text-shadow: 0 0 4px #ff2c2c, 0 0 20px var(--error-color) !important;
    h1 {
      border-bottom: 1px solid var(--error-color);
      background-color: #ff494911;
      color: var(--error-color);
    }
    border: 1px solid var(--error-color) !important;
   
  } */
`;
export const ToolTipL = styled.div`
  border: 1px solid var(--primary-color);
  background-color: #111;
  padding: 1rem;
  width: 20rem;
  color: white;
`;
