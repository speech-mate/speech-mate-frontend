import React from "react";
import styled from "styled-components";
import Logo from "../components/Logo/Logo";

const LoginLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: inherit;
  height: inherit;
  color: white;
`;

const LogoBox = styled.div`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-55%, -70%);
`;

function Login() {
  return (
    <LoginLayout>
      <LogoBox>
        <Logo text={"Speech Mate"} />
      </LogoBox>
    </LoginLayout>
  );
}

export default Login;
