import axios from "../api/axios";
import useAuth from "./useAuth";

function useRefreshToken() {
  const { setAuth } = useAuth();

  async function refresh() {
    const response = await axios.get("/auth/refresh", {
      withCredentials: true,
    });
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
