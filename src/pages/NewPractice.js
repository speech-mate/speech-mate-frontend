import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { nanoid } from "nanoid";

import NavBar from "../components/Navbar/NavBar";
import ButtonLarge from "../components/Button/ButtonLarge";
import ButtonSmall from "../components/Button/ButtonSmall";
import Logo from "../components/Logo/Logo";

import { STEP, TEXT_CONTENTS, SELECTIONS } from "../constants/newPractice";
import Microphone from "../components/Microphone/Microphone";

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

function NewPractice() {
  const [step, setStep] = useState(STEP.ONE);
  const [selectedNote, setSelectedNote] = useState("");
  const [isMicOn, setIsMicOn] = useState(false);
  const [userPitch, setUserPitch] = useState(null);
  const [isValid, setIsValid] = useState(initialValidationState);
  const [speechTime, setSpeechTime] = useState(0);
  const [theme, setTheme] = useState("");
  const [subThemes, setSubThemes] = useState([]);
  const navigate = useNavigate();

  const speechMinRef = useRef();
  const speechSecRef = useRef();
  const speechThemeRef = useRef();
  const subThemeMinRef = useRef();
  const subThemeSecRef = useRef();
  const subThemeTextRef = useRef();

  function toMainPage() {
    navigate("/");
  }

  function toPrevStep() {
    if (step === STEP.TWO) {
      setStep(STEP.ONE);
    }

    if (step === STEP.THREE) {
      setStep(STEP.TWO);
    }

    if (step === STEP.FOUR) {
      setStep(STEP.THREE);
    }
  }

  function onStepOneSelection(e) {
    const selectedNote = e.target.dataset.note;
    setSelectedNote(selectedNote);
    setStep(STEP.TWO);
  }

  function getUserPitch() {
    setIsMicOn(true);
  }

  function onStepTwoSelection() {
    setStep(STEP.THREE);
  }

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
      setSpeechTime(
        Number(speechMinRef.current.value) * 60 +
          Number(speechSecRef.current.value),
      );
      setTheme(speechThemeRef.current.value);
      setStep(STEP.FOUR);
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

    const convertedSpeechTime =
      Number(speechMinRef.current.value) * 60 +
      Number(speechSecRef.current.value);
    const convertedSubThemeTime =
      Number(subThemeMinRef.current.value) * 60 +
      Number(subThemeSecRef.current.value);

    if (convertedSubThemeTime > convertedSpeechTime) {
      return setIsValid({
        ...initialValidationState,
        subThemeTime: false,
      });
    }

    if (
      subThemes.length &&
      subThemes.find((subTheme) => subTheme.time === convertedSubThemeTime)
    ) {
      return setIsValid({
        ...initialValidationState,
        uniqueSubThemeTime: false,
      });
    }

    const sortedSubThemes = [
      ...subThemes,
      { time: convertedSubThemeTime, text: subThemeTextRef.current.value },
    ].sort((a, b) => a.time - b.time);

    setSubThemes(sortedSubThemes);
    setIsValid({ ...initialValidationState });
    subThemeMinRef.current.value = "";
    subThemeSecRef.current.value = "";
    subThemeTextRef.current.value = "";
  }

  useEffect(() => {
    if (!userPitch) return;

    console.log(userPitch);
    console.log(speechTime);
    setIsMicOn(false);
  }, [userPitch]);

  return (
    <NewPracticeLayout>
      <NavBar onReturnBtnClick={step === STEP.ONE ? toMainPage : toPrevStep} />
      {step === STEP.ONE && (
        <StepOneBox>
          <h3>{TEXT_CONTENTS.ONE.TITLE}</h3>
          <p>{TEXT_CONTENTS.ONE.INSTRUCTION}</p>
          <SelectToneBox>
            {SELECTIONS.ONE.map((selection) => {
              const { TEXT, NOTE } = selection;
              const key = nanoid();

              return (
                <ButtonLarge
                  key={key}
                  text={TEXT}
                  note={NOTE}
                  onClick={onStepOneSelection}
                />
              );
            })}
          </SelectToneBox>
        </StepOneBox>
      )}
      {step === STEP.TWO && (
        <StepTwoBox>
          <p>{TEXT_CONTENTS.TWO.INSTRUCTION}</p>
          <LogoBox>
            <Logo />
          </LogoBox>
          {isMicOn && (
            <Microphone time={5} setUserPitch={setUserPitch} mode={STEP.TWO} />
          )}
          {!userPitch ? (
            <ButtonLarge
              text={SELECTIONS.TWO[0]}
              onClick={getUserPitch}
              disabled={isMicOn}
            />
          ) : (
            <ButtonLarge
              text={SELECTIONS.TWO[1]}
              onClick={onStepTwoSelection}
            />
          )}
        </StepTwoBox>
      )}
      {step === STEP.THREE && (
        <StepThreeBox>
          <label>
            스피치 시간을 입력해 주세요
            <SpeechTimeBox>
              <input
                type="number"
                defaultValue={speechTime > 0 && Math.floor(speechTime / 60)}
                ref={speechMinRef}
              />
              <span>분</span>
              <input
                type="number"
                defaultValue={speechTime > 0 && speechTime % 60}
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
              <input type="text" defaultValue={theme} ref={speechThemeRef} />
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
          {!!subThemes.length && (
            <SubThemeList>
              {subThemes.map((subTheme) => {
                const key = nanoid();

                return (
                  <li key={key}>
                    <span>{`${Math.floor(subTheme.time / 60)}분 ${
                      subTheme.time % 60
                    }초`}</span>
                    <span>{subTheme.text}</span>
                  </li>
                );
              })}
            </SubThemeList>
          )}
          <ButtonLarge text="녹음 시작" onClick={onStepThreeSelection} />
        </StepThreeBox>
      )}
      {step === STEP.FOUR && <StepFourBox>this is step four</StepFourBox>}
    </NewPracticeLayout>
  );
}

const NewPracticeLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: inherit;
`;

const StepOneBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: inherit;
  height: inherit;

  h3 {
    font-size: 25px;
    position: relative;
    top: 5%;
  }

  p {
    position: relative;
    top: 10%;
    width: 88%;
    font-size: 21px;
    line-height: 135%;
    text-align: left;
  }
`;

const SelectToneBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  top: 12%;
  width: inherit;

  button {
    margin-top: 35px;
  }
`;

const StepTwoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: inherit;
  height: inherit;

  p {
    position: relative;
    top: 10%;
    width: 83%;
    font-size: 21px;
    line-height: 140%;
    text-align: left;
  }

  span {
    position: relative;
    font-size: 40px;
    font-weight: 600;
    top: 15%;
  }

  button {
    position: relative;
    top: 31.8%;
  }

  button:disabled {
    background-color: var(--ice-grey-color);
    color: var(--dark-grey-blue-color);
  }
`;

const LogoBox = styled.div`
  position: relative;
  top: 15%;
`;

const StepThreeBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: inherit;
  height: inherit;

  label {
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 88%;
    margin-top: 20px;
    font-size: 21px;

    div {
      margin: 10px 0px;

      input {
        height: 35px;
        font-size: 20px;
        border: none;
        border-radius: 4px;
      }

      div {
        margin: 0;
      }
    }
  }

  button {
    position: absolute;
    bottom: 11%;
  }
`;

const ValidationMessage = styled.span`
  display: ${(props) => props.validation && "none"};
  position: relative;
  margin-top: 5px;
`;

const SpeechTimeBox = styled.div`
  display: flex;
  align-items: center;

  input {
    width: 30px;
    margin: 0px 5px;
    text-align: center;
  }
`;

const ThemeBox = styled.div`
  width: 100%;

  input {
    width: 100%;
  }
`;

const SubThemeBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  #subThemeMin,
  #subThemeSec {
    width: 30px;
    margin-right: 5px;
    text-align: center;
  }

  span {
    margin-right: 5px;
  }

  div {
    display: flex;
    align-items: center;
    width: 70%;
    border-radius: 4px;
    background-color: white;

    input {
      width: 75%;
      border: none;
    }

    button {
      position: relative;
      margin-right: 5px;
    }
  }
`;

const SubThemeList = styled.ul`
  width: 88%;
  height: 35%;
  overflow-y: auto;

  ::-webkit-scrollbar {
    display: none;
  }

  li {
    width: 100%;
    border-bottom: 1px solid white;
    margin-top: 25px;

    span {
      display: inline-block;
      height: 35px;
      font-size: 21px;
      text-align: center;

      &:nth-child(1) {
        width: 30%;
      }

      &:nth-child(2) {
        width: 70%;
      }
    }
  }
`;

const StepFourBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: inherit;
  height: inherit;
`;

export default NewPractice;
