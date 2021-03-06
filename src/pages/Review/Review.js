import React, { useEffect, useState } from "react";
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
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import { formatMin, formatSec } from "../../util/formatTime";
import { CLOSING_TEXT, TIP_TEXT } from "../../constants/review";
import { createFile, updateFile } from "../../api/files";
import { sortFiles } from "../../util/sortFiles";

function Review({ setFiles, recorderState, speechState }) {
  const [onModal, setOnModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [dominantNote, setDominantNote] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [checkedInputs, setCheckedInputs] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const axios = useAxiosPrivate();
  const { auth } = useAuth();

  const from = location.state?.from?.pathname;
  const { title, speechTone, subThemes, url, fileId } = speechState;

  useEffect(() => {
    if (!recorderState.audio && !url) return;

    const source = document.createElement("source");

    source.src = recorderState.audio ? recorderState.audio : url;
    source.type = "audio/webm";
    document.querySelector("#audio").appendChild(source);
  }, [recorderState.audio, url]);

  useEffect(() => {
    if (!speechState.pitchStatus) return;

    const [dominantNote] = Object.entries(speechState.pitchStatus)
      .sort((a, b) => a[1] - b[1])
      .pop();

    setDominantNote(dominantNote);
  }, [speechState.pitchStatus]);

  useEffect(() => {
    if (from !== "/practice/files") return;

    const isAchieved = [];

    subThemes.forEach((theme) => {
      if (theme.isAchieved) {
        isAchieved.push(theme.text);
      }
    });

    setCheckedInputs([...isAchieved]);
  }, []);

  function changeHandler(checked, name) {
    let newInputs;

    if (checked) {
      newInputs = [...checkedInputs, name];
      setCheckedInputs(newInputs);
    } else {
      newInputs = checkedInputs.filter((el) => el !== name);
      setCheckedInputs(newInputs);
    }

    const prevCheckedInputs = subThemes
      .filter((theme) => theme.isAchieved)
      .map((theme) => theme.text);

    if (
      JSON.stringify(prevCheckedInputs.sort()) !==
      JSON.stringify(newInputs.sort())
    ) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  }

  function onReturnBtnClick() {
    if (from === "/practice/files") {
      navigate(from);
      return;
    }

    if (!isSaved) {
      setModalType("confirm");
      setOnModal(true);
      return;
    }

    navigate(from);
  }

  async function saveFile() {
    const id = auth.user.id;
    const audioFile = new File([recorderState.blob], "test", {
      type: "audio/webm",
    });

    const newSubThemes = speechState.subThemes.map((el) => {
      if (checkedInputs.includes(el.text)) {
        return {
          ...el,
          isAchieved: true,
        };
      }

      return el;
    });

    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("min", recorderState.recordingMin);
    formData.append("sec", recorderState.recordingSec);
    formData.append("title", speechState.title);
    formData.append("frequency", JSON.stringify(speechState.pitchStatus));
    formData.append("subThemes", JSON.stringify(newSubThemes));
    formData.append("userPitch", JSON.stringify(speechState.userPitch));
    formData.append("selectedTone", JSON.stringify(speechState.speechTone));

    try {
      const result = await createFile({ axios, id, formData });
      setFiles(sortFiles(result.data.files));
      setIsSaved(true);
      navigate("/practice/files");
    } catch {
      navigate("/error", {
        state: { error: { code: 500, message: "Internal Server Error" } },
      });
    }
  }

  async function updateSubTheme() {
    const id = auth.user.id;
    const newSubThemes = subThemes.map((theme) => {
      return {
        ...theme,
        isAchieved: checkedInputs.includes(theme.text),
      };
    });

    try {
      const result = await updateFile({ axios, id, newSubThemes, fileId });
      setFiles(sortFiles(result.data.files));
      setIsModified(false);
      navigate("/practice/files");
    } catch {
      navigate("/error", {
        state: { error: { code: 500, message: "Internal Server Error" } },
      });
    }
  }

  function tipModalOpen() {
    setModalType("analyse");
    setOnModal(true);
  }

  return (
    <ReviewLayout>
      <NavBar onReturnBtnClick={onReturnBtnClick} />
      <h1>{title}</h1>
      <TipButtonBox>
        <ButtonSmall
          size={{ width: "80px", height: "29px" }}
          text="?????? ??????"
          onClick={tipModalOpen}
        />
      </TipButtonBox>
      <h2>{speechTone?.text}</h2>
      <Keyboard selectedNote={speechTone?.note} currentNote={dominantNote} />
      <audio id="audio" controls></audio>
      {!!subThemes.length && (
        <>
          <span>
            ????????? ?????????:{" "}
            {Math.round((checkedInputs.length / subThemes.length) * 100)}%
          </span>
          <SubThemeList>
            {speechState.subThemes.map((subTheme) => {
              const key = nanoid();

              return (
                <li key={key}>
                  <span>{`${formatMin(subTheme.min)}??? ${formatSec(
                    subTheme.sec,
                  )}???`}</span>
                  <span>{subTheme.text}</span>
                  <input
                    type="checkbox"
                    name={subTheme.text}
                    checked={checkedInputs.includes(subTheme.text)}
                    onChange={(e) => {
                      const { checked, name } = e.currentTarget;
                      changeHandler(checked, name);
                    }}
                  />
                </li>
              );
            })}
          </SubThemeList>
        </>
      )}
      {from === "/practice/files" && (
        <ButtonLarge
          text="?????? ????????????"
          onClick={updateSubTheme}
          disabled={!isModified}
        />
      )}
      {from === "/practice/new" && (
        <ButtonLarge
          text="?????? ????????????"
          onClick={saveFile}
          disabled={isSaved}
        />
      )}
      {onModal && (
        <Modal setOnModal={setOnModal}>
          <NoticeLayout>
            {modalType === "confirm" && (
              <>
                <span>??????</span>
                <p>
                  ?????? ???????????? ????????? ???????????? ???????????????. ????????? ?????????
                  ???????????? ?????????????????????????
                </p>
                <ButtonBox>
                  <ButtonSmall
                    size={{ width: "80px", height: "29px" }}
                    text="???"
                    onClick={() => {
                      navigate(from ? from : "/");
                    }}
                  />
                  <ButtonSmall
                    size={{ width: "80px", height: "29px" }}
                    text="?????????"
                    onClick={() => {
                      setOnModal(false);
                    }}
                  />
                </ButtonBox>
              </>
            )}
            {modalType === "analyse" && (
              <TipBox>
                <p>
                  {auth.user.nickname}?????? ???????????? ??????????????? {dominantNote}???
                  ?????????.
                </p>
                <p>{TIP_TEXT[dominantNote]}</p>
                {speechState.speechTone.note === dominantNote ? (
                  <p>{CLOSING_TEXT.matching}</p>
                ) : (
                  <p>{CLOSING_TEXT.different}</p>
                )}
              </TipBox>
            )}
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
    font-size: 20px;
    margin-top: 15px;
  }

  button {
    position: absolute;
    bottom: 11%;
  }

  button:disabled {
    background-color: var(--ice-grey-color);
    color: var(--dark-grey-blue-color);
  }

  span {
    font-size: 20px;
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

const TipButtonBox = styled.div`
  button {
    posiiton: absolute;
    top: 2.5%;
    right: 3%;
  }
`;

const TipBox = styled.div`
  width: 90%;
  height: 100%;
  border-radius: 5px;
  padding: 5px;

  p {
    width: 100%;
    font-size: 18px;
    text-align: left;
  }
`;

Review.propTypes = {
  files: propTypes.array,
  setFiles: propTypes.func,
  speechState: propTypes.object,
  recorderState: propTypes.object,
};

export default Review;
