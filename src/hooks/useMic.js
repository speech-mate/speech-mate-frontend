import { useEffect, useState } from "react";
import { turnOnMic, stopAudioTracks } from "../handlers/micControls";
import useInterval from "./useInterval";

const initialState = {
  count: 5,
  initMic: false,
  mediaStream: null,
};

function useMic() {
  const [micState, setMicState] = useState(initialState);
  const [isMicOn, setIsMicOn] = useState(false);

  useInterval(
    () => {
      setMicState((prev) => {
        if (prev.count === 0) {
          setIsMicOn(false);
          stopAudioTracks(prev.mediaStream);
          return {
            ...prev,
            initMic: false,
            mediaStream: null,
          };
        }

        return {
          ...prev,
          count: prev.count - 1,
        };
      });
    },
    isMicOn ? 1000 : null,
  );

  return {
    micState,
    turnOnMic: () => {
      setIsMicOn(true);
      turnOnMic(setMicState);
    },
    cancelMic: () =>
      setMicState((prev) => {
        setIsMicOn(false);
        stopAudioTracks(prev.mediaStream);
        return initialState;
      }),
  };
}

export default useMic;
