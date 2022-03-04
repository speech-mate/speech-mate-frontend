export async function turnOnMic(setMicState) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      autoGainControl: false,
      noiseSuppression: false,
      latency: 0,
    },
  });

  setMicState((prev) => {
    return {
      ...prev,
      initMic: true,
      mediaStream: stream,
    };
  });
}

export function stopAudioTracks(audioStream) {
  audioStream?.getAudioTracks().forEach((track) => {
    track.stop();
  });
}
