import React, { useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import propTypes from "prop-types";

import NavBar from "../../components/Navbar/NavBar";
import ButtonLarge from "../../components/Button/ButtonLarge";
import ButtonSmall from "../../components/Button/ButtonSmall";
import Keyboard from "../../components/Keyboard/Keyboard";
import Modal from "../../components/Modal/Modal";
import useAuth from "../../hooks/useAuth";

import axios from "../../api/axios";
import { formatMin, formatSec } from "../../util/formatTime";

function Review({
  files,
  setFiles,
  recorderState,
  recorderHandlers,
  speechState,
  speechHandlers,
}) {
  const [onModal, setOnModal] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;
  const { title, speechTone, subThemes } = speechState;

  function onReturnBtnClick() {
    if (recorderState.audio && !isSaved) {
      return setOnModal(true);
    }
    navigate(from ? from : "/");
  }

  async function saveFile() {
    const id = auth.user.id;
    const audioFile = new File([recorderState.blob], "test", {
      type: "audio/wav",
    });

    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("min", recorderState.recordingMin);
    formData.append("sec", recorderState.recordingSec);
    formData.append("title", speechState.title);
    formData.append("frequency", JSON.stringify(speechState.pitchStatus));
    formData.append("subThemes", JSON.stringify(speechState.subThemes));
    formData.append("userPitch", JSON.stringify(speechState.userPitch));
    formData.append("selectedTone", JSON.stringify(speechState.speechTone));

    // console.log(JSON.stringify(speechState.pitchStatus));
    // console.log(JSON.stringify(speechState.subThemes));
    // console.log(JSON.stringify(speechState.userPitch));
    // console.log(JSON.stringify(speechState.speechTone));

    await axios.post(`users/${id}/files`, formData, {
      headers: { "content-type": "multipart/form-data" },
    });
  }

  return (
    <ReviewLayout>
      <NavBar onReturnBtnClick={onReturnBtnClick} />
      <h1>{title}</h1>
      <Keyboard selectedNote={speechTone.note} />
      <audio controls src={recorderState.audio} />
      <h2>{speechTone.text}</h2>
      {!!subThemes.length && (
        <SubThemeList>
          {speechState.subThemes.map((subTheme) => {
            const key = nanoid();

            return (
              <li key={key}>
                <span>{`${formatMin(subTheme.min)}분 ${formatSec(
                  subTheme.sec,
                )}초`}</span>
                <span>{subTheme.text}</span>
                <input type="checkbox" />
              </li>
            );
          })}
        </SubThemeList>
      )}
      <ButtonLarge text="연습 저장하기" onClick={saveFile} />
      {onModal && (
        <Modal setOnModal={setOnModal}>
          <NoticeLayout>
            <span>알림</span>
            <p>
              현재 리뷰중인 파일이 저장되지 않았습니다. 새로운 스피치 연습으로
              이동하시겠습니까?
            </p>
            <ButtonBox>
              <ButtonSmall
                size={{ width: "80px", height: "29px" }}
                text="예"
                onClick={() => {
                  speechHandlers.clearSpeech();
                  recorderHandlers.cancelRecording();
                  navigate(from ? from : "/");
                }}
              />
              <ButtonSmall
                size={{ width: "80px", height: "29px" }}
                text="아니요"
                onClick={() => {
                  setOnModal(false);
                }}
              />
            </ButtonBox>
          </NoticeLayout>
        </Modal>
      )}
    </ReviewLayout>
  );
}

const ReviewLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;

  h1 {
    font-size: 30px;
    margin-top: 30px;
  }

  audio {
    margin: 10px 0px;
  }

  h2 {
    font-size: 22px;
    margin: 10px 0px;
  }

  button {
    position: absolute;
    bottom: 11%;
  }
`;

const SubThemeList = styled.ul`
  width: 88%;
  height: 25%;
  overflow-y: auto;

  ::-webkit-scrollbar {
    display: none;
  }

  li {
    width: 100%;
    border-bottom: 1px solid white;
    margin-top: 25px;

    span {
      display: inline-block;
      height: 35px;
      font-size: 21px;
      text-align: center;

      &:nth-child(1) {
        width: 30%;
      }

      &:nth-child(2) {
        width: 60%;
      }
    }
  }
`;

const NoticeLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    font-size: 20px;
  }

  p {
    margin-top: 15px;
    width: 85%;
    line-height: 130%;
    font-size: 16px;
  }
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 80%;
  height: 50px;
  margin-top: 15px;

  button {
    position: relative;
  }
`;

Review.propTypes = {
  files: propTypes.array,
  setFiles: propTypes.func,
  speechState: propTypes.object,
  speechHandlers: propTypes.object,
  recorderState: propTypes.object,
  recorderHandlers: propTypes.object,
};

export default Review;
