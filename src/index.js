import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import GlobalStyle from "./components/GlobalStyle";
import Login from "./pages/Login";

import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
    <Login />
  </React.StrictMode>,
  document.getElementById("root"),
);

reportWebVitals();
