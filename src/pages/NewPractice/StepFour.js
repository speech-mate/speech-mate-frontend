import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import propTypes from "prop-types";
import {
  StepFourBox,
  FlashCard,
  ButtonBox,
  TimeBox,
} from "./NewPracticeStyles";

import Keyboard from "../../components/Keyboard/Keyboard";
import ButtonLarge from "../../components/Button/ButtonLarge";
import { formatMin, formatSec } from "../../util/formatTime";
import useInterval from "../../hooks/useInterval";
import { getAudioContext, getAnalyser } from "../../handlers/audioCtxControls";
import autoCorrelate from "../../util/autoCorrelate";
import { findNoteInRange } from "../../util/helpers";

function StepFour({
  speechState,
  speechHandlers,
  recorderState,
  recorderHandlers,
}) {
  const [source, setSource] = useState(null);
  const [currSubTheme, setCurrSubTheme] = useState(null);
  const [onAnalyse, setOnAnalyse] = useState(false);
  const [pitchStatus, setPitchStatus] = useState({});
  const [currentNote, setCurrentNote] = useState(null);
  const [throttle, setThrottle] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const audioCtx = getAudioContext();
  const analyserNode = getAnalyser();
  const bufferLength = 2048;
  const buffer = new Float32Array(bufferLength);

  function toReview() {
    recorderHandlers.saveRecording();
    navigate("/practice/review", {
      state: {
        from: location,
      },
    });
  }

  function recordPitch() {
    analyserNode.getFloatTimeDomainData(buffer);
    const fundamentalFrequency = autoCorrelate(buffer, audioCtx.sampleRate);
    if (!fundamentalFrequency || fundamentalFrequency > 500) return;

    const currentNote = findNoteInRange(
      fundamentalFrequency,
      speechState.noteRange,
    );

    if (!pitchStatus[currentNote.note]) {
      setPitchStatus((prev) => {
        return {
          ...prev,
          [currentNote.note]: 1,
        };
      });
    }

    if (pitchStatus[currentNote.note]) {
      setPitchStatus((prev) => {
        return {
          ...prev,
          [currentNote.note]: prev[currentNote.note] + 1,
        };
      });
    }

    if (throttle) {
      setCurrentNote(currentNote.note);
      setThrottle(false);
    }
  }

  useInterval(recordPitch, onAnalyse ? 1 : null);
  useInterval(() => setThrottle(true), onAnalyse ? 200 : null);

  useEffect(() => {
    if (
      recorderState.recordingMin !== recorderState.maxRecordingMin &&
      recorderState.recordingSec !== recorderState.maxRecordingSec
    )
      return;

    setOnAnalyse(false);
  }, [recorderState.recordingMin, recorderState.recordingSec]);

  useEffect(() => {
    if (onAnalyse || !Object.keys(pitchStatus).length) return;

    speechHandlers.setSpeechState((prev) => {
      return { ...prev, pitchStatus };
    });
  }, [onAnalyse]);

  useEffect(async () => {
    if (!recorderState.mediaStream) return;

    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }

    setSource(audioCtx.createMediaStreamSource(recorderState.mediaStream));
  }, [recorderState.mediaStream]);

  useEffect(() => {
    if (!source) return;

    source.connect(analyserNode);

    return () => {
      source.disconnect(analyserNode);
    };
  }, [source]);

  useEffect(() => {
    if (!speechState.subThemes.length) return;
    if (currSubTheme?.text === "???????????? ???????????? ????????????.") return;

    if (!currSubTheme) {
      return setCurrSubTheme({
        ...speechState.subThemes[0],
        index: 0,
      });
    }

    if (
      recorderState.recordingMin ===
        speechState.subThemes[currSubTheme.index].min &&
      recorderState.recordingSec ===
        speechState.subThemes[currSubTheme.index].sec
    ) {
      setCurrSubTheme((prev) => {
        return speechState.subThemes[currSubTheme.index + 1]
          ? {
              ...speechState.subThemes[currSubTheme.index + 1],
              index: currSubTheme.index + 1,
            }
          : {
              ...prev,
              text: "???????????? ???????????? ????????????.",
            };
      });
    }
  }, [recorderState.recordingMin, recorderState.recordingSec]);

  return (
    <StepFourBox>
      <h1>{speechState.title}</h1>
      <TimeBox>
        <span>{`${formatMin(recorderState.recordingMin)} : ${formatSec(
          recorderState.recordingSec,
        )} / ${formatMin(recorderState.maxRecordingMin)} : ${formatSec(
          recorderState.maxRecordingSec,
        )}`}</span>
      </TimeBox>
      <FlashCard>
        {speechState.subThemes.length ? (
          <span>{currSubTheme?.text}</span>
        ) : (
          <span>???????????? ???????????? ????????????.</span>
        )}
      </FlashCard>
      <Keyboard
        selectedNote={speechState.speechTone.note}
        currentNote={currentNote}
      />
      <ButtonBox>
        {!recorderState.initRecording && (
          <ButtonLarge
            text="?????? ??????"
            onClick={() => {
              setOnAnalyse(true);
              recorderHandlers.startRecording();
            }}
          />
        )}
        {recorderState.mediaRecorder?.state === "recording" && (
          <ButtonLarge
            text="?????? ??????"
            onClick={() => {
              setOnAnalyse(false);
              recorderHandlers.pauseRecording();
            }}
          />
        )}
        {recorderState.mediaRecorder?.state === "paused" && (
          <ButtonLarge
            text="?????? ??????"
            onClick={() => {
              setOnAnalyse(true);
              recorderHandlers.resumeRecording();
            }}
            disabled={
              recorderState.recordingMin === recorderState.maxRecordingMin &&
              recorderState.recordingSec === recorderState.maxRecordingSec
            }
          />
        )}
        <ButtonLarge
          text="?????? ??? ????????????"
          onClick={toReview}
          disabled={onAnalyse}
        />
      </ButtonBox>
    </StepFourBox>
  );
}

StepFour.propTypes = {
  speechState: propTypes.object,
  speechHandlers: propTypes.object,
  recorderState: propTypes.object,
  recorderHandlers: propTypes.object,
};

export default StepFour;
