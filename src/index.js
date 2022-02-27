import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import GlobalStyle from "./components/GlobalStyle";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Error from "./pages/Error";
import { AuthProvider } from "./context/AuthProvider";

import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="login" element={<Login />} />

            <Route element={<RequireAuth />}>
              <Route path="/" element={<Main />} />
            </Route>

            <Route
              path="*"
              element={
                <Error error={{ code: 404, message: "Page Not Found" }} />
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root"),
);

reportWebVitals();
