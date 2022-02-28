import React, { useEffect, useRef } from "react";
import propTypes from "prop-types";
import styled from "styled-components";
import { useUserAudio } from "../../hooks/useUserAudio";

function Microphone({ setUserPitch }) {
  const audioStream = useUserAudio();

  useEffect(() => {
    if (!audioStream) return;
    // stream handle logic

    return () => {
      setUserPitch("test");
    };
  });

  if (!audioStream) {
    return null;
  }

  return <MicrophoneLayout>Microphone</MicrophoneLayout>;
}

const MicrophoneLayout = styled.div`
  position: absolute;
`;

Microphone.propTypes = {
  setUserPitch: propTypes.func,
};

export default Microphone;
