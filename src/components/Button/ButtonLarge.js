import React from "react";
import styled from "styled-components";
import propTypes from "prop-types";

function ButtonLarge({ text, onClick, node, disabled }) {
  return (
    <LargeButton onClick={onClick} data-node={node} disabled={disabled}>
      {text}
    </LargeButton>
  );
}

const LargeButton = styled.button`
  width: 90%;
  height: 60px;
  border: none;
  border-radius: 10px;
  background-color: var(--maximum-blue-purple-color);
  color: white;
  font-size: 20px;
`;

ButtonLarge.propTypes = {
  text: propTypes.string.isRequired,
  onClick: propTypes.func.isRequired,
  node: propTypes.node,
  disabled: propTypes.bool,
};

export default ButtonLarge;
