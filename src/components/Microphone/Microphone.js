import React, { useEffect, useRef, useState } from "react";
import propTypes from "prop-types";
import styled from "styled-components";
import useUserAudio from "../../hooks/useUserAudio";
import useInterval from "../../hooks/useInterval";
import { getAudioContext, getAnalyser } from "../../api/audio";
import autoCorrelate from "../../util/autoCorrelate";

const noteStrings = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

function Microphone({ setUserPitch }) {
  const [source, setSource] = useState(null);
  const [pitchNote, setPitchNote] = useState("C");
  const [pitchScale, setPitchScale] = useState("4");
  const [pitch, setPitch] = useState("0 Hz");
  const [detune, setDetune] = useState("0");

  const audioStream = useUserAudio();
  const audioCtx = getAudioContext();
  const analyserNode = getAnalyser();
  const bufferLength = 2048;
  const buffer = new Float32Array(bufferLength);

  const updatePitch = () => {
    analyserNode.getFloatTimeDomainData(buffer);
    const ac = autoCorrelate(buffer, audioCtx.sampleRate);
    // var ac = autoCorrelate(buf, audioCtx.sampleRate);
    // if (ac > -1) {
    //   let note = noteFromPitch(ac);
    //   let sym = noteStrings[note % 12];
    //   let scl = Math.floor(note / 12) - 1;
    //   let dtune = centsOffFromPitch(ac, note);
    //   setPitch(parseFloat(ac).toFixed(2) + " Hz");
    //   setPitchNote(sym);
    //   setPitchScale(scl);
    //   setDetune(dtune);
    //   setNotification(false);
    //   console.log(note, sym, scl, dtune, ac);
    // }
  };

  useEffect(async () => {
    if (!audioStream) return;

    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }

    setSource(audioCtx.createMediaStreamSource(audioStream));
  }, [audioStream]);

  useEffect(() => {
    if (!source) return;

    source.connect(analyserNode);

    return () => {
      source.disconnect(analyserNode);
    };
  }, [source]);

  useInterval(updatePitch, 1);

  return (
    <MicrophoneLayout>
      <span>
        {pitchNote}
        {pitchScale}
      </span>
      <span>{pitch}</span>
    </MicrophoneLayout>
  );
}

const MicrophoneLayout = styled.div`
  position: absolute;
`;

Microphone.propTypes = {
  setUserPitch: propTypes.func,
};

export default Microphone;
