import React from "react";
import styled from "styled-components";

function Indicator() {
  return <IndicatorLayout />;
}

const IndicatorLayout = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--magnolia-color);
  animation-name: animatedBlock;
  animation-duration: 2s;
  animation-iteration-count: infinite;

  @keyframes animatedBlock {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0.5;
    }

    100% {
      opacity: 0;
    }
  }
`;

export default Indicator;
