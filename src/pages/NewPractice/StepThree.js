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

  function filterSubThemes(subTheme) {
    speechHandlers.setSpeechState((prev) => {
      return {
        ...prev,
        subThemes: prev.subThemes.filter((el) => el.text !== subTheme.text),
      };
    });
  }

  return (
    <StepThreeBox>
      <label>
        ????????? ????????? ????????? ?????????
        <SpeechTimeBox>
          <input
            type="number"
            defaultValue={
              recorderState.maxRecordingMin > 0 && recorderState.maxRecordingMin
            }
            ref={speechMinRef}
          />
          <span>???</span>
          <input
            type="number"
            defaultValue={
              recorderState.maxRecordingMin > 0 && recorderState.maxRecordingSec
            }
            ref={speechSecRef}
          />
          <span>???</span>
        </SpeechTimeBox>
      </label>
      <ValidationMessage validation={isValid.speechTime}>
        ????????? ????????? ???, ??? ?????? ?????? ?????? ???????????????.
      </ValidationMessage>
      <ValidationMessage validation={isValid.speechLengthMin}>
        ????????? ????????? ?????? 1??? ??????????????? ?????????.
      </ValidationMessage>
      <ValidationMessage validation={isValid.speechLengthMax}>
        ????????? ????????? 10?????? ????????? ??? ????????????.
      </ValidationMessage>
      <label>
        ????????? ????????? ????????? ?????????
        <ThemeBox>
          <input
            type="text"
            defaultValue={speechState.title}
            ref={speechThemeRef}
          />
        </ThemeBox>
      </label>
      <ValidationMessage validation={isValid.speechTheme}>
        ????????? ????????? ?????? ?????? ???????????????.
      </ValidationMessage>
      <label>
        ????????? ???????????? ????????? ?????????
        <SubThemeBox>
          <>
            <input type="number" id="subThemeMin" ref={subThemeMinRef} />
            <span>???</span>
            <input type="number" id="subThemeSec" ref={subThemeSecRef} />
            <span>???</span>
            <div>
              <input type="text" id="subTheme" ref={subThemeTextRef} />
              <ButtonSmall
                size={{ width: "25%", height: "29px" }}
                text="??????"
                onClick={onSubThemeSubmit}
              />
            </div>
          </>
        </SubThemeBox>
      </label>
      <ValidationMessage validation={isValid.canSetSubTheme}>
        ????????? ????????? ????????? ?????? ????????? ?????????.
      </ValidationMessage>
      <ValidationMessage validation={isValid.subThemeTimeTextRequired}>
        ????????? ??????, ????????? ?????? ????????? ?????????.
      </ValidationMessage>
      <ValidationMessage validation={isValid.subThemeTime}>
        ????????? ?????? ????????? ????????? ????????? ????????? ??? ????????????.
      </ValidationMessage>
      <ValidationMessage validation={isValid.uniqueSubThemeTime}>
        ?????? ????????? ????????? ???????????? ?????? ???????????????.
      </ValidationMessage>
      {!!speechState.subThemes.length && (
        <SubThemeList>
          {speechState.subThemes.map((subTheme) => {
            const key = nanoid();

            return (
              <li key={key}>
                <span>{`${formatMin(subTheme.min)}??? ${formatSec(
                  subTheme.sec,
                )}???`}</span>
                <span>{subTheme.text}</span>
                <i
                  className="fa-solid fa-trash-can"
                  onClick={() => filterSubThemes(subTheme)}
                ></i>
              </li>
            );
          })}
        </SubThemeList>
      )}
      <ButtonLarge text="?????? ?????? ??????" onClick={onStepThreeSelection} />
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
