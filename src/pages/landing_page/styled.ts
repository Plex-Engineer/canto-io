import styled from "@emotion/styled";
import "fonts/modeseven.ttf";
export const Styled = styled.div`
  $primary-color: #06fc99;
  justify-content: center;
  height: 100%;
  width: 1200px;
  margin: 0 auto;
  background-color: black;
  display: flex;

  * {
    font-family: "ModeSeven", monospace;
  }

  .container {
    display: flex;
    flex-direction: column;

    max-width: 1024px;
    width: 100%;
    background-color: black;
    height: 100%;
    gap: 2rem;
  }

  $color1: #00ffd5;
  $color2: #2c9e0f;
  $color3: #8bff9f;

  h1 {
    font-size: 8rem;
    color: var(--primary-color);
    text-align: center;
    margin-top: 2rem;
  }

  .typing {
    font-size: 24px;
    line-height: 132%;
    text-align: justify;
    letter-spacing: -0.045em;
    text-transform: lowercase;
    color: var(--primary-color);
    text-shadow: 0px 0px 2px rgba(255, 220, 45, 0.2), 0px 0px 6px #06fc9a93;
  }

  .dim {
    &::before {
      content: "********";
    }
    &::after {
      content: "********";
    }

    color: #007948;
    font-size: 1.4rem;
    text-shadow: 0px 0px 16px rgba(6, 252, 153, 0.6);
  }

  .options {
    font-size: 1.4rem;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    cursor: pointer;
  }

  a {
    color: $primary-color;
    text-decoration: none;

    text-shadow: 0px 5.2px 5.2px rgba(0, 0, 0, 0.25), 0px 0px 26px #06fc99;
  }

  .input-bar {
    margin-top: 2rem;
    text-shadow: 0px 5.2px 5.2px rgba(0, 0, 0, 0.25), 0px 0px 26px #06fc99;
    font-size: 1.4rem;
    display: flex;
    span {
      padding: 1rem 0;
    }
  }

  input[type="text"] {
    background-color: transparent;
    border: none;
    font-size: 1.4rem;
    color: #06b971;
    flex-grow: 1;
    // caret-color: transparent;
    padding: 1rem;
    text-shadow: 0px 5.2px 5.2px rgba(0, 0, 0, 0.25), 0px 0px 26px #06fc99;
    &:focus {
      outline: none;
    }
  }

  .blink {
    animation: blinker 0.6s linear infinite;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }

  @media screen and (max-width: 600px) {
    .container {
      width: 100%;
      padding: 0;
    }

    .dim {
      &::before {
        content: "";
      }
      &::after {
        content: "";
      }
    }

    .glitch {
      // transform: ;
      transform: scale(0.4) translate(0em, -0.02em);

      & span:first-of-type {
        display: none;
      }

      & span:last-child {
        display: none;
      }
    }

    input[type="text"] {
      flex-grow: 1;
    }
    .input-bar {
      // width: 100%;
      margin: 0 2rem;
    }
    #inputData {
      width: 5px !important;
    }

    .typing {
      margin: 0 2rem;
      letter-spacing: 2px;
      text-align: start;
    }
    .dim {
      text-align: center;
    }
    .options {
      margin: 2rem;
    }
  }
  .disabled > a {
    color: rgb(144, 144, 144) !important;
    text-shadow: none;
  }
  position: relative;

  .alert {
    position: absolute;
    left: 50%;
    bottom: 2rem;
    transform: translateX(-50%);
    font-size: 1.2rem;
    text-align: center;

    #error {
      display: none;
      color: #f36040;
      text-shadow: 0px 0px 26px rgba(228, 63, 27, 0.5);
    }
    #warning {
      display: none;
      color: #f3cf40;
      text-shadow: 0px 0px 26px rgba(228, 208, 27, 0.5);
    }
  }

  @media (max-width: 1000px) {
    width: 100%;

    h1 {
      font-size: 20vmin;
    }

    .typing {
    }
    .alert {
      bottom: 4rem;
    }
  }
`;
