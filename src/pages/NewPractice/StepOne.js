import React from "react";
import { nanoid } from "nanoid";
import propTypes from "prop-types";

import ButtonLarge from "../../components/Button/ButtonLarge";
import { TEXT_CONTENTS, SELECTIONS } from "../../constants/newPractice";
import { StepOneBox, SelectToneBox } from "./NewPracticeStyles";

function StepOne({ toNextStep }) {
  return (
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
              onClick={toNextStep}
            />
          );
        })}
      </SelectToneBox>
    </StepOneBox>
  );
}

StepOne.propTypes = {
  toNextStep: propTypes.func,
};

export default StepOne;
