import styled from "@emotion/styled";

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
