import React from "react";
import propTypes from "prop-types";
import styled from "styled-components";
import { nanoid } from "nanoid";

const NOTE = ["C", "D", "E", "F", "G"];
const HALF_NOTE = ["C#", "D#", "F#"];

function Keyboard({ selectedNote, currentNote }) {
  return (
    <KeyboardLayout>
      {NOTE.map((note) => {
        const key = nanoid();

        return (
          <KeyNote
            key={key}
            id={
              selectedNote === note
                ? "selected"
                : currentNote === note
                ? "current"
                : ""
            }
          >
            <span>{note}</span>
          </KeyNote>
        );
      })}
      {HALF_NOTE.map((note) => {
        const key = nanoid();
        return <HalfNote key={key} note={note} />;
      })}
    </KeyboardLayout>
  );
}

const KeyboardLayout = styled.div`
  display: flex;
  width: 80%;
  height: 25%;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 18px;

  #selected {
    background: var(--pale-lavender-color);
  }

  #current {
    background: var(--magnolia-color);
  }
`;

const KeyNote = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 20%;
  height: 100%;
  border: 1px solid var(--dark-grey-blue-color);
  background-color: white;

  span {
    display: inline-block;
    width: 100%;
    color: black;
    text-align: center;
    margin-bottom: 15px;
    font-size: 20px;
  }
`;

const HalfNote = styled.div`
  width: 12%;
  height: 50%;
  position: absolute;
  left: ${(props) => {
    if (props.note === HALF_NOTE[0]) return "14%";
    if (props.note === HALF_NOTE[1]) return "34%";
    return "74%";
  }};
  background-color: black;
`;

Keyboard.propTypes = {
  currentNote: propTypes.string,
  selectedNote: propTypes.string,
};

export default Keyboard;
