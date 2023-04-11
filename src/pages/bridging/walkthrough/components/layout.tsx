import styled from "@emotion/styled";

const BaseStyled = styled.div`
  background-color: black;
  height: 100%;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  .row {
    width: min-content;
    display: flex;
    gap: 2rem;
  }
  section {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    justify-content: center;
  }

  header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  footer {
    margin-bottom: 2rem;
    button {
      width: 10rem;
    }
  }
  animation: fadeIn 0.2s forwards;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @media (max-width: 1000px) {
    .row {
      flex-direction: column;
    }
  }
`;

export default BaseStyled;
