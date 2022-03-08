import React, { useEffect } from "react";
import styled from "styled-components";
import propTypes from "prop-types";
import NavBar from "../../components/Navbar/NavBar";
import { useLocation, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { formatMin, formatSec } from "../../util/formatTime";
import { DateTime } from "luxon";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { getFiles, deleteFile } from "../../api/files";
import { sortFiles } from "../../util/sortFiles";

function Files({ files, setFiles, speechHandlers }) {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axios = useAxiosPrivate();

  useEffect(async () => {
    if (files.length) return;

    const id = auth.user.id;
    const response = await getFiles({ axios, id });

    setFiles(sortFiles(response.data.files));
  }, []);

  function onReturnBtnClick() {
    navigate("/");
  }

  async function removeFile(e) {
    const id = auth.user.id;
    const filename = e.target.dataset.filename;
    const fileId = e.target.dataset.fileid;
    const result = await deleteFile({ axios, id, filename, fileId });

    setFiles(sortFiles(result.data.files));
  }

  function toReview(file) {
    const { title, url, subThemes, selectedTone, userPitch, pitchStatus, _id } =
      file;
    speechHandlers.setSpeechState({
      title,
      url,
      subThemes,
      userPitch,
      pitchStatus,
      speechTone: selectedTone,
      fileId: _id,
    });
    navigate("/practice/review", {
      state: {
        from: location,
      },
    });
  }

  return (
    <FilesLayout>
      <NavBar onReturnBtnClick={onReturnBtnClick} />
      <FileList>
        {files.length ? (
          files.map((file) => {
            const key = nanoid();
            const filename = file.url.split("/").pop();
            return (
              <li key={key}>
                <RigntSection
                  onClick={() => {
                    toReview(file);
                  }}
                >
                  <span>{file.title}</span>
                  <div>
                    <span>{`${formatMin(file.min)}:${formatSec(
                      file.sec,
                    )}`}</span>
                    <span>
                      {DateTime.fromISO(file.createdAt).toLocaleString(
                        DateTime.DATETIME_MED,
                      )}
                    </span>
                  </div>
                </RigntSection>
                <LeftSection>
                  <i
                    className="fa-solid fa-trash-can"
                    onClick={removeFile}
                    data-filename={filename}
                    data-fileid={file._id}
                  ></i>
                </LeftSection>
              </li>
            );
          })
        ) : (
          <p>저장된 파일이 없습니다.</p>
        )}
      </FileList>
    </FilesLayout>
  );
}

const FilesLayout = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;

  p {
    display: flex;
    justify-content: center;
    position: absolute;
    top: 45%;
    font-size: 20px;
  }
`;

const FileList = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  li {
    display: flex;
    width: 90%;
    height: 40px;
    border-bottom: 1px solid white;
    margin-top: 20px;
  }
`;

const RigntSection = styled.div`
  display: flex;
  align-items: center;
  width: 90%;
  margin-left: 10px;
  margin-bottom: 10px;

  span {
    width: 50%;
    font-size: 24px;
  }

  div {
    display: flex;
    flex-direction: column;
    width: 50%;

    span {
      font-size: 14px;
      width: 100%;
      text-align: end;

      &:nth-child(1) {
        font-size: 20px;
      }

      &:nth-child(2) {
        margin-top: 5px;
        font-size: 12px;
      }
    }
  }
`;
const LeftSection = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  width: 10%;
  margin-right: 10px;
  margin-bottom: 10px;

  i {
    font-size: 23px;
  }
`;

Files.propTypes = {
  files: propTypes.array,
  setFiles: propTypes.func,
  speechState: propTypes.object,
  speechHandlers: propTypes.object,
};

export default Files;
