import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

import Logo from "../components/Logo/Logo";
import ButtonLarge from "../components/Button/ButtonLarge";

function Error() {
  const navigate = useNavigate();
  const location = useLocation();
  const error = location?.state?.error;

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
          text={error ? `${error.code} ${error.message}` : "404 Not Found"}
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

export default Error;
