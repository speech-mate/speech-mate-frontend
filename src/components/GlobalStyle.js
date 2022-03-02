import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset}

  :root {
    --magnolia-color: #F4EEFF;
    --pale-lavender-color: #DCD6F7;
    --maximum-blue-purple-color: #A6B1E1;
    --independence-color: #424874;
    --ice-grey-color: #C1C7CC;
    --dark-grey-blue-color: #424952;
  }

  html {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    background-color: var(--ice-grey-color);
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
    background-color: var(--independence-color);
    color: white;
    font-family: "Noto Sans KR", sans-serif;
    -ms-overflow-style: none;
    ::-webkit-scrollbar {
      display: none;
    }
    
    input::-webkit-inner-spin-button { 
      appearance: none;
      -moz-appearance: none; 
      -webkit-appearance: none; 
    }
  }


  #root {
    height: 100%;
  }
`;

export default GlobalStyle;
