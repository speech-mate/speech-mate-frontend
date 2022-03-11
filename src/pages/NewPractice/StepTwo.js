import React, { useState, useEffect } from "react";
import propTypes from "prop-types";

import ButtonLarge from "../../components/Button/ButtonLarge";
import Logo from "../../components/Logo/Logo";
import Indicator from "../../components/Indicator/Indicator";

import useMic from "../../hooks/useMic";
import useInterval from "../../hooks/useInterval";
import autoCorrelate from "../../util/autoCorrelate";
import {
  StepTwoBox,
  LogoBox,
  IndicatorBox,
  FrequencyBox,
} from "./NewPracticeStyles";
import {
  TEXT_CONTENTS,
  SELECTIONS,
  NOTE_VALIDATION,
} from "../../constants/newPractice";
import { getAudioContext, getAnalyser } from "../../handlers/audioCtxControls";
import { findClosestNote, getNoteRange } from "../../util/helpers";

const audioCtx = getAudioContext();
const analyserNode = getAnalyser();
const bufferLength = 2048;
const buffer = new Float32Array(bufferLength);

function StepTwo({ toNextStep, speechHandlers }) {
  const [source, setSource] = useState(null);
  const [pitchStatus, setPitchStatus] = useState({});
  const [throttle, setThrottle] = useState(false);
  const [currentFF, setCurrentFF] = useState();
  const { micState, ...micHandlers } = useMic();

  function getPitch() {
    analyserNode.getFloatTimeDomainData(buffer);
    const fundamentalFrequency = autoCorrelate(buffer, audioCtx.sampleRate);
    if (
      !fundamentalFrequency ||
      fundamentalFrequency < NOTE_VALIDATION.MIN ||
      fundamentalFrequency > NOTE_VALIDATION.MAX
    )
      return;

    const note = findClosestNote(fundamentalFrequency);
    if (throttle) {
      setCurrentFF(fundamentalFrequency.toFixed(2));
      setThrottle(false);
    }

    if (note && !pitchStatus[note.frequency]) {
      setPitchStatus((prev) => {
        return {
          ...prev,
          [note.frequency]: 1,
        };
      });
    }

    if (note && pitchStatus[note.frequency]) {
      setPitchStatus((prev) => {
        return {
          ...prev,
          [note.frequency]: prev[note.frequency] + 1,
        };
      });
    }
  }

  useInterval(getPitch, micState.initMic ? 1 : null);
  useInterval(() => setThrottle(true), micState.initMic ? 300 : null);

  useEffect(() => {
    if (micState.initMic || !Object.keys(pitchStatus).length) return;

    const noteRange = getNoteRange(pitchStatus);
    console.log(noteRange);

    setCurrentFF(noteRange[2].frequency);
    speechHandlers.setSpeechState((prev) => {
      return {
        ...prev,
        userPitch: noteRange[2],
        noteRange,
      };
    });
  }, [micState.initMic]);

  useEffect(() => {
    if (!source) return;

    source.connect(analyserNode);

    return () => {
      source.disconnect(analyserNode);
    };
  }, [source]);

  useEffect(async () => {
    if (!micState.mediaStream) return;

    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }

    setSource(audioCtx.createMediaStreamSource(micState.mediaStream));
  }, [micState.mediaStream]);

  useEffect(() => {
    return () => micHandlers.cancelMic();
  }, []);

  return (
    <StepTwoBox>
      <p>{TEXT_CONTENTS.TWO.INSTRUCTION}</p>
      {currentFF && <FrequencyBox>{currentFF} Hz</FrequencyBox>}
      <LogoBox>
        <Logo />
      </LogoBox>
      {micState.initMic && (
        <IndicatorBox>
          <span>{micState.count}</span>
          <Indicator />
        </IndicatorBox>
      )}
      {micState.count > 0 ? (
        <ButtonLarge
          text={SELECTIONS.TWO[0]}
          onClick={micHandlers.turnOnMic}
          disabled={micState.initMic}
        />
      ) : (
        <ButtonLarge text={SELECTIONS.TWO[1]} onClick={toNextStep} />
      )}
    </StepTwoBox>
  );
}

StepTwo.propTypes = {
  toNextStep: propTypes.func,
  speechState: propTypes.object,
  speechHandlers: propTypes.object,
  micState: propTypes.object,
  micHandlers: propTypes.object,
};

export default StepTwo;
