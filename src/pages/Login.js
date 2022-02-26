import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

import Logo from "../components/Logo";

import useAuth from "../hooks/useAuth";
import useKapi from "../hooks/useKapi";
import { userLogin } from "../api/auth";

const VERIFY_USERINFO_URL = "/v2/user/me";
const REVOKE_AUTH_URL = "/v1/user/unlink";

function Login() {
  const [error, setError] = useState("");
  const { setAuth } = useAuth();
  const kapi = useKapi();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (!kapi) return;

    kapi.Auth.createLoginButton({
      container: "#kakao-login-btn",
      scope: "profile_nickname, profile_image, account_email",
      persistAccessToken: false,
      success: responseKakao,
      fail: () => {
        setError("로그인 실패. 잠시 후 다시 시도해 주세요.");
      },
    });

    function responseKakao() {
      kapi.API.request({
        url: VERIFY_USERINFO_URL,
        success: async (res) => {
          const kakaoAccount = res.kakao_account;

          if (kakaoAccount.email_needs_agreement) {
            kapi.API.request({
              url: REVOKE_AUTH_URL,
              success: function (response) {
                console.log(response);
              },
            });
            setError(
              "서비스 이용을 위하여 필수정보와 선택정보인 이메일을 모두 동의 해주세요.",
            );
            return;
          }

          try {
            const response = await userLogin(kakaoAccount);
            const {
              userInfo: { _id: id, nickname, email, photo, files },
              accessToken,
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
            navigate(from, { replace: true });
          } catch (error) {
            console.error(error);
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
  width: inherit;
  height: inherit;
  color: white;

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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -70%);
`;

const LoginButton = styled.div`
  position: relative;
  top: 45%;
  display: flex;
  justify-content: center;

  img {
    width: 330px;
  }
`;

export default Login;
