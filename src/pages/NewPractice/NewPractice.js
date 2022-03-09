import React, { useState } from "react";
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

function NewPractice({
  recorderState,
  recorderHandlers,
  speechState,
  speechHandlers,
}) {
  const [step, setStep] = useState(STEP.ONE);
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
        // recorderHandlers.saveRecording();
        recorderHandlers.cancelRecording();
      }
      setStep(STEP.THREE);
    }
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
      setStep(STEP.TWO);
    }

    if (step === STEP.TWO) {
      setStep(STEP.THREE);
    }

    if (step === STEP.THREE) {
      setStep(STEP.FOUR);
    }
  }

  return (
    <NewPracticeLayout>
      <NavBar onReturnBtnClick={step === STEP.ONE ? toMainPage : toPrevStep} />
      {step === STEP.ONE && <StepOne toNextStep={toNextStep} />}
      {step === STEP.TWO && (
        <StepTwo
          toNextStep={toNextStep}
          speechState={speechState}
          speechHandlers={speechHandlers}
          micState={micState}
          micHandlers={micHandlers}
        />
      )}
      {step === STEP.THREE && (
        <StepThree
          speechState={speechState}
          speechHandlers={speechHandlers}
          // setStep={setStep}
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
