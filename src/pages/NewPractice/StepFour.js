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

function StepFour({
  theme,
  selectedNote,
  userPitch,
  subThemes,
  recorderState,
  handlers,
}) {
  const [currSubTheme, setCurrSubTheme] = useState(null);
  const navigate = useNavigate();

  function toReview() {
    handlers.saveRecording();
    navigate("/practice/review");
  }

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
          <ButtonLarge text="녹음 시작" onClick={handlers.startRecording} />
        )}
        {recorderState.mediaRecorder?.state === "recording" && (
          <ButtonLarge text="일시 정지" onClick={handlers.pauseRecording} />
        )}
        {recorderState.mediaRecorder?.state === "paused" && (
          <ButtonLarge text="녹음 재개" onClick={handlers.resumeRecording} />
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
