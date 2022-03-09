import useAuth from "./useAuth";
import useKapi from "./useKapi";

const REVOKE_AUTH_URL = "/v1/user/unlink";

function useLogout() {
  const kapi = useKapi();
  const { setAuth } = useAuth();

  function signout() {
    setAuth({});
    localStorage.clear();
  }

  async function logout() {
    kapi?.API.request({
      url: REVOKE_AUTH_URL,
      success: signout,
      fail: signout,
    });
  }

  return logout;
}

export default useLogout;
