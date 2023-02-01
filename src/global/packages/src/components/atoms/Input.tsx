import styled from "@emotion/styled";
import searchImg from "assets/search.svg";

export const CInput = styled.input`
  background: #222222;
  border-radius: 4px;
  height: 56px;
  color: var(--primary-color);
  border: none;
  text-align: left;
  font-size: 16px;
  padding-left: 16px;
  letter-spacing: -0.03em;
  ::placeholder {
    /* color: var(--primary-color); */
    opacity: 0.4;
    color: var(--primary-color);
  }
  &:focus {
    outline: 1px solid var(--primary-color);
    /* border-bottom: 2px solid var(--primary-color); */
  }
`;

export const CSearch = styled.input`
  background: #222222;
  border-radius: 4px;
  height: 52px;
  color: var(--primary-color);
  border: none;
  text-align: left;
  font-size: 16px;
  padding-left: 16px;
  letter-spacing: -0.03em;
  background-image: url(${searchImg});
  background-repeat: no-repeat;
  background-position: 12px 50%;
  padding-left: 2.2rem;
  max-width: 250px;
  width: 100%;
  &:hover {
    background-color: #333333;
  }

  &:disabled {
    background-color: #0e0e0e;
  }
  &::placeholder {
    color: #00925a;
  }
  &:focus {
    outline: 1px solid var(--primary-color);
    /* border-bottom: 2px solid var(--primary-color); */
  }
`;
