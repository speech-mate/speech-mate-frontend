import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./context/AuthProvider";
import Error from "./pages/Error";
import Login from "./pages/Login";
import Main from "./pages/Main";
import NewPractice from "./pages/NewPractice/NewPractice";
import Review from "./pages/Review/Review";

import useRecorder from "./hooks/useRecorder";

function App() {
  const { recorderState, ...handlers } = useRecorder();
  const { audio } = recorderState;

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Main />} />
            <Route
              path="practice/new"
              element={
                <NewPractice
                  recorderState={recorderState}
                  handlers={handlers}
                />
              }
            />
            <Route path="practice/review" element={<Review audio={audio} />} />
          </Route>
          <Route
            path="*"
            element={<Error error={{ code: 404, message: "Page Not Found" }} />}
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
