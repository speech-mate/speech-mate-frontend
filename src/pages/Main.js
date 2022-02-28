import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Logo from "../components/Logo/Logo";
import ButtonLarge from "../components/Button/ButtonLarge";

import useAuth from "../hooks/useAuth";
import useKapi from "../hooks/useKapi";

const REVOKE_AUTH_URL = "/v1/user/unlink";

function Main() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const kapi = useKapi();

  function totNewPractice() {
    navigate("/practice/new");
  }

  function toSavedPractice() {
    navigate("/practice/files");
  }

  function logout() {
    kapi.API.request({
      url: REVOKE_AUTH_URL,
      success: () => {
        setAuth({});
        localStorage.clear();
      },
      fail: (err) => {
        console.error(err);
      },
    });
  }

  return (
    <MainLayout>
      <MainHeader>
        <LogoBox>
          <Logo size={{ width: "45px", height: "35px" }} />
          <h1>Speech Mate</h1>
        </LogoBox>
        <i className="fa-solid fa-right-from-bracket" onClick={logout}></i>
      </MainHeader>
      <ProfileBox>
        <img src={auth.user.photo} />
        <h2>{`${auth.user.nickname}님 안녕하세요!`}</h2>
      </ProfileBox>
      <ButtonBox>
        <ButtonLarge text="스피치 연습 시작하기" onClick={totNewPractice} />
        <ButtonLarge text="저장된 연습 보러가기" onClick={toSavedPractice} />
      </ButtonBox>
    </MainLayout>
  );
}

const MainLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: inherit;
`;

const MainHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: inherit;
  height: 70px;

  i {
    margin-right: 20px;
    font-size: 25px;
  }
`;

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;

  h1 {
    margin-left: 5px;
    font-size: 23px;
    font-weight: bold;
  }
`;

const ProfileBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  top: 30%;

  img {
    border-radius: 50%;
    margin-bottom: 15px;
    width: 110px;
  }

  h2 {
    font-size: 23px;
  }
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  top: 50.5%;
  width: inherit;

  button {
    &:nth-child(2) {
      margin-top: 20px;
    }
  }
`;

export default Main;
