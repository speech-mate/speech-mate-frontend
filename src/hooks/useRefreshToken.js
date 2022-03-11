import axios from "../api/axios";
import useAuth from "./useAuth";

const REFRESH_TOKEN = "jwt";

function useRefreshToken() {
  const { setAuth } = useAuth();
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);

  async function refresh() {
    const response = await axios.post(
      "/auth/refresh",
      {
        refreshToken,
      },
      {
        withCredentials: true,
      },
    );
    const {
      userInfo: { _id: id, nickname, email, photo },
      accessToken,
    } = response.data.data;
    setAuth({
      user: {
        id,
        nickname,
        email,
        photo,
      },
      accessToken,
    });

    return accessToken;
  }

  return refresh;
}

export default useRefreshToken;
