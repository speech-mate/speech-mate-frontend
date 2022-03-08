import { useState } from "react";

const initialState = {
  title: "",
  subThemes: [],
  speechTone: null,
  userPitch: null,
  noteRange: [],
  pitchStatus: null,
  url: null,
  fileId: null,
};

function useSpeechState() {
  const [speechState, setSpeechState] = useState(initialState);

  return {
    speechState,
    setSpeechState,
    clearSpeech: () => setSpeechState(initialState),
  };
}

export default useSpeechState;
