import React, { useEffect, useRef, useState } from "react";
import propTypes from "prop-types";
import styled from "styled-components";
import useUserAudio from "../../hooks/useUserAudio";
import useInterval from "../../hooks/useInterval";
import { getAudioContext, getAnalyser } from "../../api/audio";
import autoCorrelate from "../../util/autoCorrelate";
import { STEP } from "../../constants/newPractice";
import { findClosestNote } from "../../util/helpers";

function Microphone({ time, setUserPitch, mode }) {
  const [source, setSource] = useState(null);
  const [onAnalyse, setOnAnalyse] = useState(false);
  const [count, setCount] = useState(0);
  const [pitches, setPitches] = useState([]);

  const audioStream = useUserAudio();
  const audioCtx = getAudioContext();
  const analyserNode = getAnalyser();
  const bufferLength = 2048;
  const buffer = new Float32Array(bufferLength);

  function recordPitch() {
    analyserNode.getFloatTimeDomainData(buffer);
    const fundamentalFrequency = autoCorrelate(buffer, audioCtx.sampleRate);
    if (!fundamentalFrequency) return;
    setPitches([...pitches, fundamentalFrequency]);
  }

  function countDown() {
    setCount((prev) => (prev === 0 ? setOnAnalyse(false) : prev - 1));
  }

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
    setOnAnalyse(true);
    setCount(time);

    return () => {
      source.disconnect(analyserNode);
    };
  }, [source]);

  useEffect(() => {
    if (!pitches.length) return;

    const closestNote = findClosestNote(pitches);
    setUserPitch(closestNote);
  }, [onAnalyse]);

  useInterval(mode === STEP.TWO && recordPitch, onAnalyse ? 1 : null);
  useInterval(countDown, onAnalyse ? 1000 : null);

  return <MicrophoneLayout>{count}</MicrophoneLayout>;
}

const MicrophoneLayout = styled.div`
  position: absolute;
`;

Microphone.propTypes = {
  time: propTypes.number,
  setUserPitch: propTypes.func,
  mode: propTypes.string,
};

export default Microphone;
