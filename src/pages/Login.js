import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import propTypes from "prop-types";
import styled from "styled-components";

import Logo from "../components/Logo/Logo";

import useAuth from "../hooks/useAuth";
import useKapi from "../hooks/useKapi";
import { userLogin } from "../api/auth";
import { LOGIN_TEXT, LOGIN_URL, LOGIN_BTN } from "../constants/login";

const REFRESH_TOKEN = "jwt";

function Login({ setFiles }) {
  const [error, setError] = useState("");
  const { setAuth } = useAuth();
  const kapi = useKapi();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (!kapi) return;

    kapi.Auth.createLoginButton({
      container: LOGIN_BTN.CONTAINER,
      scope: LOGIN_BTN.SCOPE,
      success: responseKakao,
      fail: () => {
        setError(LOGIN_TEXT.LOGIN_FAILED);
      },
    });

    function responseKakao() {
      kapi.API.request({
        url: LOGIN_URL.VERIFY_USERINFO,
        success: async (res) => {
          const kakaoAccount = res.kakao_account;

          if (kakaoAccount.email_needs_agreement) {
            kapi.API.request({
              url: LOGIN_URL.REVOKE_AUTH,
            });
            setError(LOGIN_TEXT.REQUEST_ACCEPT_ALL);
            return;
          }

          try {
            const response = await userLogin(kakaoAccount);
            const {
              userInfo: { _id: id, nickname, email, photo, files },
              accessToken,
              refreshToken,
            } = response.data;
            setAuth({
              user: {
                id,
                nickname,
                email,
                photo,
              },
              accessToken,
            });
            localStorage.setItem(REFRESH_TOKEN, refreshToken);
            setFiles(files);
            navigate(from, { replace: true });
          } catch (error) {
            navigate("/error");
          }
        },
      });
    }
  }, [kapi]);

  return (
    <LoginLayout>
      <LogoBox>
        <Logo text={"Speech Mate"} />
      </LogoBox>
      {error && <p>{error}</p>}
      <LoginButton id="kakao-login-btn"></LoginButton>
    </LoginLayout>
  );
}

const LoginLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: inherit;

  p {
    position: absolute;
    bottom: 20%;
    width: 300px;
    text-align: center;
    line-height: 130%;
  }
`;

const LogoBox = styled.div`
  position: relative;
  top: 20%;
`;

const LoginButton = styled.div`
  position: relative;
  top: 48%;
  display: flex;
  justify-content: center;

  img {
    width: 330px;
  }
`;

Login.propTypes = {
  setFiles: propTypes.func,
};

export default Login;
