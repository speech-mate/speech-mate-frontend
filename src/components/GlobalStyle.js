import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset}

  :root {
    --magnolia-color: #F4EEFF;
    --pale-lavender-color: #DCD6F7;
    --maximum-blue-purple-color: #A6B1E1;
    --independence-color: #424874;
  }

  html {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    background-color: var(--independence-color);
  }

  body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 320px;
    max-width: 430px;
    height: 100vh;
    min-height: calc(100vh - 5rem);
    font-family: "Noto Sans KR", sans-serif;
    -ms-overflow-style: none;
    ::-webkit-scrollbar {
      display: none;
    }
  }

  #root {
    height: 100%;
  }
`;

export default GlobalStyle;
