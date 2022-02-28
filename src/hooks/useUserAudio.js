import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function useUserAudio() {
  const [audioStream, setAudioStream] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function enableAudioStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            autoGainControl: false,
            noiseSuppression: false,
            latency: 0,
          },
        });
        setAudioStream(stream);
      } catch (err) {
        navigate("/error");
      }
    }

    if (!audioStream) {
      enableAudioStream();
    } else {
      return function cleanup() {
        audioStream.getTracks().forEach((track) => {
          track.stop();
        });
      };
    }
  }, [audioStream]);

  return audioStream;
}

export default useUserAudio;
