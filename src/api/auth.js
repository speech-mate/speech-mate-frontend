import axios from "./axios";

const LOGIN_URL = "/auth/login";

export async function userLogin(kakaoAccount) {
  const {
    email,
    profile: { nickname, thumbnail_image_url: photo },
  } = kakaoAccount;

  const res = await axios.post(
    LOGIN_URL,
    { email, nickname, photo },
    {
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": process.env.REACT_APP_BASE_URL,
      },
      withCredentials: true,
    },
  );

  return res.data;
}
