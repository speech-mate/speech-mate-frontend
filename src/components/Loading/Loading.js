import React from "react";
import styled from "styled-components";

function Loading() {
  return (
    <LoadingLayout>
      <OuterBox>
        <InnerBox></InnerBox>
      </OuterBox>
    </LoadingLayout>
  );
}

const LoadingLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: auto;
`;

const OuterBox = styled.div`
  height: 100px;
  width: 100px;
  margin: auto;
  position: relative;
  top: 20px;
  border-radius: 50%;
  background-image: linear-gradient(
      150deg,
      transparent 50%,
      var(--maximum-blue-purple-color) 50%
    ),
    linear-gradient(
      90deg,
      var(--maximum-blue-purple-color) 50%,
      var(--magnolia-color) 50%
    );
  -webkit-animation: rotation 1200ms infinite linear;
  transform-origin: 50% 50%;
  animation-timing-function: ease;

  @keyframes rotation {
    from {
      -webkit-transform: rotate(270deg);
    }
    to {
      -webkit-transform: rotate(630deg);
    }
  }
`;

const InnerBox = styled.div`
  height: 76px;
  width: 76px;
  margin: auto;
  position: relative;
  top: 12px;
  border-radius: 50%;
  background: var(--independence-color);
`;

export default Loading;
