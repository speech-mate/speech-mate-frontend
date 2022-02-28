import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useUserAudio() {
  const [audioStream, setAudioStream] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function enableAudioStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
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
