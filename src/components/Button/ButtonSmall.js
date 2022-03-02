import React from "react";
import styled from "styled-components";
import propTypes from "prop-types";

function ButtonSmall({ size, text, onClick }) {
  return (
    <SmallButton size={size} onClick={onClick}>
      {text}
    </SmallButton>
  );
}

const SmallButton = styled.button`
  width: ${(props) => props.size.width};
  height: ${(props) => props.size.height};
  border: none;
  border-radius: 4px;
  background-color: var(--maximum-blue-purple-color);
  color: white;
  font-size: 16px;
`;

ButtonSmall.propTypes = {
  size: propTypes.object,
  text: propTypes.string,
  onClick: propTypes.func,
};

export default ButtonSmall;
