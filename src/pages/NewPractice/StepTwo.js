import React from "react";
import propTypes from "prop-types";

import ButtonLarge from "../../components/Button/ButtonLarge";
import Microphone from "../../components/Microphone/Microphone";
import Logo from "../../components/Logo/Logo";

import { TEXT_CONTENTS, SELECTIONS, STEP } from "../../constants/newPractice";
import { StepTwoBox, LogoBox } from "./NewPracticeStyles";

function StepTwo({
  onStepTwoSelection,
  isMicOn,
  setUserPitch,
  getUserPitch,
  userPitch,
}) {
  return (
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
        <ButtonLarge text={SELECTIONS.TWO[1]} onClick={onStepTwoSelection} />
      )}
    </StepTwoBox>
  );
}

StepTwo.propTypes = {
  onStepTwoSelection: propTypes.func,
  isMicOn: propTypes.bool,
  setUserPitch: propTypes.func,
  getUserPitch: propTypes.func,
  userPitch: propTypes.object,
};

export default StepTwo;
