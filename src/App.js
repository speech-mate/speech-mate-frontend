import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Error from "./pages/Error";
import Login from "./pages/Login";
import Main from "./pages/Main";
import NewPractice from "./pages/NewPractice/NewPractice";
import Review from "./pages/Review/Review";
import Files from "./pages/Files/Files";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import { AuthProvider } from "./context/AuthProvider";

import useRecorder from "./hooks/useRecorder";
import useSpeechState from "./hooks/useSpeechState";

function App() {
  const [files, setFiles] = useState([]);
  const { recorderState, ...recorderHandlers } = useRecorder();
  const { speechState, ...speechHandlers } = useSpeechState();

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login setFiles={setFiles} />} />
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Main />} />
              <Route
                path="practice/new"
                element={
                  <NewPractice
                    speechState={speechState}
                    speechHandlers={speechHandlers}
                    recorderState={recorderState}
                    recorderHandlers={recorderHandlers}
                  />
                }
              />
              <Route
                path="practice/review"
                element={
                  <Review
                    files={files}
                    setFiles={setFiles}
                    speechState={speechState}
                    recorderState={recorderState}
                  />
                }
                s
              />
              <Route
                path="practice/files"
                element={
                  <Files
                    files={files}
                    setFiles={setFiles}
                    speechHandlers={speechHandlers}
                    recorderHandlers={recorderHandlers}
                  />
                }
              />
            </Route>
          </Route>
          <Route path="/error" element={<Error />} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
