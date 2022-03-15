export async function startRecording(setRecorderState) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      autoGainControl: false,
      noiseSuppression: false,
      latency: 0,
    },
    video: false,
  });

  setRecorderState((prev) => {
    return {
      ...prev,
      initRecording: true,
      mediaStream: stream,
    };
  });
}

export function saveRecording(recorder) {
  if (recorder.state !== "inactive") recorder.stop();
}

export function pauseRecodring(recorder) {
  if (recorder.state === "recording") recorder.pause();
}

export function resumeRecodring(recorder) {
  if (recorder.state === "paused") recorder.resume();
}

export function setMaxRecordingTime(setRecorderState, min, sec) {
  setRecorderState((prev) => {
    return {
      ...prev,
      maxRecordingMin: min,
      maxRecordingSec: sec,
    };
  });
}
