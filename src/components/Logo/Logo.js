import React from "react";
import styled from "styled-components";
import propTypes from "prop-types";

function Logo({ size, text }) {
  return (
    <LogoLayout size={size}>
      <img src="/images/logo.png" alt="스피치 메이트 로고" />
      <span>{text}</span>
    </LogoLayout>
  );
}

const LogoLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: ${(props) => props.size.width};
    height: ${(props) => props.size.height};
  }

  span {
    font-size: ${(props) => props.size.font};
    font-weight: ${(props) => props.size.weight};
  }
`;

Logo.defaultProps = {
  size: { width: "350px", height: "270px", font: "40px", weight: "bold" },
  text: "",
};

Logo.propTypes = {
  size: propTypes.object,
  text: propTypes.string,
};

export default Logo;
