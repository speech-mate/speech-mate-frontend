import React, { useState, useEffect } from "react";
import propTypes from "prop-types";

import ButtonLarge from "../../components/Button/ButtonLarge";
import Logo from "../../components/Logo/Logo";
import Indicator from "../../components/Indicator/Indicator";

import { TEXT_CONTENTS, SELECTIONS } from "../../constants/newPractice";
import { StepTwoBox, LogoBox, IndicatorBox } from "./NewPracticeStyles";
import { getAudioContext, getAnalyser } from "../../handlers/audioCtxControls";
import useInterval from "../../hooks/useInterval";
import autoCorrelate from "../../util/autoCorrelate";
import { findClosestNote, getNoteRange } from "../../util/helpers";

function StepTwo({
  onStepTwoSelection,
  speechHandlers,
  micState,
  micHandlers,
}) {
  const [source, setSource] = useState(null);
  const [pitchStatus, setPitchStatus] = useState({});

  const audioCtx = getAudioContext();
  const analyserNode = getAnalyser();
  const bufferLength = 2048;
  const buffer = new Float32Array(bufferLength);

  function recordPitch() {
    analyserNode.getFloatTimeDomainData(buffer);
    const fundamentalFrequency = autoCorrelate(buffer, audioCtx.sampleRate);
    if (!fundamentalFrequency) return;

    const note = findClosestNote(fundamentalFrequency);

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

  useInterval(recordPitch, micState.initMic ? 1 : null);

  useEffect(() => {
    if (micState.count !== 0 || !Object.keys(pitchStatus).length) return;

    const noteRange = getNoteRange(pitchStatus);

    speechHandlers.setSpeechState((prev) => {
      return {
        ...prev,
        userPitch: noteRange[2],
        noteRange,
      };
    });
  }, [micState.count]);

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

  return (
    <StepTwoBox>
      <p>{TEXT_CONTENTS.TWO.INSTRUCTION}</p>
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
        <ButtonLarge text={SELECTIONS.TWO[1]} onClick={onStepTwoSelection} />
      )}
    </StepTwoBox>
  );
}

StepTwo.propTypes = {
  onStepTwoSelection: propTypes.func,
  speechState: propTypes.object,
  speechHandlers: propTypes.object,
  micState: propTypes.object,
  micHandlers: propTypes.object,
};

export default StepTwo;
