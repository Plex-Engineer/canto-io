import styled from "@emotion/styled";

export const Styled = styled.div`
  @font-face {
    font-family: modeSeven;
    src: url("/assets/modeseven.ttf");
  }
  $primary-color: #06fc99;

  .overlayScan {
    -webkit-font-smoothing: antialiased;
    font-family: otto, Arial, Helvetica, sans-serif;
    background-image: url(data:image/gif;base64,R0lGODlhCgAgAIABAAAAAP///yH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMS1jMDAwIDc5LmIwZjhiZTkwLCAyMDIxLzEyLzE1LTIxOjI1OjE1ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjMuMiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGNUFBNUE4NDg5NDgxMUVDQjAwRDg1RkQyNUExRUU3RCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGNUFBNUE4NTg5NDgxMUVDQjAwRDg1RkQyNUExRUU3RCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkY1QUE1QTgyODk0ODExRUNCMDBEODVGRDI1QTFFRTdEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkY1QUE1QTgzODk0ODExRUNCMDBEODVGRDI1QTFFRTdEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkECQoAAQAsAAAAAAoAIAAAAhWEj5nB7Q+jnLTai7N2qvcNhuJIlgUAIfkECQoAAQAsAAAAAAoAIAAAAhaEj6HL7Q+jnLTaixnafOcPhuJIdkcBACH5BAkKAAEALAAAAAAKACAAAAIVjI+py+0Po5wUgYuz1rX7D4biRpIFACH5BAkKAAEALAAAAAAKACAAAAIWjI+py+0Po5wO2Itzprz7D4aLRpJOAQAh+QQJCgABACwAAAAACgAgAAACFYyPqcvtD6OcoNqL8dy8+w9K2Th+BQAh+QQJCgABACwAAAAACgAgAAACFoyPqcvtD6NMoNqL8dy8+w9K2TiGTAEAIfkECQoAAQAsAAAAAAoAIAAAAhWMj6nL7Q9jA7Tae6XevPsPYqIIegUAIfkECQoAAQAsAAAAAAoAIAAAAhaMj6nL7Q8hmLRaG7PevPvPXKIIlksBACH5BAkKAAEALAAAAAAKACAAAAIWjI+py+0PDZi0Whuz3rz7z1yiCJZcAQAh+QQJCgABACwAAAAACgAgAAACFoyPqcvtj4CctFaIs968+22F4UeWSwEAIfkECQoAAQAsAAAAAAoAIAAAAhaMj6nL7QminJS+i7PevHtYhdVHllwBACH5BAkKAAEALAAAAAAKACAAAAIWjI+py50Ao5zT2Yuz3rxnCoLeSJZMAQAh+QQJCgABACwAAAAACgAgAAACFoyPqcsID6OUrdqLs968pwmC3kiWXQEAIfkECQoAAQAsAAAAAAoAIAAAAhaMj6lr4A9jZLTai7PeXMv/deJIllUBACH5BAkKAAEALAAAAAAKACAAAAIWjI+ZwO3/lJy02ouz3tzA/3XiSJZjAQAh+QQFCgABACwAAAAACgAgAAACFoyPoMvdCKOctNqLs97Vec+F4kiWWAEAOw==);
    opacity: 18%;
    z-index: 500;
    background-attachment: fixed;
    background-repeat: repeat;
    bottom: 0;
    display: block;
    height: 100%;
    left: 0;
    margin: 0;
    padding: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
  }

  .overlayStatic {
    -webkit-font-smoothing: antialiased;
    font-family: otto, Arial, Helvetica, sans-serif;
    background-attachment: fixed;
    background-repeat: repeat;
    bottom: 0;
    display: block;
    height: 100%;
    left: 0;
    margin: 0;
    padding: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    background-image: url("/assets/noise.gif");
    background-size: 170px;
    mix-blend-mode: lighten;
    opacity: 40%;
    z-index: 600;
  }

  .overlayAnimation {
    pointer-events: none;
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0) 100%
    );
    background-size: auto 4px;
    z-index: 1;
    &::before {
      content: "";
      pointer-events: none;
      position: absolute;
      display: block;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%; // 4 times the height of the overlay !TODO fix this with js height
      background-image: linear-gradient(
        0deg,
        transparent 0%,
        rgba(32, 128, 32, 0.2) 2%,
        rgba(32, 128, 32, 0.8) 3%,
        rgba(32, 128, 32, 0.2) 3%,
        transparent 100%
      );
      background-repeat: no-repeat;
      background-position: 0 1000vh;
      animation: scan 10s linear 0s 1;
    }
    @keyframes scan {
      0% {
        background-position: 0 -100vh;
      }
      35%,
      100% {
        background-position: 0 100vh;
      }
    }
  }

  .overlay {
    z-index: 4100;
  }

  .overlay:before {
    content: "";
    position: absolute;
    top: 0px;
    width: 100%;
    height: 5px;
    background: #fff;
    background: linear-gradient(
      to bottom,
      rgba(255, 0, 0, 0) 0%,
      rgba(255, 250, 250, 1) 50%,
      rgba(255, 255, 255, 0.98) 51%,
      rgba(255, 0, 0, 0) 100%
    ); /* W3C */
    opacity: 0.1;
    animation: vline 1.25s linear infinite;
  }

  .overlay:after {
    box-shadow: 0 2px 6px rgba(25, 25, 25, 0.2),
      inset 0 1px rgba(50, 50, 50, 0.1), inset 0 3px rgba(50, 50, 50, 0.05),
      inset 0 3px 8px rgba(64, 64, 64, 0.05),
      inset 0 -5px 10px rgba(25, 25, 25, 0.1);
  }

  @keyframes vline {
    0% {
      top: 0px;
    }
    100% {
      top: 100%;
    }
  }

  .layer {
    // ... positioning
    z-index: 4001;
    box-shadow: inset 0px 0px 1px 1px rgba(64, 64, 64, 0.1);
    background: radial-gradient(
      ellipse at center,
      darken($primary-color, 1%) 0%,
      rgba(64, 64, 64, 0) 50%
    );
    transform-origin: 50% 50%;
    transform: perspective(20px) rotateX(0.5deg) skewX(2deg) scale(1.03);
    animation: glitch 1s linear infinite;
    opacity: 0.9;
  }

  .layer:after {
    // ... positioning
    background: radial-gradient(
      ellipse at center,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(64, 64, 64, 0) 100%
    );
    opacity: 0.1;
  }

  @keyframes glitch {
    0% {
      transform: scale(1, 1.002);
    }
    50% {
      transform: scale(1, 1.0001);
    }
    100% {
      transform: scale(1.001, 1);
    }
  }

  #faux-terminal:before {
    // ... positioning
    z-index: 4010;
    background: linear-gradient(#444 50%, #000 50%);
    background-size: 100% 4px;
    background-repeat: repeat-y;
    opacity: 0.14;
    box-shadow: inset 0px 0px 1px 1px rgba(0, 0, 0, 0.8);
    animation: pulse 5s linear infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1.001);
      opacity: 0.14;
    }
    8% {
      transform: scale(1);
      opacity: 0.13;
    }
    15% {
      transform: scale(1.004);
      opacity: 0.14;
    }
    30% {
      transform: scale(1.002);
      opacity: 0.11;
    }
    100% {
      transform: scale(1);
      opacity: 0.14;
    }
  }

  * {
    font-family: "modeSeven", monospace;
    box-sizing: border-box;
    margin: 0%;
    padding: 0%;

    &::selection {
      color: rgb(48, 48, 48);
      background: rgb(137, 255, 137);
    }
  }

  body {
    background-color: black;
    color: var(--primary-color);
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: absolute;
  }

  .container {
    // width: 1024px;
    padding: 0 8rem;
    margin: 0 auto;
    margin-bottom: 1rem;
  }

  $color1: #00ffd5;
  $color2: #2c9e0f;
  $color3: #8bff9f;
  .glitch {
    & {
      text-shadow: 0.01em 0 0 $color1, -0.01em -0.02em 0 $color2,
        0.025em 0.02em 0 $color3;
      animation: glitch 725ms infinite;
    }
    & span {
      position: absolute;
      top: 0;
      right: 50%;
    }
    & span:first-child {
      animation: glitch 500ms infinite;
      clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
      transform: translate(50%, -0.02em);
      opacity: 0.75;
    }
    & span:last-child {
      animation: glitch 375ms infinite;
      clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
      transform: translate(50%, 0.02em);
      opacity: 0.75;
    }
    @keyframes glitch {
      0% {
        text-shadow: 0.01em 0 0 $color1, -0.03em -0.02em 0 $color2,
          0.025em 0.02em 0 $color3;
      }
      15% {
        text-shadow: 0.01em 0 0 $color1, -0.03em -0.02em 0 $color2,
          0.025em 0.02em 0 $color3;
      }
      16% {
        text-shadow: -0.01em -0.025em 0 $color1, 0.025em 0.035em 0 $color2,
          -0.01em -0.01em 0 $color3;
      }
      49% {
        text-shadow: -0.01em -0.025em 0 $color1, 0.025em 0.035em 0 $color2,
          -0.01em -0.01em 0 $color3;
      }
      50% {
        text-shadow: 0.01em 0.035em 0 $color1, 0.03em 0 0 $color2,
          0 -0.02em 0 $color3;
      }
      99% {
        text-shadow: 0.01em 0.035em 0 $color1, 0.03em 0 0 $color2,
          0 -0.02em 0 $color3;
      }
      100% {
        text-shadow: -0.01em 0 0 $color1, -0.025em -0.02em 0 $color2,
          -0.02em -0.025em 0 $color3;
      }
    }
  }

  .title {
    margin: 3rem 0;
    position: relative;
    font-size: 10rem;
    text-shadow: 0px 0px 132px $primary-color;
    text-align: center;
    color: var(--primary-color);

    text-shadow: 0px 0px 181.872px #06fc99;
    font-weight: 300;
  }

  .typing {
    max-width: 1024px;
    margin: 0 auto;
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
    margin-top: 2rem;
    text-shadow: 0px 0px 16px rgba(6, 252, 153, 0.6);
  }

  .options {
    margin-top: 2rem;
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

      & span:first-child {
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
    .title {
      margin: 0;
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

  .alert {
    // display: none;
    margin-bottom: 4rem;

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
`;
