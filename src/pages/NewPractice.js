import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { nanoid } from "nanoid";

import NavBar from "../components/Navbar/NavBar";
import ButtonLarge from "../components/Button/ButtonLarge";
import Logo from "../components/Logo/Logo";

import { STEP, TEXT_CONTENTS, SELECTIONS } from "../constants/newPractice";
import { detectPitch } from "../api/voice";
import Microphone from "../components/Microphone/Microphone";

function NewPractice() {
  const [step, setStep] = useState(STEP.ONE);
  const [selectedNode, setSelectedNode] = useState("");
  const [count, setCount] = useState(5);
  const [isMicOn, setIsMicOn] = useState(false);
  const [userPitch, setUserPitch] = useState("");
  const navigate = useNavigate();

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
  }

  function onStepOneSelection(e) {
    const selectedNode = e.target.dataset.node;
    setSelectedNode(selectedNode);
    setStep(STEP.TWO);
  }

  function getUserPitch() {
    setIsMicOn(true);

    setTimeout(() => {
      setIsMicOn(false);
    }, 5000);
  }

  function onStepTwoSelection() {
    setStep(STEP.THREE);
  }

  return (
    <NewPracticeLayout>
      <NavBar onReturnBtnClick={step === STEP.ONE ? toMainPage : toPrevStep} />
      {step === STEP.ONE && (
        <StepOneBox>
          <h3>{TEXT_CONTENTS.ONE.TITLE}</h3>
          <p>{TEXT_CONTENTS.ONE.INSTRUCTION}</p>
          <SelectToneBox>
            {SELECTIONS.ONE.map((selection) => {
              const { TEXT, NODE } = selection;
              const key = nanoid();

              return (
                <ButtonLarge
                  key={key}
                  text={TEXT}
                  node={NODE}
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
          <span>{count}</span>
          {isMicOn && <Microphone setUserPitch={setUserPitch} />}
          {!userPitch ? (
            <ButtonLarge text={SELECTIONS.TWO[0]} onClick={getUserPitch} />
          ) : (
            <ButtonLarge
              text={SELECTIONS.TWO[1]}
              onClick={onStepTwoSelection}
            />
          )}
        </StepTwoBox>
      )}
      {step === STEP.THREE && <StepThreeBox>This is Step Three</StepThreeBox>}
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
    top: 26.2%;
  }
`;

const LogoBox = styled.div`
  position: relative;
  top: 15%;
`;

const StepThreeBox = styled.div``;

export default NewPractice;
