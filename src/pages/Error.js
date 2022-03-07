import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import propTypes from "prop-types";

import Logo from "../components/Logo/Logo";
import ButtonLarge from "../components/Button/ButtonLarge";

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
          text={
            error
              ? `${error.code} ${error.message}`
              : "⚠️ Error.. Please Try Later"
          }
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
  width: 100%;
  height: inherit;

  button {
    position: relative;
    top: 50.5%;
  }
`;

const LogoBox = styled.div`
  position: relative;
  top: 25%;
`;

Error.propTypes = {
  error: propTypes.object,
};

export default Error;
