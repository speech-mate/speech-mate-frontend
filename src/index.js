import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import GlobalStyle from "./components/GlobalStyle";
import App from "./App";

import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root"),
);

reportWebVitals();
