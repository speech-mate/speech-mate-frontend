import { useState, useEffect } from "react";
import useInterval from "./useInterval";
import {
  startRecording,
  saveRecording,
  pauseRecodring,
  resumeRecodring,
  setMaxRecordingTime,
} from "../handlers/recorderControls";

const initialState = {
  maxRecordingMin: 0,
  maxRecordingSec: 0,
  recordingMin: 0,
  recordingSec: 0,
  initRecording: false,
  mediaStream: null,
  mediaRecorder: null,
  audio: null,
  blob: null,
};

function useRecorder() {
  const [recorderState, setRecorderState] = useState(initialState);
  const [isRecOn, setIsRecOn] = useState(false);

  useInterval(
    () => {
      setRecorderState((prev) => {
        if (
          prev.recordingMin === prev.maxRecordingMin &&
          prev.recordingSec === prev.maxRecordingSec
        ) {
          if (prev.mediaRecorder) {
            prev.mediaRecorder.pause();
          }

          return prev;
        }

        if (prev.recordingSec >= 0 && prev.recordingSec < 59) {
          return { ...prev, recordingSec: prev.recordingSec + 1 };
        }

        if (prev.recordingSec === 59) {
          return {
            ...prev,
            recordingMin: prev.recordingMin + 1,
            recordingSec: 0,
          };
        }
      });
    },
    isRecOn ? 1000 : null,
  );

  useEffect(() => {
    if (!recorderState.mediaStream) return;
    setRecorderState((prev) => {
      return {
        ...prev,
        mediaRecorder: new MediaRecorder(prev.mediaStream),
      };
    });
  }, [recorderState.mediaStream]);

  useEffect(() => {
    if (!recorderState.mediaRecorder) return;

    const recorder = recorderState.mediaRecorder;
    let chunks = [];

    if (recorder.state === "inactive") {
      recorder.start();
      setIsRecOn(true);
    }

    recorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    recorder.onpause = () => {
      setIsRecOn(false);
    };

    recorder.onresume = () => {
      setIsRecOn(true);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      chunks = [];

      setIsRecOn(false);
      setRecorderState((prev) => {
        if (prev.mediaRecorder) {
          return {
            ...prev,
            audio: window.URL.createObjectURL(blob),
            blob,
          };
        }

        return initialState;
      });
    };

    return () => {
      if (recorder)
        recorder.stream.getAudioTracks().forEach((track) => track.stop());
    };
  }, [recorderState.mediaRecorder]);

  return {
    recorderState,
    startRecording: () => startRecording(setRecorderState),
    saveRecording: () => saveRecording(recorderState.mediaRecorder),
    pauseRecording: () => pauseRecodring(recorderState.mediaRecorder),
    resumeRecording: () => resumeRecodring(recorderState.mediaRecorder),
    setMaxRecordingTime: (min, sec) =>
      setMaxRecordingTime(setRecorderState, min, sec),
    cancelRecording: () => {
      if (recorderState.mediaRecorder) {
        recorderState.mediaRecorder.stream
          .getAudioTracks()
          .forEach((track) => track.stop());
      }
      setRecorderState(initialState);
    },
  };
}

export default useRecorder;
