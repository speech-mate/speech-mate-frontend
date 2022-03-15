import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import propTypes from "prop-types";

import NavBar from "../../components/Navbar/NavBar";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";

import { NewPracticeLayout } from "./NewPracticeStyles";
import { STEP } from "../../constants/newPractice";

function NewPractice({
  recorderState,
  recorderHandlers,
  speechState,
  speechHandlers,
}) {
  const [step, setStep] = useState(STEP.ONE);
  const navigate = useNavigate();

  useEffect(() => {
    if (step !== STEP.ONE) return;

    recorderHandlers.resetRecording();
    speechHandlers.clearSpeech();
  }, [step]);

  function toPrevStep() {
    if (step === STEP.ONE) {
      speechHandlers.clearSpeech();
      return navigate("/");
    }

    if (step === STEP.TWO) {
      return setStep(STEP.ONE);
    }

    if (step === STEP.THREE) {
      recorderHandlers.setMaxRecordingTime(0, 0);
      speechHandlers.setSpeechState((prev) => {
        return {
          ...prev,
          title: "",
          subThemes: [],
        };
      });
      return setStep(STEP.TWO);
    }

    if (recorderState.initRecording) {
      recorderHandlers.cancelRecording();
    }

    return setStep(STEP.THREE);
  }

  function toNextStep(e) {
    if (step === STEP.ONE) {
      const note = e.target.dataset.note;
      const text = e.target.innerText;

      speechHandlers.setSpeechState((prev) => {
        return {
          ...prev,
          speechTone: {
            text,
            note,
          },
        };
      });
      return setStep(STEP.TWO);
    }

    if (step === STEP.TWO) {
      return setStep(STEP.THREE);
    }

    return setStep(STEP.FOUR);
  }

  return (
    <NewPracticeLayout>
      <NavBar onReturnBtnClick={toPrevStep} />
      {step === STEP.ONE && <StepOne toNextStep={toNextStep} />}
      {step === STEP.TWO && (
        <StepTwo
          toNextStep={toNextStep}
          speechState={speechState}
          speechHandlers={speechHandlers}
        />
      )}
      {step === STEP.THREE && (
        <StepThree
          speechState={speechState}
          speechHandlers={speechHandlers}
          recorderState={recorderState}
          recorderHandlers={recorderHandlers}
          toNextStep={toNextStep}
        />
      )}
      {step === STEP.FOUR && (
        <StepFour
          speechState={speechState}
          speechHandlers={speechHandlers}
          recorderState={recorderState}
          recorderHandlers={recorderHandlers}
        />
      )}
    </NewPracticeLayout>
  );
}

NewPractice.propTypes = {
  recorderState: propTypes.object,
  recorderHandlers: propTypes.object,
  speechState: propTypes.object,
  speechHandlers: propTypes.object,
};

export default NewPractice;
