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
  const navigate = useNavigate();
  const location = useLocation();

  const audioCtx = getAudioContext();
  const analyserNode = getAnalyser();
  const bufferLength = 2048;
  const buffer = new Float32Array(bufferLength);

  console.log(speechState.pitchStatus);

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
    // const note = findClosestNote(fundamentalFrequency);

    // if (note && !pitchStatus[note.frequency]) {
    //   setPitchStatus((prev) => {
    //     return {
    //       ...prev,
    //       [note.frequency]: 1,
    //     };
    //   });
    // }

    // if (note && pitchStatus[note.frequency]) {
    //   setPitchStatus((prev) => {
    //     return {
    //       ...prev,
    //       [note.frequency]: prev[note.frequency] + 1,
    //     };
    //   });
    // }

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

    setCurrentNote(currentNote.note);
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
    if (onAnalyse || !Object.keys(pitchStatus).length) return;
    console.log(pitchStatus);

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
    if (currSubTheme?.text === "남아있는 소주제가 없습니다.") return;

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
              text: "남아있는 소주제가 없습니다.",
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
          <span>설정하신 소주제가 없습니다.</span>
        )}
      </FlashCard>
      <Keyboard
        selectedNote={speechState.speechTone.note}
        currentNote={currentNote}
      />
      <ButtonBox>
        {!recorderState.initRecording && (
          <ButtonLarge
            text="녹음 시작"
            onClick={() => {
              setOnAnalyse(true);
              recorderHandlers.startRecording();
            }}
          />
        )}
        {recorderState.mediaRecorder?.state === "recording" && (
          <ButtonLarge
            text="일시 정지"
            onClick={() => {
              setOnAnalyse(false);
              recorderHandlers.pauseRecording();
            }}
          />
        )}
        {recorderState.mediaRecorder?.state === "paused" && (
          <ButtonLarge
            text="녹음 재개"
            onClick={() => {
              setOnAnalyse(true);
              recorderHandlers.resumeRecording();
            }}
          />
        )}
        <ButtonLarge text="종료 및 리뷰하기" onClick={toReview} />
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
