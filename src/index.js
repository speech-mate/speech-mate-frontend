import React from "react";
import ReactDOM from "react-dom";

import GlobalStyle from "./components/GlobalStyle";
import Login from "./pages/Login";

import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <Login />
  </React.StrictMode>,
  document.getElementById("root"),
);

reportWebVitals(console.log);
