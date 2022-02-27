import React from "react";
import styled from "styled-components";
import propTypes from "prop-types";

function ButtonLarge({ text, onClick }) {
  return <LargeButton onClick={onClick}>{text}</LargeButton>;
}

const LargeButton = styled.button`
  width: 90%;
  height: 65px;
  border: none;
  border-radius: 10px;
  background-color: var(--maximum-blue-purple-color);
  color: white;
  font-size: 20px;
`;

ButtonLarge.propTypes = {
  text: propTypes.string.isRequired,
  onClick: propTypes.func.isRequired,
};

export default ButtonLarge;
