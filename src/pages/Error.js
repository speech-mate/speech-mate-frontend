import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import propTypes from "prop-types";

import Logo from "../components/Logo";
import ButtonLarge from "../components/ButtonLarge";

function Error({ error }) {
  const navigate = useNavigate();

  return (
    <ErrorLayout>
      <LogoBox>
        <Logo
          size={{
            width: "350px",
            height: "270px",
            font: "30px",
            weight: "normal",
          }}
          text={`${error.code} ${error.message}`}
        />
      </LogoBox>
      <ButtonLarge
        text="메인 페이지로"
        onClick={() => {
          navigate("/");
        }}
      />
    </ErrorLayout>
  );
}

const ErrorLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: inherit;
  height: inherit;
  color: white;

  button {
    position: absolute;
    bottom: 10%;
  }
`;

const LogoBox = styled.div`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -70%);
`;

Error.propTypes = {
  error: propTypes.object.isRequired,
};

export default Error;
