import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --primary-color: #06FC99;
    --primary-dark-color: #11D888;
    --primary-darker-color: #05955B;

    --error-color: #FF4141;
    --warning-color: #FFDA58;

    --off-white-color: #F2F2F2;
    --semi-grey-color: #B3B3B3;
    --holy-grey-color: #8B8B8B;
    --just-grey-color: #717171;
    --dark-grey-color: #424242;
    --too-dark-color : #222222;
    --pitch-black-color: #111111;
  }
`;
