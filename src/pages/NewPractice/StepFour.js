import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { findClosestNote2 } from "../../util/helpers";

function StepFour({
  theme,
  selectedNote,
  userPitch,
  subThemes,
  recorderState,
  handlers,
}) {
  const [source, setSource] = useState(null);
  const [currSubTheme, setCurrSubTheme] = useState(null);
  const [onAnalyse, setOnAnalyse] = useState(false);
  const [pitches, setPitches] = useState([]);
  const [pitchStatus, setPitchStatus] = useState({});
  const navigate = useNavigate();

  const audioCtx = getAudioContext();
  const analyserNode = getAnalyser();
  const bufferLength = 2048;
  const buffer = new Float32Array(bufferLength);

  function toReview() {
    handlers.saveRecording();
    navigate("/practice/review");
  }

  function recordPitch() {
    analyserNode.getFloatTimeDomainData(buffer);
    const fundamentalFrequency = autoCorrelate(buffer, audioCtx.sampleRate);
    if (!fundamentalFrequency) return;
    const note = findClosestNote2(fundamentalFrequency);
    const noteKey = `${note?.octave}${note?.note}`;

    if (note && !pitchStatus[noteKey]) {
      setPitchStatus((prev) => {
        return {
          ...prev,
          [noteKey]: 1,
        };
      });
    }

    if (note && pitchStatus[noteKey]) {
      setPitchStatus((prev) => {
        return {
          ...prev,
          [noteKey]: prev[noteKey] + 1,
        };
      });
    }
    setPitches([...pitches, fundamentalFrequency]);
  }

  useInterval(recordPitch, onAnalyse ? 1 : null);

  useEffect(() => {
    if (
      recorderState.recordingMin !== recorderState.maxRecordingMin &&
      recorderState.recordingSec !== recorderState.maxRecordingSec
    )
      return;

    setOnAnalyse(false);
  }, [recorderState.recordingMin, recorderState.recordingSec]);

  useEffect(() => {
    if (!pitches.length) return;

    console.log(pitches);
    console.log(pitchStatus);

    // speech ton analyse logic needed using pitch detection algorithm
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
    if (!subThemes.length) return;
    if (currSubTheme?.text === "남아있는 소주제가 없습니다.") return;

    if (!currSubTheme) {
      return setCurrSubTheme({
        ...subThemes[0],
        index: 0,
      });
    }

    if (
      recorderState.recordingMin === subThemes[currSubTheme.index].min &&
      recorderState.recordingSec === subThemes[currSubTheme.index].sec
    ) {
      setCurrSubTheme((prev) => {
        return subThemes[currSubTheme.index + 1]
          ? {
              ...subThemes[currSubTheme.index + 1],
              index: currSubTheme.index + 1,
            }
          : {
              ...prev,
              text: "남아있는 소주제가 없습니다.",
            };
      });
    }
  }, [recorderState.recordingMin, recorderState.recordingSec]);

  return (
    <StepFourBox>
      <h1>{theme}</h1>
      <TimeBox>
        <span>{`${formatMin(recorderState.recordingMin)} : ${formatSec(
          recorderState.recordingSec,
        )} / ${formatMin(recorderState.maxRecordingMin)} : ${formatSec(
          recorderState.maxRecordingSec,
        )}`}</span>
      </TimeBox>
      <FlashCard>
        {subThemes.length ? (
          <span>{currSubTheme?.text}</span>
        ) : (
          <span>설정하신 소주제가 없습니다.</span>
        )}
      </FlashCard>
      <Keyboard selectedNote={selectedNote} />
      <ButtonBox>
        {!recorderState.initRecording && (
          <ButtonLarge
            text="녹음 시작"
            onClick={() => {
              setOnAnalyse(true);
              handlers.startRecording();
            }}
          />
        )}
        {recorderState.mediaRecorder?.state === "recording" && (
          <ButtonLarge
            text="일시 정지"
            onClick={() => {
              setOnAnalyse(false);
              handlers.pauseRecording();
            }}
          />
        )}
        {recorderState.mediaRecorder?.state === "paused" && (
          <ButtonLarge
            text="녹음 재개"
            onClick={() => {
              setOnAnalyse(true);
              handlers.resumeRecording();
            }}
          />
        )}
        <ButtonLarge text="종료 및 리뷰하기" onClick={toReview} />
      </ButtonBox>
    </StepFourBox>
  );
}

StepFour.propTypes = {
  theme: propTypes.string,
  selectedNote: propTypes.string,
  userPitch: propTypes.object,
  subThemes: propTypes.array,
  recorderState: propTypes.object,
  handlers: propTypes.object,
};

export default StepFour;
