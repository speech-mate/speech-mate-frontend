import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import propTypes from "prop-types";

import NavBar from "../../components/Navbar/NavBar";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";

import { STEP } from "../../constants/newPractice";
import { NewPracticeLayout } from "./NewPracticeStyles";
import useMic from "../../hooks/useMic";

function NewPractice({ recorderState, handlers }) {
  const [step, setStep] = useState(STEP.ONE);
  const [selectedNote, setSelectedNote] = useState("");
  const [userPitch, setUserPitch] = useState(null);
  const [theme, setTheme] = useState("");
  const [subThemes, setSubThemes] = useState([]);
  const { micState, ...micHandlers } = useMic();
  const navigate = useNavigate();

  function toMainPage() {
    navigate("/");
  }

  function toPrevStep() {
    if (step === STEP.TWO) {
      if (micState.initMic) {
        micHandlers.cancelMic();
      }
      setStep(STEP.ONE);
    }

    if (step === STEP.THREE) {
      setStep(STEP.TWO);
    }

    if (step === STEP.FOUR) {
      if (recorderState.initRecording) {
        handlers.saveRecording();
      }
      setStep(STEP.THREE);
    }
  }

  function onStepOneSelection(e) {
    const selectedNote = e.target.dataset.note;
    setSelectedNote(selectedNote);
    setStep(STEP.TWO);
  }

  function onStepTwoSelection() {
    setStep(STEP.THREE);
  }

  return (
    <NewPracticeLayout>
      <NavBar onReturnBtnClick={step === STEP.ONE ? toMainPage : toPrevStep} />
      {step === STEP.ONE && <StepOne onStepOneSelection={onStepOneSelection} />}
      {step === STEP.TWO && (
        <StepTwo
          onStepTwoSelection={onStepTwoSelection}
          setUserPitch={setUserPitch}
          userPitch={userPitch}
          micState={micState}
          micHandlers={micHandlers}
        />
      )}
      {step === STEP.THREE && (
        <StepThree
          theme={theme}
          subThemes={subThemes}
          setSubThemes={setSubThemes}
          setTheme={setTheme}
          setStep={setStep}
          recorderState={recorderState}
          handlers={handlers}
        />
      )}
      {step === STEP.FOUR && (
        <StepFour
          theme={theme}
          selectedNote={selectedNote}
          userPitch={userPitch}
          subThemes={subThemes}
          recorderState={recorderState}
          handlers={handlers}
        />
      )}
    </NewPracticeLayout>
  );
}

NewPractice.propTypes = {
  recorderState: propTypes.object,
  handlers: propTypes.object,
};

export default NewPractice;
