import React, { useRef, useState } from "react";
import { nanoid } from "nanoid";
import propTypes from "prop-types";

import ButtonLarge from "../../components/Button/ButtonLarge";
import ButtonSmall from "../../components/Button/ButtonSmall";

import {
  StepThreeBox,
  SpeechTimeBox,
  ValidationMessage,
  ThemeBox,
  SubThemeBox,
  SubThemeList,
} from "./NewPracticeStyles";
import { convertToSec, formatMin, formatSec } from "../../util/formatTime";

const initialValidationState = {
  speechTime: true,
  speechLengthMin: true,
  speechLengthMax: true,
  speechTheme: true,
  canSetSubTheme: true,
  subThemeTime: true,
  uniqueSubThemeTime: true,
  subThemeTimeTextRequired: true,
};

function StepThree({
  toNextStep,
  speechState,
  speechHandlers,
  recorderState,
  recorderHandlers,
}) {
  const [isValid, setIsValid] = useState(initialValidationState);
  const speechMinRef = useRef();
  const speechSecRef = useRef();
  const speechThemeRef = useRef();
  const subThemeMinRef = useRef();
  const subThemeSecRef = useRef();
  const subThemeTextRef = useRef();

  function onStepThreeSelection() {
    if (
      speechMinRef.current.value === "" ||
      speechSecRef.current.value === ""
    ) {
      return setIsValid({ ...initialValidationState, speechTime: false });
    }

    if (speechMinRef.current.value < 1 && speechSecRef.current.value < 60) {
      return setIsValid({ ...initialValidationState, speechLengthMin: false });
    }

    if (speechMinRef.current.value > 10 && speechSecRef.current.value > 0) {
      return setIsValid({ ...initialValidationState, speechLengthMax: false });
    }

    if (!speechThemeRef.current.value) {
      return setIsValid({ ...initialValidationState, speechTheme: false });
    }

    setIsValid(initialValidationState);
    const trueIndex = 1;

    if (Object.entries(isValid).every((entry) => entry[trueIndex])) {
      recorderHandlers.setMaxRecordingTime(
        Number(speechMinRef.current.value),
        Number(speechSecRef.current.value),
      );
      speechHandlers.setSpeechState((prev) => {
        return {
          ...prev,
          title: speechThemeRef.current.value,
        };
      });

      toNextStep();
    }
  }

  function onSubThemeSubmit() {
    if (
      speechMinRef.current.value === "" ||
      speechSecRef.current.value === ""
    ) {
      return setIsValid({
        ...initialValidationState,
        speechTime: false,
        canSetSubTheme: false,
      });
    }

    if (speechMinRef.current.value < 1 && speechSecRef.current.value < 60) {
      return setIsValid({
        ...initialValidationState,
        speechLengthMin: false,
        canSetSubTheme: false,
      });
    }

    if (speechMinRef.current.value > 10 && speechSecRef.current.value > 0) {
      return setIsValid({
        ...initialValidationState,
        speechLengthMax: false,
        canSetSubTheme: false,
      });
    }

    if (
      subThemeMinRef.current.value === "" ||
      subThemeSecRef.current.value === "" ||
      subThemeTextRef.current.value === ""
    ) {
      return setIsValid({
        ...initialValidationState,
        subThemeTimeTextRequired: false,
      });
    }

    const convertedSpeechTime = convertToSec(
      Number(speechMinRef.current.value),
      Number(speechSecRef.current.value),
    );
    const convertedSubThemeTime = convertToSec(
      Number(subThemeMinRef.current.value),
      Number(subThemeSecRef.current.value),
    );

    if (convertedSubThemeTime > convertedSpeechTime) {
      return setIsValid({
        ...initialValidationState,
        subThemeTime: false,
      });
    }

    if (
      speechState.subThemes.length &&
      speechState.subThemes.find(
        (subTheme) =>
          convertToSec(subTheme.min, subTheme.sec) === convertedSubThemeTime,
      )
    ) {
      return setIsValid({
        ...initialValidationState,
        uniqueSubThemeTime: false,
      });
    }

    const sortedSubThemes = [
      ...speechState.subThemes,
      {
        min: Number(subThemeMinRef.current.value),
        sec: Number(subThemeSecRef.current.value),
        text: subThemeTextRef.current.value,
        isAchieved: false,
      },
    ].sort((a, b) => convertToSec(a.min, a.sec) - convertToSec(b.min, b.sec));

    speechHandlers.setSpeechState((prev) => {
      return {
        ...prev,
        subThemes: sortedSubThemes,
      };
    });
    setIsValid({ ...initialValidationState });
    subThemeMinRef.current.value = "";
    subThemeSecRef.current.value = "";
    subThemeTextRef.current.value = "";
  }

  return (
    <StepThreeBox>
      <label>
        스피치 시간을 입력해 주세요
        <SpeechTimeBox>
          <input
            type="number"
            defaultValue={
              recorderState.maxRecordingMin > 0 && recorderState.maxRecordingMin
            }
            ref={speechMinRef}
          />
          <span>분</span>
          <input
            type="number"
            defaultValue={
              recorderState.maxRecordingMin > 0 && recorderState.maxRecordingSec
            }
            ref={speechSecRef}
          />
          <span>초</span>
        </SpeechTimeBox>
      </label>
      <ValidationMessage validation={isValid.speechTime}>
        스피치 시간은 분, 초 모두 필수 입력 사항입니다.
      </ValidationMessage>
      <ValidationMessage validation={isValid.speechLengthMin}>
        스피치 시간은 최소 1분 이상이여야 합니다.
      </ValidationMessage>
      <ValidationMessage validation={isValid.speechLengthMax}>
        스피치 시간은 10분을 초과할 수 없습니다.
      </ValidationMessage>
      <label>
        스피치 주제를 입력해 주세요
        <ThemeBox>
          <input
            type="text"
            defaultValue={speechState.title}
            ref={speechThemeRef}
          />
        </ThemeBox>
      </label>
      <ValidationMessage validation={isValid.speechTheme}>
        스피치 주제는 필수 입력 사항입니다.
      </ValidationMessage>
      <label>
        스피치 소주제를 입력해 주세요
        <SubThemeBox>
          <>
            <input type="number" id="subThemeMin" ref={subThemeMinRef} />
            <span>분</span>
            <input type="number" id="subThemeSec" ref={subThemeSecRef} />
            <span>초</span>
            <div>
              <input type="text" id="subTheme" ref={subThemeTextRef} />
              <ButtonSmall
                size={{ width: "25%", height: "29px" }}
                text="추가"
                onClick={onSubThemeSubmit}
              />
            </div>
          </>
        </SubThemeBox>
      </label>
      <ValidationMessage validation={isValid.canSetSubTheme}>
        유효한 스피치 시간을 먼저 입력해 주세요.
      </ValidationMessage>
      <ValidationMessage validation={isValid.subThemeTimeTextRequired}>
        소주제 시간, 텍스트 모두 입력해 주세요.
      </ValidationMessage>
      <ValidationMessage validation={isValid.subThemeTime}>
        소주제 입력 시간은 스피치 시간을 초과할 수 없습니다.
      </ValidationMessage>
      <ValidationMessage validation={isValid.uniqueSubThemeTime}>
        해당 시간에 입력된 소주제가 이미 존재합니다.
      </ValidationMessage>
      {!!speechState.subThemes.length && (
        <SubThemeList>
          {speechState.subThemes.map((subTheme) => {
            const key = nanoid();

            return (
              <li key={key}>
                <span>{`${formatMin(subTheme.min)}분 ${formatSec(
                  subTheme.sec,
                )}초`}</span>
                <span>{subTheme.text}</span>
              </li>
            );
          })}
        </SubThemeList>
      )}
      <ButtonLarge text="녹음 하러 가기" onClick={onStepThreeSelection} />
    </StepThreeBox>
  );
}

StepThree.propTypes = {
  speechState: propTypes.object,
  speechHandlers: propTypes.object,
  toNextStep: propTypes.func,
  recorderState: propTypes.object,
  recorderHandlers: propTypes.object,
};

export default StepThree;
